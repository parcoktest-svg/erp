package com.erp.finance.dto;

import java.math.BigDecimal;

import com.erp.finance.model.GlAccountType;

public class BalanceSheetRowDto {

    private String accountCode;
    private String accountName;
    private GlAccountType accountType;

    private BigDecimal amount = BigDecimal.ZERO;

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

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
