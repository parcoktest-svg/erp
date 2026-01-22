package com.erp.purchase.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public class VoidPurchaseOrderRequest {

    @NotNull
    private LocalDate voidDate;

    private String reason;

    public LocalDate getVoidDate() {
        return voidDate;
    }

    public void setVoidDate(LocalDate voidDate) {
        this.voidDate = voidDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
