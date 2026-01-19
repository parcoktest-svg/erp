package com.erp.finance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.erp.core.model.DocumentStatus;
import com.erp.finance.model.InvoiceType;

public class InvoiceDto {

    private Long id;
    private Long companyId;
    private Long orgId;
    private Long businessPartnerId;
    private InvoiceType invoiceType;
    private Long taxRateId;
    private String documentNo;
    private DocumentStatus status;
    private LocalDate invoiceDate;
    private BigDecimal totalNet;
    private BigDecimal totalTax;
    private BigDecimal grandTotal;
    private BigDecimal paidAmount;
    private BigDecimal openAmount;
    private List<InvoiceLineDto> lines;
    private List<InvoiceTaxLineDto> taxLines;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public Long getBusinessPartnerId() {
        return businessPartnerId;
    }

    public void setBusinessPartnerId(Long businessPartnerId) {
        this.businessPartnerId = businessPartnerId;
    }

    public InvoiceType getInvoiceType() {
        return invoiceType;
    }

    public void setInvoiceType(InvoiceType invoiceType) {
        this.invoiceType = invoiceType;
    }

    public Long getTaxRateId() {
        return taxRateId;
    }

    public void setTaxRateId(Long taxRateId) {
        this.taxRateId = taxRateId;
    }

    public String getDocumentNo() {
        return documentNo;
    }

    public void setDocumentNo(String documentNo) {
        this.documentNo = documentNo;
    }

    public DocumentStatus getStatus() {
        return status;
    }

    public void setStatus(DocumentStatus status) {
        this.status = status;
    }

    public LocalDate getInvoiceDate() {
        return invoiceDate;
    }

    public void setInvoiceDate(LocalDate invoiceDate) {
        this.invoiceDate = invoiceDate;
    }

    public BigDecimal getTotalNet() {
        return totalNet;
    }

    public void setTotalNet(BigDecimal totalNet) {
        this.totalNet = totalNet;
    }

    public BigDecimal getTotalTax() {
        return totalTax;
    }

    public void setTotalTax(BigDecimal totalTax) {
        this.totalTax = totalTax;
    }

    public BigDecimal getGrandTotal() {
        return grandTotal;
    }

    public void setGrandTotal(BigDecimal grandTotal) {
        this.grandTotal = grandTotal;
    }

    public BigDecimal getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(BigDecimal paidAmount) {
        this.paidAmount = paidAmount;
    }

    public BigDecimal getOpenAmount() {
        return openAmount;
    }

    public void setOpenAmount(BigDecimal openAmount) {
        this.openAmount = openAmount;
    }

    public List<InvoiceLineDto> getLines() {
        return lines;
    }

    public void setLines(List<InvoiceLineDto> lines) {
        this.lines = lines;
    }

    public List<InvoiceTaxLineDto> getTaxLines() {
        return taxLines;
    }

    public void setTaxLines(List<InvoiceTaxLineDto> taxLines) {
        this.taxLines = taxLines;
    }
}
