package com.erp.sales.request;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class SetSalesOrderLineBomRequest {

    @NotNull
    private Long salesOrderLineId;

    private Long sourceBomId;

    private Integer sourceBomVersion;

    @Valid
    private List<SetSalesOrderLineBomLineRequest> lines;

    public Long getSalesOrderLineId() {
        return salesOrderLineId;
    }

    public void setSalesOrderLineId(Long salesOrderLineId) {
        this.salesOrderLineId = salesOrderLineId;
    }

    public Long getSourceBomId() {
        return sourceBomId;
    }

    public void setSourceBomId(Long sourceBomId) {
        this.sourceBomId = sourceBomId;
    }

    public Integer getSourceBomVersion() {
        return sourceBomVersion;
    }

    public void setSourceBomVersion(Integer sourceBomVersion) {
        this.sourceBomVersion = sourceBomVersion;
    }

    public List<SetSalesOrderLineBomLineRequest> getLines() {
        return lines;
    }

    public void setLines(List<SetSalesOrderLineBomLineRequest> lines) {
        this.lines = lines;
    }

    public static class SetSalesOrderLineBomLineRequest {

        @NotNull
        private Long componentProductId;

        @NotNull
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
}
