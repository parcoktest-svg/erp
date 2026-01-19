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
import com.erp.finance.repository.InvoiceRepository;
import com.erp.finance.repository.JournalEntryRepository;
import com.erp.finance.request.VoidInvoiceRequest;
import com.erp.finance.service.AccountingPeriodService;

@Service
public class InvoiceVoidService {

    private final InvoiceRepository invoiceRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final DocumentNoService documentNoService;
    private final AccountingPeriodService accountingPeriodService;

    public InvoiceVoidService(
            InvoiceRepository invoiceRepository,
            JournalEntryRepository journalEntryRepository,
            DocumentNoService documentNoService,
            AccountingPeriodService accountingPeriodService) {
        this.invoiceRepository = invoiceRepository;
        this.journalEntryRepository = journalEntryRepository;
        this.documentNoService = documentNoService;
        this.accountingPeriodService = accountingPeriodService;
    }

    @Transactional
    public Invoice voidInvoice(Long companyId, Long invoiceId, VoidInvoiceRequest request) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));

        if (invoice.getCompany() == null || invoice.getCompany().getId() == null || !invoice.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Invoice company mismatch");
        }

        if (invoice.getStatus() == DocumentStatus.VOIDED) {
            throw new IllegalArgumentException("Invoice already voided");
        }

        if (invoice.getPaidAmount() != null && invoice.getPaidAmount().compareTo(BigDecimal.ZERO) > 0) {
            throw new IllegalArgumentException("Cannot void invoice with payments");
        }

        JournalEntry original = invoice.getJournalEntry();
        if (original != null) {
			accountingPeriodService.assertPostingAllowed(companyId, request.getVoidDate());

			String reversalSourceNo = invoice.getDocumentNo() + ":VOID";
			boolean exists = journalEntryRepository
					.findByCompanyIdAndSourceDocumentTypeAndSourceDocumentNo(companyId, DocumentType.INVOICE, reversalSourceNo)
					.isPresent();
			if (!exists) {
				JournalEntry reversal = new JournalEntry();
				reversal.setCompany(invoice.getCompany());
				reversal.setOrg(invoice.getOrg());
				reversal.setAccountingDate(request.getVoidDate());
				reversal.setStatus(DocumentStatus.COMPLETED);
				reversal.setSourceDocumentType(DocumentType.INVOICE);
				reversal.setSourceDocumentNo(reversalSourceNo);
				reversal.setDocumentNo(documentNoService.nextDocumentNo(companyId, DocumentType.JOURNAL_ENTRY));
				reversal.setDescription("Reversal of " + original.getDocumentNo() + " for invoice " + invoice.getDocumentNo());

				List<JournalLine> reversedLines = original.getLines().stream().map(l -> reverseLine(reversal, l)).toList();
				reversal.setLines(reversedLines);

				journalEntryRepository.save(reversal);
			}
        }

        invoice.setStatus(DocumentStatus.VOIDED);
        invoice.setOpenAmount(BigDecimal.ZERO);
        invoiceRepository.save(invoice);

        return invoice;
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
