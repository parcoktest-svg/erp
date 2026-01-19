package com.erp.finance.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class CreateBudgetRequest {

    @NotNull
    private Long fiscalYearId;

    private Long orgId;

    @NotNull
    private String name;

    private String description;

    @Valid
    @NotNull
    private List<CreateBudgetLineRequest> lines;

    public Long getFiscalYearId() {
        return fiscalYearId;
    }

    public void setFiscalYearId(Long fiscalYearId) {
        this.fiscalYearId = fiscalYearId;
    }

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<CreateBudgetLineRequest> getLines() {
        return lines;
    }

    public void setLines(List<CreateBudgetLineRequest> lines) {
        this.lines = lines;
    }

    public static class CreateBudgetLineRequest {
        @NotNull
        private Long glAccountId;

        @NotNull
        private Long accountingPeriodId;

        @NotNull
        private java.math.BigDecimal budgetAmount;

        private String notes;

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

        public java.math.BigDecimal getBudgetAmount() {
            return budgetAmount;
        }

        public void setBudgetAmount(java.math.BigDecimal budgetAmount) {
            this.budgetAmount = budgetAmount;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }
}
