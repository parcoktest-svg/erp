package com.erp.finance.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class BankStatementDto {

    private Long id;
    private Long companyId;
    private Long orgId;

    private Long bankAccountId;
    private String documentNo;
    private LocalDate statementDate;
    private String description;

    private List<BankStatementLineDto> lines = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

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

    public String getDocumentNo() {
        return documentNo;
    }

    public void setDocumentNo(String documentNo) {
        this.documentNo = documentNo;
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

    public List<BankStatementLineDto> getLines() {
        return lines;
    }

    public void setLines(List<BankStatementLineDto> lines) {
        this.lines = lines;
    }
}
