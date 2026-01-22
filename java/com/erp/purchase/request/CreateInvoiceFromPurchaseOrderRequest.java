package com.erp.purchase.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class CreateInvoiceFromPurchaseOrderRequest {

    @NotNull
    private LocalDate invoiceDate;

    private Long taxRateId;

    @Valid
    @NotNull
    private List<Line> lines;

    public LocalDate getInvoiceDate() {
        return invoiceDate;
    }

    public void setInvoiceDate(LocalDate invoiceDate) {
        this.invoiceDate = invoiceDate;
    }

    public Long getTaxRateId() {
        return taxRateId;
    }

    public void setTaxRateId(Long taxRateId) {
        this.taxRateId = taxRateId;
    }

    public List<Line> getLines() {
        return lines;
    }

    public void setLines(List<Line> lines) {
        this.lines = lines;
    }

    public static class Line {
        @NotNull
        private Long purchaseOrderLineId;

        @NotNull
        private BigDecimal qty;

        public Long getPurchaseOrderLineId() {
            return purchaseOrderLineId;
        }

        public void setPurchaseOrderLineId(Long purchaseOrderLineId) {
            this.purchaseOrderLineId = purchaseOrderLineId;
        }

        public BigDecimal getQty() {
            return qty;
        }

        public void setQty(BigDecimal qty) {
            this.qty = qty;
        }
    }
}
