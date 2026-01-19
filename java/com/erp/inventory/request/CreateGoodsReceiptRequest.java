package com.erp.inventory.request;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class CreateGoodsReceiptRequest {

    @NotNull
    private Long toLocatorId;

    @NotNull
    private LocalDate movementDate;

    private String description;

    @Valid
    @NotNull
    private List<ReceiptLine> lines;

    public Long getToLocatorId() {
        return toLocatorId;
    }

    public void setToLocatorId(Long toLocatorId) {
        this.toLocatorId = toLocatorId;
    }

    public LocalDate getMovementDate() {
        return movementDate;
    }

    public void setMovementDate(LocalDate movementDate) {
        this.movementDate = movementDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<ReceiptLine> getLines() {
        return lines;
    }

    public void setLines(List<ReceiptLine> lines) {
        this.lines = lines;
    }

    public static class ReceiptLine {
        @NotNull
        private Long purchaseOrderLineId;

        @NotNull
        private java.math.BigDecimal qty;

        public Long getPurchaseOrderLineId() {
            return purchaseOrderLineId;
        }

        public void setPurchaseOrderLineId(Long purchaseOrderLineId) {
            this.purchaseOrderLineId = purchaseOrderLineId;
        }

        public java.math.BigDecimal getQty() {
            return qty;
        }

        public void setQty(java.math.BigDecimal qty) {
            this.qty = qty;
        }
    }
}
