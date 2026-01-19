package com.erp.inventory.request;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class CreateGoodsShipmentRequest {

    @NotNull
    private Long fromLocatorId;

    @NotNull
    private LocalDate movementDate;

    private String description;

    @Valid
    @NotNull
    private List<ShipmentLine> lines;

    public Long getFromLocatorId() {
        return fromLocatorId;
    }

    public void setFromLocatorId(Long fromLocatorId) {
        this.fromLocatorId = fromLocatorId;
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

    public List<ShipmentLine> getLines() {
        return lines;
    }

    public void setLines(List<ShipmentLine> lines) {
        this.lines = lines;
    }

    public static class ShipmentLine {
        @NotNull
        private Long salesOrderLineId;

        @NotNull
        private java.math.BigDecimal qty;

        public Long getSalesOrderLineId() {
            return salesOrderLineId;
        }

        public void setSalesOrderLineId(Long salesOrderLineId) {
            this.salesOrderLineId = salesOrderLineId;
        }

        public java.math.BigDecimal getQty() {
            return qty;
        }

        public void setQty(java.math.BigDecimal qty) {
            this.qty = qty;
        }
    }
}
