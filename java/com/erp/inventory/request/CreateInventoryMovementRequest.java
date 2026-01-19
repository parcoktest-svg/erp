package com.erp.inventory.request;

import java.time.LocalDate;
import java.util.List;

import com.erp.inventory.model.InventoryMovementType;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class CreateInventoryMovementRequest {

    @NotNull
    private InventoryMovementType movementType;

    @NotNull
    private LocalDate movementDate;

    private String description;

    private Long orgId;

    @Valid
    @NotNull
    private List<CreateInventoryMovementLineRequest> lines;

    public InventoryMovementType getMovementType() {
        return movementType;
    }

    public void setMovementType(InventoryMovementType movementType) {
        this.movementType = movementType;
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

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public List<CreateInventoryMovementLineRequest> getLines() {
        return lines;
    }

    public void setLines(List<CreateInventoryMovementLineRequest> lines) {
        this.lines = lines;
    }

    public static class CreateInventoryMovementLineRequest {
        @NotNull
        private Long productId;

        @NotNull
        private java.math.BigDecimal qty;

        private Long fromLocatorId;
        private Long toLocatorId;

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public java.math.BigDecimal getQty() {
            return qty;
        }

        public void setQty(java.math.BigDecimal qty) {
            this.qty = qty;
        }

        public Long getFromLocatorId() {
            return fromLocatorId;
        }

        public void setFromLocatorId(Long fromLocatorId) {
            this.fromLocatorId = fromLocatorId;
        }

        public Long getToLocatorId() {
            return toLocatorId;
        }

        public void setToLocatorId(Long toLocatorId) {
            this.toLocatorId = toLocatorId;
        }
    }
}
