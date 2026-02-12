package com.erp.manufacturing.dto;

import java.math.BigDecimal;

public class ProductionCostLineDto {

    private Long componentMaterialId;
    private BigDecimal requiredQty;
    private BigDecimal unitPrice;
    private BigDecimal lineCost;

    public Long getComponentMaterialId() {
        return componentMaterialId;
    }

    public void setComponentMaterialId(Long componentMaterialId) {
        this.componentMaterialId = componentMaterialId;
    }

    public BigDecimal getRequiredQty() {
        return requiredQty;
    }

    public void setRequiredQty(BigDecimal requiredQty) {
        this.requiredQty = requiredQty;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getLineCost() {
        return lineCost;
    }

    public void setLineCost(BigDecimal lineCost) {
        this.lineCost = lineCost;
    }
}
