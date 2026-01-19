package com.erp.finance.request;

import java.time.LocalDate;
import java.util.List;

import com.erp.finance.model.InvoiceType;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class CreateInvoiceRequest {

    private Long orgId;

    @NotNull
    private Long businessPartnerId;

    @NotNull
    private InvoiceType invoiceType;

    private Long taxRateId;

    @NotNull
    private LocalDate invoiceDate;

    @Valid
    @NotNull
    private List<CreateInvoiceLineRequest> lines;

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

    public LocalDate getInvoiceDate() {
        return invoiceDate;
    }

    public void setInvoiceDate(LocalDate invoiceDate) {
        this.invoiceDate = invoiceDate;
    }

    public List<CreateInvoiceLineRequest> getLines() {
        return lines;
    }

    public void setLines(List<CreateInvoiceLineRequest> lines) {
        this.lines = lines;
    }

    public static class CreateInvoiceLineRequest {
        @NotNull
        private Long productId;

        @NotNull
        private java.math.BigDecimal qty;

        @NotNull
        private java.math.BigDecimal price;

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public java.math.BigDecimal getQty() {
            return qty;
        }

        public void setQty(java.math.BigDecimal qty) {
            this.qty = qty;
        }

        public java.math.BigDecimal getPrice() {
            return price;
        }

        public void setPrice(java.math.BigDecimal price) {
            this.price = price;
        }
    }
}
