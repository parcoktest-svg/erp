package com.erp.finance.dto;

import java.time.LocalDate;
import java.util.List;

import com.erp.core.model.DocumentStatus;

public class BudgetDto {
    private Long id;
    private Long companyId;
    private Long orgId;
    private Long fiscalYearId;
    private String name;
    private String description;
    private DocumentStatus status;
    private List<BudgetLineDto> lines;

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

    public Long getFiscalYearId() {
        return fiscalYearId;
    }

    public void setFiscalYearId(Long fiscalYearId) {
        this.fiscalYearId = fiscalYearId;
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

    public DocumentStatus getStatus() {
        return status;
    }

    public void setStatus(DocumentStatus status) {
        this.status = status;
    }

    public List<BudgetLineDto> getLines() {
        return lines;
    }

    public void setLines(List<BudgetLineDto> lines) {
        this.lines = lines;
    }
}
