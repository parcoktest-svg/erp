package com.erp.inventory.entity;

import java.math.BigDecimal;

import com.erp.core.model.BaseEntity;
import com.erp.masterdata.entity.Product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "inv_inventory_adjustment_line")
public class InventoryAdjustmentLine extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "adjustment_id", nullable = false)
    private InventoryAdjustment adjustment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "locator_id", nullable = false)
    private Locator locator;

    @Column(name = "quantity_on_hand_before", nullable = false)
    private BigDecimal quantityOnHandBefore;

    @Column(name = "quantity_adjusted", nullable = false)
    private BigDecimal quantityAdjusted;

    @Column(name = "quantity_on_hand_after", nullable = false)
    private BigDecimal quantityOnHandAfter;

    @Column(name = "adjustment_amount", nullable = false)
    private BigDecimal adjustmentAmount;

    @Column(length = 255)
    private String notes;

    public InventoryAdjustment getAdjustment() {
        return adjustment;
    }

    public void setAdjustment(InventoryAdjustment adjustment) {
        this.adjustment = adjustment;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Locator getLocator() {
        return locator;
    }

    public void setLocator(Locator locator) {
        this.locator = locator;
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
