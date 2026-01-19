package com.erp.finance.dto;

import java.math.BigDecimal;

public class BudgetVsActualDto {
    private Long glAccountId;
    private String glAccountCode;
    private String glAccountName;
    private Long accountingPeriodId;
    private String periodName;
    private BigDecimal budgetAmount;
    private BigDecimal actualAmount;
    private BigDecimal variance;
    private BigDecimal variancePercent;

    public Long getGlAccountId() {
        return glAccountId;
    }

    public void setGlAccountId(Long glAccountId) {
        this.glAccountId = glAccountId;
    }

    public String getGlAccountCode() {
        return glAccountCode;
    }

    public void setGlAccountCode(String glAccountCode) {
        this.glAccountCode = glAccountCode;
    }

    public String getGlAccountName() {
        return glAccountName;
    }

    public void setGlAccountName(String glAccountName) {
        this.glAccountName = glAccountName;
    }

    public Long getAccountingPeriodId() {
        return accountingPeriodId;
    }

    public void setAccountingPeriodId(Long accountingPeriodId) {
        this.accountingPeriodId = accountingPeriodId;
    }

    public String getPeriodName() {
        return periodName;
    }

    public void setPeriodName(String periodName) {
        this.periodName = periodName;
    }

    public BigDecimal getBudgetAmount() {
        return budgetAmount;
    }

    public void setBudgetAmount(BigDecimal budgetAmount) {
        this.budgetAmount = budgetAmount;
    }

    public BigDecimal getActualAmount() {
        return actualAmount;
    }

    public void setActualAmount(BigDecimal actualAmount) {
        this.actualAmount = actualAmount;
    }

    public BigDecimal getVariance() {
        return variance;
    }

    public void setVariance(BigDecimal variance) {
        this.variance = variance;
    }

    public BigDecimal getVariancePercent() {
        return variancePercent;
    }

    public void setVariancePercent(BigDecimal variancePercent) {
        this.variancePercent = variancePercent;
    }
}
