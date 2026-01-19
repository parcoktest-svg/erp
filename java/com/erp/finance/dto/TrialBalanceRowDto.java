package com.erp.finance.dto;

import java.math.BigDecimal;

import com.erp.finance.model.GlAccountType;

public class TrialBalanceRowDto {

    private String accountCode;
    private String accountName;
    private GlAccountType accountType;
    private BigDecimal debitTotal = BigDecimal.ZERO;
    private BigDecimal creditTotal = BigDecimal.ZERO;
    private BigDecimal balance = BigDecimal.ZERO;

    public String getAccountCode() {
        return accountCode;
    }

    public void setAccountCode(String accountCode) {
        this.accountCode = accountCode;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public GlAccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(GlAccountType accountType) {
        this.accountType = accountType;
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
