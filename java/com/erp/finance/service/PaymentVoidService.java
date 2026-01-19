package com.erp.finance.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.model.DocumentStatus;
import com.erp.core.model.DocumentType;
import com.erp.core.service.DocumentNoService;
import com.erp.finance.entity.Invoice;
import com.erp.finance.entity.JournalEntry;
import com.erp.finance.entity.JournalLine;
import com.erp.finance.entity.Payment;
import com.erp.finance.entity.PaymentAllocation;
import com.erp.finance.repository.InvoiceRepository;
import com.erp.finance.repository.JournalEntryRepository;
import com.erp.finance.repository.PaymentAllocationRepository;
import com.erp.finance.repository.PaymentRepository;
import com.erp.finance.request.VoidPaymentRequest;
import com.erp.finance.service.AccountingPeriodService;

@Service
public class PaymentVoidService {

    private final PaymentRepository paymentRepository;
    private final PaymentAllocationRepository paymentAllocationRepository;
    private final InvoiceRepository invoiceRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final DocumentNoService documentNoService;
    private final AccountingPeriodService accountingPeriodService;

    public PaymentVoidService(
            PaymentRepository paymentRepository,
            PaymentAllocationRepository paymentAllocationRepository,
            InvoiceRepository invoiceRepository,
            JournalEntryRepository journalEntryRepository,
            DocumentNoService documentNoService,
            AccountingPeriodService accountingPeriodService) {
        this.paymentRepository = paymentRepository;
        this.paymentAllocationRepository = paymentAllocationRepository;
        this.invoiceRepository = invoiceRepository;
        this.journalEntryRepository = journalEntryRepository;
        this.documentNoService = documentNoService;
        this.accountingPeriodService = accountingPeriodService;
    }

    @Transactional
    public Payment voidPayment(Long companyId, Long paymentId, VoidPaymentRequest request) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        if (payment.getCompany() == null || payment.getCompany().getId() == null || !payment.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Payment company mismatch");
        }

        if (payment.getStatus() == DocumentStatus.VOIDED) {
            throw new IllegalArgumentException("Payment already voided");
        }

        // Reverse allocations / invoice impact
        List<PaymentAllocation> allocations = paymentAllocationRepository.findByPaymentId(paymentId);
        if (!allocations.isEmpty()) {
            for (PaymentAllocation alloc : allocations) {
                reverseInvoiceAmounts(companyId, alloc.getInvoice(), alloc.getAmount());
            }
        } else if (payment.getInvoice() != null) {
            reverseInvoiceAmounts(companyId, payment.getInvoice(), payment.getAmount());
        }

        // Reversal journal entry
        JournalEntry originalJe = payment.getJournalEntry();
        if (originalJe != null) {
			accountingPeriodService.assertPostingAllowed(companyId, request.getVoidDate());

			String reversalSourceNo = payment.getDocumentNo() + ":VOID";
			boolean exists = journalEntryRepository
					.findByCompanyIdAndSourceDocumentTypeAndSourceDocumentNo(companyId, DocumentType.PAYMENT, reversalSourceNo)
					.isPresent();
			if (!exists) {
				JournalEntry reversal = new JournalEntry();
				reversal.setCompany(payment.getCompany());
				reversal.setOrg(payment.getOrg());
				reversal.setAccountingDate(request.getVoidDate());
				reversal.setStatus(DocumentStatus.COMPLETED);
				reversal.setSourceDocumentType(DocumentType.PAYMENT);
				reversal.setSourceDocumentNo(reversalSourceNo);
				reversal.setDocumentNo(documentNoService.nextDocumentNo(companyId, DocumentType.JOURNAL_ENTRY));
				reversal.setDescription("Reversal of " + originalJe.getDocumentNo() + " for payment " + payment.getDocumentNo());

				List<JournalLine> reversedLines = originalJe.getLines().stream().map(l -> reverseLine(reversal, l)).toList();
				reversal.setLines(reversedLines);

				journalEntryRepository.save(reversal);
			}
        }

        payment.setStatus(DocumentStatus.VOIDED);
        return paymentRepository.save(payment);
    }

    private void reverseInvoiceAmounts(Long companyId, Invoice invoiceRef, BigDecimal amount) {
        if (invoiceRef == null || invoiceRef.getId() == null) {
            throw new IllegalArgumentException("Invoice not found for reversal");
        }

        Invoice invoice = invoiceRepository.findById(invoiceRef.getId())
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));

        if (invoice.getCompany() == null || invoice.getCompany().getId() == null || !invoice.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Invoice company mismatch");
        }

        BigDecimal paid = invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO;
        BigDecimal open = invoice.getOpenAmount() != null ? invoice.getOpenAmount() : BigDecimal.ZERO;

        BigDecimal newPaid = paid.subtract(amount);
        if (newPaid.compareTo(BigDecimal.ZERO) < 0) {
            newPaid = BigDecimal.ZERO;
        }

        invoice.setPaidAmount(newPaid);
        invoice.setOpenAmount(open.add(amount));

        invoiceRepository.save(invoice);
    }

    private JournalLine reverseLine(JournalEntry reversal, JournalLine originalLine) {
        JournalLine line = new JournalLine();
        line.setJournalEntry(reversal);
        line.setAccountCode(originalLine.getAccountCode());
        line.setGlAccount(originalLine.getGlAccount());
        line.setDebit(originalLine.getCredit() != null ? originalLine.getCredit() : BigDecimal.ZERO);
        line.setCredit(originalLine.getDebit() != null ? originalLine.getDebit() : BigDecimal.ZERO);
        return line;
    }
}
