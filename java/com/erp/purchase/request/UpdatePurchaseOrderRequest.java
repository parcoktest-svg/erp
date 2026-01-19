package com.erp.purchase.request;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class UpdatePurchaseOrderRequest {

    private Long orgId;

    @NotNull
    private Long vendorId;

    @NotNull
    private Long priceListVersionId;

    @NotNull
    private LocalDate orderDate;

    @Valid
    @NotNull
    private List<UpdatePurchaseOrderLineRequest> lines;

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public Long getVendorId() {
        return vendorId;
    }

    public void setVendorId(Long vendorId) {
        this.vendorId = vendorId;
    }

    public Long getPriceListVersionId() {
        return priceListVersionId;
    }

    public void setPriceListVersionId(Long priceListVersionId) {
        this.priceListVersionId = priceListVersionId;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public List<UpdatePurchaseOrderLineRequest> getLines() {
        return lines;
    }

    public void setLines(List<UpdatePurchaseOrderLineRequest> lines) {
        this.lines = lines;
    }

    public static class UpdatePurchaseOrderLineRequest {
        @NotNull
        private Long productId;

        @NotNull
        private java.math.BigDecimal qty;

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
    }
}
