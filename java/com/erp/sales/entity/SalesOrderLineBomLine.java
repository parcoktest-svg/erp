package com.erp.sales.entity;

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
@Table(name = "trx_sales_order_line_bom_line")
public class SalesOrderLineBomLine extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sales_order_line_bom_id", nullable = false)
    private SalesOrderLineBom salesOrderLineBom;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "component_product_id", nullable = false)
    private Product componentProduct;

    @Column(nullable = false)
    private BigDecimal qty;

    public SalesOrderLineBom getSalesOrderLineBom() {
        return salesOrderLineBom;
    }

    public void setSalesOrderLineBom(SalesOrderLineBom salesOrderLineBom) {
        this.salesOrderLineBom = salesOrderLineBom;
    }

    public Product getComponentProduct() {
        return componentProduct;
    }

    public void setComponentProduct(Product componentProduct) {
        this.componentProduct = componentProduct;
    }

    public BigDecimal getQty() {
        return qty;
    }

    public void setQty(BigDecimal qty) {
        this.qty = qty;
    }
}
