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
@Table(name = "inv_movement_line")
public class InventoryMovementLine extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "movement_id", nullable = false)
    private InventoryMovement movement;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private BigDecimal qty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_locator_id")
    private Locator fromLocator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_locator_id")
    private Locator toLocator;

    public InventoryMovement getMovement() {
        return movement;
    }

    public void setMovement(InventoryMovement movement) {
        this.movement = movement;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public BigDecimal getQty() {
        return qty;
    }

    public void setQty(BigDecimal qty) {
        this.qty = qty;
    }

    public Locator getFromLocator() {
        return fromLocator;
    }

    public void setFromLocator(Locator fromLocator) {
        this.fromLocator = fromLocator;
    }

    public Locator getToLocator() {
        return toLocator;
    }

    public void setToLocator(Locator toLocator) {
        this.toLocator = toLocator;
    }
}
