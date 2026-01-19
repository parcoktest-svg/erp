package com.erp.inventory.request;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class CreateInventoryAdjustmentRequest {

    @NotNull
    private LocalDate adjustmentDate;

    private Long orgId;

    private String description;

    @Valid
    @NotNull
    private List<CreateInventoryAdjustmentLineRequest> lines;

    public LocalDate getAdjustmentDate() {
        return adjustmentDate;
    }

    public void setAdjustmentDate(LocalDate adjustmentDate) {
        this.adjustmentDate = adjustmentDate;
    }

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<CreateInventoryAdjustmentLineRequest> getLines() {
        return lines;
    }

    public void setLines(List<CreateInventoryAdjustmentLineRequest> lines) {
        this.lines = lines;
    }

    public static class CreateInventoryAdjustmentLineRequest {
        @NotNull
        private Long productId;

        @NotNull
        private Long locatorId;

        @NotNull
        private java.math.BigDecimal quantityAdjusted;

        @NotNull
        private java.math.BigDecimal adjustmentAmount;

        private String notes;

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Long getLocatorId() {
            return locatorId;
        }

        public void setLocatorId(Long locatorId) {
            this.locatorId = locatorId;
        }

        public java.math.BigDecimal getQuantityAdjusted() {
            return quantityAdjusted;
        }

        public void setQuantityAdjusted(java.math.BigDecimal quantityAdjusted) {
            this.quantityAdjusted = quantityAdjusted;
        }

        public java.math.BigDecimal getAdjustmentAmount() {
            return adjustmentAmount;
        }

        public void setAdjustmentAmount(java.math.BigDecimal adjustmentAmount) {
            this.adjustmentAmount = adjustmentAmount;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }
}
