package com.erp.manufacturing.dto;

import java.math.BigDecimal;

public class BomLineDto {

    private Long id;
    private Long componentProductId;
    private BigDecimal qty;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getComponentProductId() {
        return componentProductId;
    }

    public void setComponentProductId(Long componentProductId) {
        this.componentProductId = componentProductId;
    }

    public BigDecimal getQty() {
        return qty;
    }

    public void setQty(BigDecimal qty) {
        this.qty = qty;
    }
}
