package com.erp.inventory.dto;

import java.time.LocalDate;
import java.util.List;

import com.erp.core.model.DocumentStatus;

public class InventoryAdjustmentDto {
    private Long id;
    private Long companyId;
    private Long orgId;
    private String documentNo;
    private LocalDate adjustmentDate;
    private String description;
    private DocumentStatus status;
    private Long journalEntryId;
    private List<InventoryAdjustmentLineDto> lines;

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

    public String getDocumentNo() {
        return documentNo;
    }

    public void setDocumentNo(String documentNo) {
        this.documentNo = documentNo;
    }

    public LocalDate getAdjustmentDate() {
        return adjustmentDate;
    }

    public void setAdjustmentDate(LocalDate adjustmentDate) {
        this.adjustmentDate = adjustmentDate;
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

    public Long getJournalEntryId() {
        return journalEntryId;
    }

    public void setJournalEntryId(Long journalEntryId) {
        this.journalEntryId = journalEntryId;
    }

    public List<InventoryAdjustmentLineDto> getLines() {
        return lines;
    }

    public void setLines(List<InventoryAdjustmentLineDto> lines) {
        this.lines = lines;
    }
}
