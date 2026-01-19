package com.erp.finance.dto;

import java.math.BigDecimal;

import com.erp.finance.model.GlAccountCode;

public class GlSummaryRowDto {

    private GlAccountCode accountCode;
    private BigDecimal debitTotal = BigDecimal.ZERO;
    private BigDecimal creditTotal = BigDecimal.ZERO;
    private BigDecimal balance = BigDecimal.ZERO;

    public GlAccountCode getAccountCode() {
        return accountCode;
    }

    public void setAccountCode(GlAccountCode accountCode) {
        this.accountCode = accountCode;
    }

    public BigDecimal getDebitTotal() {
        return debitTotal;
    }

    public void setDebitTotal(BigDecimal debitTotal) {
        this.debitTotal = debitTotal;
    }

    public BigDecimal getCreditTotal() {
        return creditTotal;
    }

    public void setCreditTotal(BigDecimal creditTotal) {
        this.creditTotal = creditTotal;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}
