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

    @Column(name = "bom_code")
    private String bomCode;

    @Column(name = "description1")
    private String description1;

    @Column(name = "color_description2")
    private String colorDescription2;

    @Column(name = "unit")
    private String unit;

    @Column(name = "unit_price_foreign")
    private BigDecimal unitPriceForeign;

    @Column(name = "unit_price_domestic")
    private BigDecimal unitPriceDomestic;

    @Column(name = "yy")
    private BigDecimal yy;

    @Column(name = "exchange_rate")
    private BigDecimal exchangeRate;

    @Column(name = "amount_foreign")
    private BigDecimal amountForeign;

    @Column(name = "amount_domestic")
    private BigDecimal amountDomestic;

    @Column(name = "currency_id")
    private Long currencyId;

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

    public String getBomCode() {
        return bomCode;
    }

    public void setBomCode(String bomCode) {
        this.bomCode = bomCode;
    }

    public String getDescription1() {
        return description1;
    }

    public void setDescription1(String description1) {
        this.description1 = description1;
    }

    public String getColorDescription2() {
        return colorDescription2;
    }

    public void setColorDescription2(String colorDescription2) {
        this.colorDescription2 = colorDescription2;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public BigDecimal getUnitPriceForeign() {
        return unitPriceForeign;
    }

    public void setUnitPriceForeign(BigDecimal unitPriceForeign) {
        this.unitPriceForeign = unitPriceForeign;
    }

    public BigDecimal getUnitPriceDomestic() {
        return unitPriceDomestic;
    }

    public void setUnitPriceDomestic(BigDecimal unitPriceDomestic) {
        this.unitPriceDomestic = unitPriceDomestic;
    }

    public BigDecimal getYy() {
        return yy;
    }

    public void setYy(BigDecimal yy) {
        this.yy = yy;
    }

    public BigDecimal getExchangeRate() {
        return exchangeRate;
    }

    public void setExchangeRate(BigDecimal exchangeRate) {
        this.exchangeRate = exchangeRate;
    }

    public BigDecimal getAmountForeign() {
        return amountForeign;
    }

    public void setAmountForeign(BigDecimal amountForeign) {
        this.amountForeign = amountForeign;
    }

    public BigDecimal getAmountDomestic() {
        return amountDomestic;
    }

    public void setAmountDomestic(BigDecimal amountDomestic) {
        this.amountDomestic = amountDomestic;
    }

    public Long getCurrencyId() {
        return currencyId;
    }

    public void setCurrencyId(Long currencyId) {
        this.currencyId = currencyId;
    }
}
