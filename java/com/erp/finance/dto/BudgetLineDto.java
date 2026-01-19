package com.erp.finance.dto;

import java.math.BigDecimal;

public class BudgetLineDto {
    private Long id;
    private Long glAccountId;
    private Long accountingPeriodId;
    private BigDecimal budgetAmount;
    private String notes;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGlAccountId() {
        return glAccountId;
    }

    public void setGlAccountId(Long glAccountId) {
        this.glAccountId = glAccountId;
    }

    public Long getAccountingPeriodId() {
        return accountingPeriodId;
    }

    public void setAccountingPeriodId(Long accountingPeriodId) {
        this.accountingPeriodId = accountingPeriodId;
    }

    public BigDecimal getBudgetAmount() {
        return budgetAmount;
    }

    public void setBudgetAmount(BigDecimal budgetAmount) {
        this.budgetAmount = budgetAmount;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
