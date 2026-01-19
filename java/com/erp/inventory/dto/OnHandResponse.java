package com.erp.inventory.dto;

import java.math.BigDecimal;

public class OnHandResponse {

    private Long locatorId;
    private Long productId;
    private BigDecimal onHandQty;

    public OnHandResponse() {
    }

    public OnHandResponse(Long locatorId, Long productId, BigDecimal onHandQty) {
        this.locatorId = locatorId;
        this.productId = productId;
        this.onHandQty = onHandQty;
    }

    public Long getLocatorId() {
        return locatorId;
    }

    public void setLocatorId(Long locatorId) {
        this.locatorId = locatorId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public BigDecimal getOnHandQty() {
        return onHandQty;
    }

    public void setOnHandQty(BigDecimal onHandQty) {
        this.onHandQty = onHandQty;
    }
}
