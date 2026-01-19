package com.erp.finance;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.erp.core.entity.Company;
import com.erp.core.entity.Org;
import com.erp.core.repository.CompanyRepository;
import com.erp.core.repository.OrgRepository;
import com.erp.finance.entity.Invoice;
import com.erp.finance.entity.Payment;
import com.erp.finance.model.InvoiceType;
import com.erp.finance.repository.JournalEntryRepository;
import com.erp.finance.request.CreateInvoiceRequest;
import com.erp.finance.request.CreatePaymentRequest;
import com.erp.finance.request.VoidPaymentRequest;
import com.erp.finance.service.InvoiceService;
import com.erp.finance.service.PaymentService;
import com.erp.finance.service.PaymentVoidService;
import com.erp.masterdata.entity.BusinessPartner;
import com.erp.masterdata.entity.Product;
import com.erp.masterdata.entity.TaxRate;
import com.erp.masterdata.entity.Uom;
import com.erp.masterdata.model.BusinessPartnerType;
import com.erp.masterdata.repository.BusinessPartnerRepository;
import com.erp.masterdata.repository.ProductRepository;
import com.erp.masterdata.repository.TaxRateRepository;
import com.erp.masterdata.repository.UomRepository;

@SpringBootTest
@ActiveProfiles("test")
class FinanceWorkflowIntegrationTest {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private OrgRepository orgRepository;

    @Autowired
    private BusinessPartnerRepository businessPartnerRepository;

    @Autowired
    private UomRepository uomRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private TaxRateRepository taxRateRepository;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PaymentVoidService paymentVoidService;

    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @Test
    void createInvoice_thenPay_thenVoidPayment_shouldRestoreInvoiceOpenAmount_andCreateReversalJournal() {
        Company company = new Company();
        company.setCode("TST");
        company.setName("Test Company");
        company = companyRepository.save(company);

        Org org = new Org();
        org.setCompany(company);
        org.setCode("HQ");
        org.setName("Headquarter");
        org = orgRepository.save(org);

        BusinessPartner bp = new BusinessPartner();
        bp.setCompany(company);
        bp.setName("Customer A");
        bp.setType(BusinessPartnerType.CUSTOMER);
        bp = businessPartnerRepository.save(bp);

        Uom uom = new Uom();
        uom.setCompany(company);
        uom.setCode("EA");
        uom.setName("Each");
        uom = uomRepository.save(uom);

        Product product = new Product();
        product.setCompany(company);
        product.setCode("P-001");
        product.setName("Product 1");
        product.setUom(uom);
        product = productRepository.save(product);

        TaxRate taxRate = new TaxRate();
        taxRate.setCompany(company);
        taxRate.setName("PPN 10% ");
        taxRate.setRate(new BigDecimal("0.10"));
        taxRate = taxRateRepository.save(taxRate);

        CreateInvoiceRequest invReq = new CreateInvoiceRequest();
        invReq.setOrgId(org.getId());
        invReq.setBusinessPartnerId(bp.getId());
        invReq.setInvoiceType(InvoiceType.AR);
        invReq.setTaxRateId(taxRate.getId());
        invReq.setInvoiceDate(LocalDate.of(2026, 1, 1));

        CreateInvoiceRequest.CreateInvoiceLineRequest line = new CreateInvoiceRequest.CreateInvoiceLineRequest();
        line.setProductId(product.getId());
        line.setQty(new BigDecimal("2"));
        line.setPrice(new BigDecimal("100"));
        invReq.setLines(List.of(line));

        Invoice invoice = invoiceService.create(company.getId(), invReq);
        assertThat(invoice.getGrandTotal()).isEqualByComparingTo(new BigDecimal("220.00"));
        assertThat(invoice.getOpenAmount()).isEqualByComparingTo(new BigDecimal("220.00"));
        assertThat(invoice.getPaidAmount()).isEqualByComparingTo(new BigDecimal("0"));

        int jeCountAfterInvoice = journalEntryRepository.findByCompanyId(company.getId()).size();
        assertThat(jeCountAfterInvoice).isGreaterThanOrEqualTo(1);

        CreatePaymentRequest payReq = new CreatePaymentRequest();
        payReq.setOrgId(org.getId());
        payReq.setInvoiceId(invoice.getId());
        payReq.setPaymentDate(LocalDate.of(2026, 1, 2));
        payReq.setAmount(new BigDecimal("50"));
        payReq.setDescription("Partial payment");

        Payment payment = paymentService.create(company.getId(), payReq);
        assertThat(payment.getAmount()).isEqualByComparingTo(new BigDecimal("50"));

        Invoice invoiceAfterPay = invoiceService.listByCompany(company.getId()).stream()
                .filter(i -> i.getId().equals(invoice.getId()))
                .findFirst()
                .orElseThrow();

        assertThat(invoiceAfterPay.getPaidAmount()).isEqualByComparingTo(new BigDecimal("50"));
        assertThat(invoiceAfterPay.getOpenAmount()).isEqualByComparingTo(new BigDecimal("170.00"));

        int jeCountAfterPayment = journalEntryRepository.findByCompanyId(company.getId()).size();
        assertThat(jeCountAfterPayment).isGreaterThanOrEqualTo(2);

        VoidPaymentRequest voidReq = new VoidPaymentRequest();
        voidReq.setVoidDate(LocalDate.of(2026, 1, 3));
        voidReq.setReason("Test void");

        Payment voided = paymentVoidService.voidPayment(company.getId(), payment.getId(), voidReq);
        assertThat(voided.getStatus()).isEqualTo(com.erp.core.model.DocumentStatus.VOIDED);

        Invoice invoiceAfterVoid = invoiceService.listByCompany(company.getId()).stream()
                .filter(i -> i.getId().equals(invoice.getId()))
                .findFirst()
                .orElseThrow();

        assertThat(invoiceAfterVoid.getPaidAmount()).isEqualByComparingTo(new BigDecimal("0"));
        assertThat(invoiceAfterVoid.getOpenAmount()).isEqualByComparingTo(new BigDecimal("220.00"));

        int jeCountAfterVoid = journalEntryRepository.findByCompanyId(company.getId()).size();
        assertThat(jeCountAfterVoid).isGreaterThan(jeCountAfterPayment);
    }
}
