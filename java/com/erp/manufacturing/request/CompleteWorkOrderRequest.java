package com.erp.manufacturing.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public class CompleteWorkOrderRequest {

    @NotNull
    private LocalDate completionDate;

    public LocalDate getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(LocalDate completionDate) {
        this.completionDate = completionDate;
    }
}
