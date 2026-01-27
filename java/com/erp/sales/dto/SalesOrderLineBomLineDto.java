package com.erp.sales.dto;

import java.math.BigDecimal;

public class SalesOrderLineBomLineDto {

    private Long id;
    private Long componentProductId;
    private BigDecimal qty;

    private String bomCode;
    private String description1;
    private String colorDescription2;
    private String unit;
    private BigDecimal unitPriceForeign;
    private BigDecimal unitPriceDomestic;
    private BigDecimal yy;
    private BigDecimal exchangeRate;
    private BigDecimal amountForeign;
    private BigDecimal amountDomestic;
    private Long currencyId;

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
