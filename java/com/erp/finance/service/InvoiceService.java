package com.erp.finance.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
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
import com.erp.finance.entity.InvoiceLine;
import com.erp.finance.entity.InvoiceTaxLine;
import com.erp.finance.entity.JournalEntry;
import com.erp.finance.entity.JournalLine;
import com.erp.finance.model.GlAccountCode;
import com.erp.finance.model.InvoiceType;
import com.erp.finance.repository.InvoiceRepository;
import com.erp.finance.repository.JournalEntryRepository;
import com.erp.finance.request.CreateInvoiceRequest;
import com.erp.masterdata.entity.BusinessPartner;
import com.erp.masterdata.entity.Product;
import com.erp.masterdata.entity.TaxRate;
import com.erp.masterdata.repository.BusinessPartnerRepository;
import com.erp.masterdata.repository.ProductRepository;
import com.erp.masterdata.repository.TaxRateRepository;
import com.erp.finance.service.GlAccountMappingService;
import com.erp.finance.service.AccountingPeriodService;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final CompanyRepository companyRepository;
    private final OrgRepository orgRepository;
    private final BusinessPartnerRepository businessPartnerRepository;
    private final TaxRateRepository taxRateRepository;
    private final ProductRepository productRepository;
    private final DocumentNoService documentNoService;
    private final GlAccountMappingService glAccountMappingService;
    private final AccountingPeriodService accountingPeriodService;

    public InvoiceService(
            InvoiceRepository invoiceRepository,
            JournalEntryRepository journalEntryRepository,
            CompanyRepository companyRepository,
            OrgRepository orgRepository,
            BusinessPartnerRepository businessPartnerRepository,
            TaxRateRepository taxRateRepository,
            ProductRepository productRepository,
            DocumentNoService documentNoService,
            GlAccountMappingService glAccountMappingService,
            AccountingPeriodService accountingPeriodService) {
        this.invoiceRepository = invoiceRepository;
        this.journalEntryRepository = journalEntryRepository;
        this.companyRepository = companyRepository;
        this.orgRepository = orgRepository;
        this.businessPartnerRepository = businessPartnerRepository;
        this.taxRateRepository = taxRateRepository;
        this.productRepository = productRepository;
        this.documentNoService = documentNoService;
        this.glAccountMappingService = glAccountMappingService;
        this.accountingPeriodService = accountingPeriodService;
    }

    public List<Invoice> listByCompany(Long companyId) {
        return invoiceRepository.findByCompanyId(companyId);
    }

    @Transactional
    public Invoice create(Long companyId, CreateInvoiceRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        final Org org = request.getOrgId() != null
                ? orgRepository.findById(request.getOrgId())
                        .orElseThrow(() -> new IllegalArgumentException("Org not found"))
                : null;

        BusinessPartner bp = businessPartnerRepository.findById(request.getBusinessPartnerId())
                .orElseThrow(() -> new IllegalArgumentException("BusinessPartner not found"));

        TaxRate taxRate = null;
        if (request.getTaxRateId() != null) {
            taxRate = taxRateRepository.findById(request.getTaxRateId())
                    .orElseThrow(() -> new IllegalArgumentException("TaxRate not found"));
        }

        Invoice invoice = new Invoice();
        invoice.setCompany(company);
        invoice.setOrg(org);
        invoice.setBusinessPartner(bp);
        invoice.setInvoiceType(request.getInvoiceType());
        invoice.setTaxRate(taxRate);
        invoice.setInvoiceDate(request.getInvoiceDate());
        invoice.setDocumentNo(documentNoService.nextDocumentNo(companyId, DocumentType.INVOICE));

        List<InvoiceLine> lines = new ArrayList<>();
        BigDecimal totalNet = BigDecimal.ZERO;

        for (CreateInvoiceRequest.CreateInvoiceLineRequest lineReq : request.getLines()) {
            Product product = productRepository.findById(lineReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            BigDecimal qty = lineReq.getQty();
            BigDecimal price = lineReq.getPrice();
            BigDecimal lineNet = price.multiply(qty);

            InvoiceLine line = new InvoiceLine();
            line.setInvoice(invoice);
            line.setProduct(product);
            line.setUom(product.getUom());
            line.setQty(qty);
            line.setPrice(price);
            line.setLineNet(lineNet);

            lines.add(line);
            totalNet = totalNet.add(lineNet);
        }

        invoice.setLines(lines);
        invoice.setTotalNet(round2(totalNet));

        List<InvoiceTaxLine> taxLines = new ArrayList<>();
        BigDecimal totalTax = BigDecimal.ZERO;
        if (taxRate != null && taxRate.getRate() != null) {
            BigDecimal rawTax = invoice.getTotalNet().multiply(taxRate.getRate());
            BigDecimal taxAmount = round2(rawTax);
            BigDecimal roundingAmount = taxAmount.subtract(rawTax);

            InvoiceTaxLine tl = new InvoiceTaxLine();
            tl.setInvoice(invoice);
            tl.setTaxRate(taxRate);
            tl.setTaxBase(invoice.getTotalNet());
            tl.setTaxAmount(taxAmount);
            tl.setRoundingAmount(round2(roundingAmount));
            taxLines.add(tl);

            totalTax = totalTax.add(taxAmount);
        }

        invoice.setTaxLines(taxLines);
        invoice.setTotalTax(round2(totalTax));
        invoice.setGrandTotal(round2(invoice.getTotalNet().add(invoice.getTotalTax())));
        invoice.setPaidAmount(BigDecimal.ZERO);
        invoice.setOpenAmount(invoice.getGrandTotal());
        invoice.setStatus(DocumentStatus.COMPLETED);

		accountingPeriodService.assertPostingAllowed(companyId, invoice.getInvoiceDate());

        JournalEntry je = journalEntryRepository
                .findByCompanyIdAndSourceDocumentTypeAndSourceDocumentNo(companyId, DocumentType.INVOICE, invoice.getDocumentNo())
                .orElseGet(() -> {
                    JournalEntry created = createJournalForInvoice(company, org, invoice, invoice.getInvoiceDate(), invoice.getTotalNet(), invoice.getTotalTax());
                    validateBalanced(created);
                    return journalEntryRepository.save(created);
                });
        invoice.setJournalEntry(je);

        return invoiceRepository.save(invoice);
    }

     private BigDecimal round2(BigDecimal value) {
         if (value == null) {
             return BigDecimal.ZERO;
         }
         return value.setScale(2, RoundingMode.HALF_UP);
     }

    private JournalEntry createJournalForInvoice(
            Company company,
            Org org,
            Invoice invoice,
            LocalDate accountingDate,
            BigDecimal totalNet,
            BigDecimal totalTax) {

        JournalEntry je = new JournalEntry();
        je.setCompany(company);
        je.setOrg(org);
        je.setAccountingDate(accountingDate);
        je.setDescription("Invoice " + invoice.getDocumentNo());
        je.setSourceDocumentType(DocumentType.INVOICE);
        je.setSourceDocumentNo(invoice.getDocumentNo());
        je.setDocumentNo(documentNoService.nextDocumentNo(company.getId(), DocumentType.JOURNAL_ENTRY));
        je.setStatus(DocumentStatus.COMPLETED);

        BigDecimal grandTotal = totalNet.add(totalTax);
        if (invoice.getInvoiceType() == InvoiceType.AR) {
            // Debit AR, Credit Revenue, Credit Tax Payable
            if (totalTax != null && totalTax.compareTo(BigDecimal.ZERO) != 0) {
                je.setLines(List.of(
                        createLine(je, GlAccountCode.AR, grandTotal, BigDecimal.ZERO),
                        createLine(je, GlAccountCode.REVENUE, BigDecimal.ZERO, totalNet),
                        createLine(je, GlAccountCode.TAX_PAYABLE, BigDecimal.ZERO, totalTax)
                ));
            } else {
                je.setLines(List.of(
                        createLine(je, GlAccountCode.AR, grandTotal, BigDecimal.ZERO),
                        createLine(je, GlAccountCode.REVENUE, BigDecimal.ZERO, totalNet)
                ));
            }
        } else {
            // Debit Expense (+ Tax Receivable), Credit AP
            if (totalTax != null && totalTax.compareTo(BigDecimal.ZERO) != 0) {
                je.setLines(List.of(
                        createLine(je, GlAccountCode.EXPENSE, totalNet, BigDecimal.ZERO),
                        createLine(je, GlAccountCode.TAX_RECEIVABLE, totalTax, BigDecimal.ZERO),
                        createLine(je, GlAccountCode.AP, BigDecimal.ZERO, grandTotal)
                ));
            } else {
                je.setLines(List.of(
                        createLine(je, GlAccountCode.EXPENSE, totalNet, BigDecimal.ZERO),
                        createLine(je, GlAccountCode.AP, BigDecimal.ZERO, grandTotal)
                ));
            }
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
