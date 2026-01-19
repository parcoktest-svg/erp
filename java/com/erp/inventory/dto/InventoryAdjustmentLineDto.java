package com.erp.inventory.dto;

import java.math.BigDecimal;

public class InventoryAdjustmentLineDto {
    private Long id;
    private Long productId;
    private String productCode;
    private String productName;
    private Long locatorId;
    private String locatorCode;
    private String locatorName;
    private BigDecimal quantityOnHandBefore;
    private BigDecimal quantityAdjusted;
    private BigDecimal quantityOnHandAfter;
    private BigDecimal adjustmentAmount;
    private String notes;

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

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Long getLocatorId() {
        return locatorId;
    }

    public void setLocatorId(Long locatorId) {
        this.locatorId = locatorId;
    }

    public String getLocatorCode() {
        return locatorCode;
    }

    public void setLocatorCode(String locatorCode) {
        this.locatorCode = locatorCode;
    }

    public String getLocatorName() {
        return locatorName;
    }

    public void setLocatorName(String locatorName) {
        this.locatorName = locatorName;
    }

    public BigDecimal getQuantityOnHandBefore() {
        return quantityOnHandBefore;
    }

    public void setQuantityOnHandBefore(BigDecimal quantityOnHandBefore) {
        this.quantityOnHandBefore = quantityOnHandBefore;
    }

    public BigDecimal getQuantityAdjusted() {
        return quantityAdjusted;
    }

    public void setQuantityAdjusted(BigDecimal quantityAdjusted) {
        this.quantityAdjusted = quantityAdjusted;
    }

    public BigDecimal getQuantityOnHandAfter() {
        return quantityOnHandAfter;
    }

    public void setQuantityOnHandAfter(BigDecimal quantityOnHandAfter) {
        this.quantityOnHandAfter = quantityOnHandAfter;
    }

    public BigDecimal getAdjustmentAmount() {
        return adjustmentAmount;
    }

    public void setAdjustmentAmount(BigDecimal adjustmentAmount) {
        this.adjustmentAmount = adjustmentAmount;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
