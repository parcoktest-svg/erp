package com.erp.finance.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.erp.finance.model.InvoiceType;

public class AgingReportDto {

    private InvoiceType invoiceType;

    private List<AgingPartnerRowDto> partners = new ArrayList<>();

    private BigDecimal total0To30 = BigDecimal.ZERO;
    private BigDecimal total31To60 = BigDecimal.ZERO;
    private BigDecimal total61To90 = BigDecimal.ZERO;
    private BigDecimal totalOver90 = BigDecimal.ZERO;
    private BigDecimal totalOpen = BigDecimal.ZERO;

    public InvoiceType getInvoiceType() {
        return invoiceType;
    }

    public void setInvoiceType(InvoiceType invoiceType) {
        this.invoiceType = invoiceType;
    }

    public List<AgingPartnerRowDto> getPartners() {
        return partners;
    }

    public void setPartners(List<AgingPartnerRowDto> partners) {
        this.partners = partners;
    }

    public BigDecimal getTotal0To30() {
        return total0To30;
    }

    public void setTotal0To30(BigDecimal total0To30) {
        this.total0To30 = total0To30;
    }

    public BigDecimal getTotal31To60() {
        return total31To60;
    }

    public void setTotal31To60(BigDecimal total31To60) {
        this.total31To60 = total31To60;
    }

    public BigDecimal getTotal61To90() {
        return total61To90;
    }

    public void setTotal61To90(BigDecimal total61To90) {
        this.total61To90 = total61To90;
    }

    public BigDecimal getTotalOver90() {
        return totalOver90;
    }

    public void setTotalOver90(BigDecimal totalOver90) {
        this.totalOver90 = totalOver90;
    }

    public BigDecimal getTotalOpen() {
        return totalOpen;
    }

    public void setTotalOpen(BigDecimal totalOpen) {
        this.totalOpen = totalOpen;
    }
}
