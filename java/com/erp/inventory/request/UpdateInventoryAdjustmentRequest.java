package com.erp.inventory.request;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class UpdateInventoryAdjustmentRequest {

    @NotNull
    private LocalDate adjustmentDate;

    private Long orgId;

    private String description;

    @Valid
    @NotNull
    private List<UpdateInventoryAdjustmentLineRequest> lines;

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

    public List<UpdateInventoryAdjustmentLineRequest> getLines() {
        return lines;
    }

    public void setLines(List<UpdateInventoryAdjustmentLineRequest> lines) {
        this.lines = lines;
    }

    public static class UpdateInventoryAdjustmentLineRequest {

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
