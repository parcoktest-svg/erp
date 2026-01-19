package com.erp.finance.service;

import java.math.BigDecimal;
import java.util.ArrayList;
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
import com.erp.finance.entity.Invoice;
import com.erp.finance.entity.JournalEntry;
import com.erp.finance.entity.JournalLine;
import com.erp.finance.entity.Payment;
import com.erp.finance.entity.PaymentAllocation;
import com.erp.finance.model.GlAccountCode;
import com.erp.finance.model.InvoiceType;
import com.erp.finance.repository.InvoiceRepository;
import com.erp.finance.repository.JournalEntryRepository;
import com.erp.finance.repository.PaymentAllocationRepository;
import com.erp.finance.repository.PaymentRepository;
import com.erp.finance.request.CreateAllocationPaymentRequest;
import com.erp.finance.service.GlAccountMappingService;
import com.erp.finance.service.AccountingPeriodService;
import com.erp.masterdata.entity.BusinessPartner;
import com.erp.masterdata.repository.BusinessPartnerRepository;

@Service
public class AllocationPaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentAllocationRepository paymentAllocationRepository;
    private final InvoiceRepository invoiceRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final CompanyRepository companyRepository;
    private final OrgRepository orgRepository;
    private final BusinessPartnerRepository businessPartnerRepository;
    private final DocumentNoService documentNoService;
    private final GlAccountMappingService glAccountMappingService;
    private final AccountingPeriodService accountingPeriodService;

    public AllocationPaymentService(
            PaymentRepository paymentRepository,
            PaymentAllocationRepository paymentAllocationRepository,
            InvoiceRepository invoiceRepository,
            JournalEntryRepository journalEntryRepository,
            CompanyRepository companyRepository,
            OrgRepository orgRepository,
            BusinessPartnerRepository businessPartnerRepository,
            DocumentNoService documentNoService,
            GlAccountMappingService glAccountMappingService,
            AccountingPeriodService accountingPeriodService) {
        this.paymentRepository = paymentRepository;
        this.paymentAllocationRepository = paymentAllocationRepository;
        this.invoiceRepository = invoiceRepository;
        this.journalEntryRepository = journalEntryRepository;
        this.companyRepository = companyRepository;
        this.orgRepository = orgRepository;
        this.businessPartnerRepository = businessPartnerRepository;
        this.documentNoService = documentNoService;
        this.glAccountMappingService = glAccountMappingService;
        this.accountingPeriodService = accountingPeriodService;
    }

    @Transactional
    public Payment createAllocatedPayment(Long companyId, CreateAllocationPaymentRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        final Org org = request.getOrgId() != null
                ? orgRepository.findById(request.getOrgId())
                        .orElseThrow(() -> new IllegalArgumentException("Org not found"))
                : null;

        BusinessPartner bp = businessPartnerRepository.findById(request.getBusinessPartnerId())
                .orElseThrow(() -> new IllegalArgumentException("BusinessPartner not found"));

        if (request.getAllocations() == null || request.getAllocations().isEmpty()) {
            throw new IllegalArgumentException("Allocations must not be empty");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        InvoiceType invoiceType = null;

        List<Invoice> invoices = new ArrayList<>();
        List<BigDecimal> amounts = new ArrayList<>();

        for (CreateAllocationPaymentRequest.AllocationLine line : request.getAllocations()) {
            if (line.getAmount() == null || line.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Allocation amount must be > 0");
            }

            Invoice invoice = invoiceRepository.findById(line.getInvoiceId())
                    .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));

            if (invoice.getCompany() == null || invoice.getCompany().getId() == null || !invoice.getCompany().getId().equals(companyId)) {
                throw new IllegalArgumentException("Invoice company mismatch");
            }

            if (invoice.getStatus() == com.erp.core.model.DocumentStatus.VOIDED) {
                throw new IllegalArgumentException("Cannot allocate payment to voided invoice");
            }

            if (invoice.getBusinessPartner() == null || invoice.getBusinessPartner().getId() == null
                    || !invoice.getBusinessPartner().getId().equals(bp.getId())) {
                throw new IllegalArgumentException("Invoice business partner mismatch");
            }

            BigDecimal open = invoice.getOpenAmount();
            if (open == null) {
                open = invoice.getGrandTotal();
            }
            if (open == null) {
                open = BigDecimal.ZERO;
            }

            if (line.getAmount().compareTo(open) > 0) {
                throw new IllegalArgumentException("Allocation amount exceeds invoice open amount");
            }

            if (invoiceType == null) {
                invoiceType = invoice.getInvoiceType();
            } else if (invoice.getInvoiceType() != invoiceType) {
                throw new IllegalArgumentException("All allocated invoices must have the same invoiceType");
            }

            invoices.add(invoice);
            amounts.add(line.getAmount());
            totalAmount = totalAmount.add(line.getAmount());
        }

        if (invoiceType == null) {
            throw new IllegalArgumentException("Invoice type could not be determined");
        }

        final InvoiceType finalInvoiceType = invoiceType;
        final BigDecimal finalTotalAmount = totalAmount;

        accountingPeriodService.assertPostingAllowed(companyId, request.getPaymentDate());

        String paymentDocNo = documentNoService.nextDocumentNo(companyId, DocumentType.PAYMENT);
        JournalEntry je = journalEntryRepository
                .findByCompanyIdAndSourceDocumentTypeAndSourceDocumentNo(companyId, DocumentType.PAYMENT, paymentDocNo)
                .orElseGet(() -> {
                    JournalEntry created = createJournalForPayment(company, org, finalInvoiceType, paymentDocNo, request.getPaymentDate(), finalTotalAmount, request.getDescription());
                    validateBalanced(created);
                    return journalEntryRepository.save(created);
                });

        Payment payment = new Payment();
        payment.setCompany(company);
        payment.setOrg(org);
        payment.setBusinessPartner(bp);
        payment.setInvoice(null);
        payment.setPaymentDate(request.getPaymentDate());
        payment.setAmount(finalTotalAmount);
        payment.setDocumentNo(paymentDocNo);
        payment.setJournalEntry(je);
        payment.setStatus(DocumentStatus.COMPLETED);

        Payment savedPayment = paymentRepository.save(payment);

        for (int i = 0; i < invoices.size(); i++) {
            Invoice invoice = invoices.get(i);
            BigDecimal amt = amounts.get(i);

            PaymentAllocation alloc = new PaymentAllocation();
            alloc.setPayment(savedPayment);
            alloc.setInvoice(invoice);
            alloc.setAmount(amt);
            paymentAllocationRepository.save(alloc);

            BigDecimal paid = invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO;
            BigDecimal open = invoice.getOpenAmount() != null ? invoice.getOpenAmount() : invoice.getGrandTotal();
            if (open == null) {
                open = BigDecimal.ZERO;
            }

            invoice.setPaidAmount(paid.add(amt));
            invoice.setOpenAmount(open.subtract(amt));
            if (invoice.getOpenAmount() != null && invoice.getOpenAmount().compareTo(BigDecimal.ZERO) == 0) {
                invoice.setStatus(com.erp.core.model.DocumentStatus.COMPLETED);
            }
            invoiceRepository.save(invoice);
        }

        return savedPayment;
    }

    private JournalEntry createJournalForPayment(
            Company company,
            Org org,
            InvoiceType invoiceType,
            String paymentDocNo,
            java.time.LocalDate accountingDate,
            BigDecimal amount,
            String description) {

        JournalEntry je = new JournalEntry();
        je.setCompany(company);
        je.setOrg(org);
        je.setAccountingDate(accountingDate);
        je.setDescription(description != null ? description : "Payment allocation");
        je.setSourceDocumentType(DocumentType.PAYMENT);
        je.setSourceDocumentNo(paymentDocNo);
        je.setDocumentNo(documentNoService.nextDocumentNo(company.getId(), DocumentType.JOURNAL_ENTRY));
        je.setStatus(DocumentStatus.COMPLETED);

        // AR allocation payment: Debit CASH, Credit AR
        // AP allocation payment: Debit AP, Credit CASH
        if (invoiceType == InvoiceType.AR) {
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
