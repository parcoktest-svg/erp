package com.erp.finance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BankStatementLineDto {

    private Long id;
    private Long bankStatementId;

    private LocalDate trxDate;
    private String description;
    private BigDecimal amount;

    private boolean reconciled;
    private Long paymentId;
    private Long journalEntryId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBankStatementId() {
        return bankStatementId;
    }

    public void setBankStatementId(Long bankStatementId) {
        this.bankStatementId = bankStatementId;
    }

    public LocalDate getTrxDate() {
        return trxDate;
    }

    public void setTrxDate(LocalDate trxDate) {
        this.trxDate = trxDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public boolean isReconciled() {
        return reconciled;
    }

    public void setReconciled(boolean reconciled) {
        this.reconciled = reconciled;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public Long getJournalEntryId() {
        return journalEntryId;
    }

    public void setJournalEntryId(Long journalEntryId) {
        this.journalEntryId = journalEntryId;
    }
}
