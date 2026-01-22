package com.erp.sales.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public class CreateInvoiceFromSalesOrderRequest {

    @NotNull
    private LocalDate invoiceDate;

    private Long taxRateId;

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
}
