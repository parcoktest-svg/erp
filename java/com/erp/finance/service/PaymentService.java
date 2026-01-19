package com.erp.finance.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.entity.Company;
import com.erp.core.entity.Org;
import com.erp.core.model.DocumentStatus;
import com.erp.core.model.DocumentType;
import com.erp.core.repository.CompanyRepository;
import com.erp.core.repository.OrgRepository;
import com.erp.core.service.DocumentNoService;
import com.erp.finance.entity.GlAccount;
import com.erp.finance.service.GlAccountMappingService;
import com.erp.finance.service.AccountingPeriodService;
import com.erp.finance.entity.Invoice;
import com.erp.finance.entity.JournalEntry;
import com.erp.finance.entity.JournalLine;
import com.erp.finance.entity.Payment;
import com.erp.finance.model.GlAccountCode;
import com.erp.finance.model.InvoiceType;
import com.erp.finance.repository.InvoiceRepository;
import com.erp.finance.repository.JournalEntryRepository;
import com.erp.finance.repository.PaymentRepository;
import com.erp.finance.request.CreatePaymentRequest;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final CompanyRepository companyRepository;
    private final OrgRepository orgRepository;
    private final DocumentNoService documentNoService;
    private final GlAccountMappingService glAccountMappingService;
    private final AccountingPeriodService accountingPeriodService;

    public PaymentService(
            PaymentRepository paymentRepository,
            InvoiceRepository invoiceRepository,
            JournalEntryRepository journalEntryRepository,
            CompanyRepository companyRepository,
            OrgRepository orgRepository,
            DocumentNoService documentNoService,
            GlAccountMappingService glAccountMappingService,
            AccountingPeriodService accountingPeriodService) {
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
        this.journalEntryRepository = journalEntryRepository;
        this.companyRepository = companyRepository;
        this.orgRepository = orgRepository;
        this.documentNoService = documentNoService;
        this.glAccountMappingService = glAccountMappingService;
        this.accountingPeriodService = accountingPeriodService;
    }

    public List<Payment> listByCompany(Long companyId) {
        return paymentRepository.findByCompanyId(companyId);
    }

    public List<Payment> listByInvoice(Long invoiceId) {
        return paymentRepository.findByInvoiceId(invoiceId);
    }

    @Transactional
    public Payment create(Long companyId, CreatePaymentRequest request) {
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be > 0");
        }

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        final Org org = request.getOrgId() != null
                ? orgRepository.findById(request.getOrgId())
                        .orElseThrow(() -> new IllegalArgumentException("Org not found"))
                : null;

        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));

        if (invoice.getCompany() == null || invoice.getCompany().getId() == null || !invoice.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Invoice company mismatch");
        }

        if (invoice.getStatus() == com.erp.core.model.DocumentStatus.VOIDED) {
            throw new IllegalArgumentException("Cannot pay voided invoice");
        }

        BigDecimal open = invoice.getOpenAmount() != null ? invoice.getOpenAmount() : invoice.getGrandTotal();
        if (open == null) {
            open = BigDecimal.ZERO;
        }

        if (request.getAmount().compareTo(open) > 0) {
            throw new IllegalArgumentException("Payment amount exceeds invoice open amount");
        }

        accountingPeriodService.assertPostingAllowed(companyId, request.getPaymentDate());

        String paymentDocNo = documentNoService.nextDocumentNo(companyId, DocumentType.PAYMENT);
        JournalEntry je = journalEntryRepository
                .findByCompanyIdAndSourceDocumentTypeAndSourceDocumentNo(companyId, DocumentType.PAYMENT, paymentDocNo)
                .orElseGet(() -> {
                    JournalEntry created = createJournalForPayment(company, org, invoice, paymentDocNo, request.getPaymentDate(), request.getAmount(), request.getDescription());
                    validateBalanced(created);
                    return journalEntryRepository.save(created);
                });

        Payment payment = new Payment();
        payment.setCompany(company);
        payment.setOrg(org);
        payment.setBusinessPartner(invoice.getBusinessPartner());
        payment.setInvoice(invoice);
        payment.setPaymentDate(request.getPaymentDate());
        payment.setAmount(request.getAmount());
        payment.setDocumentNo(paymentDocNo);
        payment.setJournalEntry(je);
        payment.setStatus(DocumentStatus.COMPLETED);

        Payment saved = paymentRepository.save(payment);

        BigDecimal paid = invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO;
        invoice.setPaidAmount(paid.add(request.getAmount()));
        invoice.setOpenAmount(open.subtract(request.getAmount()));
        if (invoice.getOpenAmount() != null && invoice.getOpenAmount().compareTo(BigDecimal.ZERO) == 0) {
            invoice.setStatus(com.erp.core.model.DocumentStatus.COMPLETED);
        }
        invoiceRepository.save(invoice);

        return saved;
    }

    private JournalEntry createJournalForPayment(
            Company company,
            Org org,
            Invoice invoice,
            String paymentDocNo,
            java.time.LocalDate accountingDate,
            BigDecimal amount,
            String description) {

        JournalEntry je = new JournalEntry();
        je.setCompany(company);
        je.setOrg(org);
        je.setAccountingDate(accountingDate);
        je.setDescription(description != null ? description : ("Payment for " + invoice.getDocumentNo()));
        je.setSourceDocumentType(DocumentType.PAYMENT);
        je.setSourceDocumentNo(paymentDocNo);
        je.setDocumentNo(documentNoService.nextDocumentNo(company.getId(), DocumentType.JOURNAL_ENTRY));
        je.setStatus(DocumentStatus.COMPLETED);

        // Minimal accounting:
        // AR payment: Debit CASH, Credit AR
        // AP payment: Debit AP, Credit CASH
        if (invoice.getInvoiceType() == InvoiceType.AR) {
            je.setLines(List.of(
                    createLine(je, GlAccountCode.CASH, amount, BigDecimal.ZERO),
                    createLine(je, GlAccountCode.AR, BigDecimal.ZERO, amount)
            ));
        } else {
            je.setLines(List.of(
                    createLine(je, GlAccountCode.AP, amount, BigDecimal.ZERO),
                    createLine(je, GlAccountCode.CASH, BigDecimal.ZERO, amount)
            ));
        }

        return je;
    }

	private void validateBalanced(JournalEntry je) {
		if (je.getSourceDocumentType() != null) {
			if (je.getSourceDocumentNo() == null || je.getSourceDocumentNo().isBlank()) {
				throw new IllegalArgumentException("sourceDocumentNo is required when sourceDocumentType is set");
			}
		}

		BigDecimal debit = BigDecimal.ZERO;
		BigDecimal credit = BigDecimal.ZERO;
		if (je.getLines() != null) {
			for (JournalLine l : je.getLines()) {
				debit = debit.add(l.getDebit() != null ? l.getDebit() : BigDecimal.ZERO);
				credit = credit.add(l.getCredit() != null ? l.getCredit() : BigDecimal.ZERO);
			}
		}
		if (debit.compareTo(credit) != 0) {
			throw new IllegalArgumentException("Journal not balanced (debit=" + debit + ", credit=" + credit + ")");
		}
	}

    private JournalLine createLine(JournalEntry je, GlAccountCode account, BigDecimal debit, BigDecimal credit) {
        JournalLine line = new JournalLine();
        line.setJournalEntry(je);
        line.setAccountCode(account);
        GlAccount gl = glAccountMappingService.resolve(je.getCompany().getId(), account);
        line.setGlAccount(gl);
        line.setDebit(debit);
        line.setCredit(credit);
        return line;
    }
}
