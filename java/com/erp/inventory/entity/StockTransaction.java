package com.erp.inventory.entity;

import java.math.BigDecimal;
import java.time.Instant;

import com.erp.core.entity.Company;
import com.erp.core.model.BaseEntity;
import com.erp.masterdata.entity.Product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "inv_stock_txn")
public class StockTransaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "locator_id", nullable = false)
    private Locator locator;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private BigDecimal qty;

    @Column(nullable = false)
    private Instant movementTime;

    private String referenceDocNo;

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Locator getLocator() {
        return locator;
    }

    public void setLocator(Locator locator) {
        this.locator = locator;
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

    public Instant getMovementTime() {
        return movementTime;
    }

    public void setMovementTime(Instant movementTime) {
        this.movementTime = movementTime;
    }

    public String getReferenceDocNo() {
        return referenceDocNo;
    }

    public void setReferenceDocNo(String referenceDocNo) {
        this.referenceDocNo = referenceDocNo;
    }
}
