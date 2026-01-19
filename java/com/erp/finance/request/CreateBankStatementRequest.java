package com.erp.finance.request;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class CreateBankStatementRequest {

    private Long orgId;

    @NotNull
    private Long bankAccountId;

    @NotNull
    private LocalDate statementDate;

    private String description;

    @Valid
    private List<CreateBankStatementLineRequest> lines = new ArrayList<>();

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public Long getBankAccountId() {
        return bankAccountId;
    }

    public void setBankAccountId(Long bankAccountId) {
        this.bankAccountId = bankAccountId;
    }

    public LocalDate getStatementDate() {
        return statementDate;
    }

    public void setStatementDate(LocalDate statementDate) {
        this.statementDate = statementDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<CreateBankStatementLineRequest> getLines() {
        return lines;
    }

    public void setLines(List<CreateBankStatementLineRequest> lines) {
        this.lines = lines;
    }
}
