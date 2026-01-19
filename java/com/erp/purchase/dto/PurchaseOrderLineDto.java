package com.erp.purchase.dto;

import java.math.BigDecimal;

public class PurchaseOrderLineDto {

    private Long id;
    private Long productId;
    private Long uomId;
    private BigDecimal qty;
    private BigDecimal price;
    private BigDecimal lineNet;
    private BigDecimal receivedQty;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getUomId() {
        return uomId;
    }

    public void setUomId(Long uomId) {
        this.uomId = uomId;
    }

    public BigDecimal getQty() {
        return qty;
    }

    public void setQty(BigDecimal qty) {
        this.qty = qty;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getLineNet() {
        return lineNet;
    }

    public void setLineNet(BigDecimal lineNet) {
        this.lineNet = lineNet;
    }

    public BigDecimal getReceivedQty() {
        return receivedQty;
    }

    public void setReceivedQty(BigDecimal receivedQty) {
        this.receivedQty = receivedQty;
    }
}
