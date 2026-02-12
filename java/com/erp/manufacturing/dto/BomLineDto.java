package com.erp.manufacturing.dto;

import java.math.BigDecimal;

public class BomLineDto {

    private Long id;
    private Long componentMaterialId;
    private BigDecimal qty;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getComponentMaterialId() {
        return componentMaterialId;
    }

    public void setComponentMaterialId(Long componentMaterialId) {
        this.componentMaterialId = componentMaterialId;
    }

    public BigDecimal getQty() {
        return qty;
    }

    public void setQty(BigDecimal qty) {
        this.qty = qty;
    }
}
