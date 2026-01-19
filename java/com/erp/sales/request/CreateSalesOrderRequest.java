package com.erp.sales.request;

import java.time.LocalDate;
import java.util.List;

import com.erp.sales.model.SalesOrderType;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class CreateSalesOrderRequest {

    private Long orgId;

    private SalesOrderType orderType;

    private String buyerPo;

    private Long departmentId;

    private Long employeeId;

    private String inCharge;

    private String paymentCondition;

    private String deliveryPlace;

    private Long forwardingWarehouseId;

    private Long currencyId;

    private java.math.BigDecimal exchangeRate;

    private java.math.BigDecimal foreignAmount;

    private String memo;

    @NotNull
    private Long businessPartnerId;

    @NotNull
    private Long priceListVersionId;

    @NotNull
    private LocalDate orderDate;

    @Valid
    @NotNull
    private List<CreateSalesOrderLineRequest> lines;

    @Valid
    private List<CreateSalesOrderDeliveryScheduleRequest> deliverySchedules;

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public SalesOrderType getOrderType() {
        return orderType;
    }

    public void setOrderType(SalesOrderType orderType) {
        this.orderType = orderType;
    }

    public String getBuyerPo() {
        return buyerPo;
    }

    public void setBuyerPo(String buyerPo) {
        this.buyerPo = buyerPo;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getInCharge() {
        return inCharge;
    }

    public void setInCharge(String inCharge) {
        this.inCharge = inCharge;
    }

    public String getPaymentCondition() {
        return paymentCondition;
    }

    public void setPaymentCondition(String paymentCondition) {
        this.paymentCondition = paymentCondition;
    }

    public String getDeliveryPlace() {
        return deliveryPlace;
    }

    public void setDeliveryPlace(String deliveryPlace) {
        this.deliveryPlace = deliveryPlace;
    }

    public Long getForwardingWarehouseId() {
        return forwardingWarehouseId;
    }

    public void setForwardingWarehouseId(Long forwardingWarehouseId) {
        this.forwardingWarehouseId = forwardingWarehouseId;
    }

    public Long getCurrencyId() {
        return currencyId;
    }

    public void setCurrencyId(Long currencyId) {
        this.currencyId = currencyId;
    }

    public java.math.BigDecimal getExchangeRate() {
        return exchangeRate;
    }

    public void setExchangeRate(java.math.BigDecimal exchangeRate) {
        this.exchangeRate = exchangeRate;
    }

    public java.math.BigDecimal getForeignAmount() {
        return foreignAmount;
    }

    public void setForeignAmount(java.math.BigDecimal foreignAmount) {
        this.foreignAmount = foreignAmount;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public Long getBusinessPartnerId() {
        return businessPartnerId;
    }

    public void setBusinessPartnerId(Long businessPartnerId) {
        this.businessPartnerId = businessPartnerId;
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

    public List<CreateSalesOrderLineRequest> getLines() {
        return lines;
    }

    public void setLines(List<CreateSalesOrderLineRequest> lines) {
        this.lines = lines;
    }

    public List<CreateSalesOrderDeliveryScheduleRequest> getDeliverySchedules() {
        return deliverySchedules;
    }

    public void setDeliverySchedules(List<CreateSalesOrderDeliveryScheduleRequest> deliverySchedules) {
        this.deliverySchedules = deliverySchedules;
    }

    public static class CreateSalesOrderLineRequest {
        @NotNull
        private Long productId;

        @NotNull
        private java.math.BigDecimal qty;

        private java.math.BigDecimal unitPrice;

        private String description;
        private String unit;
        private String size;
        private String nationalSize;
        private String style;
        private String cuttingNo;
        private String color;
        private String destination;

        private java.math.BigDecimal supplyAmount;
        private java.math.BigDecimal vatAmount;
        private java.math.BigDecimal fobPrice;
        private java.math.BigDecimal ldpPrice;
        private java.math.BigDecimal dpPrice;
        private java.math.BigDecimal cmtCost;
        private java.math.BigDecimal cmCost;

        private LocalDate fabricEta;
        private LocalDate fabricEtd;

        private LocalDate deliveryDate;
        private String shipMode;
        private String factory;
        private String remark;
        private String filePath;

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

        public java.math.BigDecimal getUnitPrice() {
            return unitPrice;
        }

        public void setUnitPrice(java.math.BigDecimal unitPrice) {
            this.unitPrice = unitPrice;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getUnit() {
            return unit;
        }

        public void setUnit(String unit) {
            this.unit = unit;
        }

        public String getSize() {
            return size;
        }

        public void setSize(String size) {
            this.size = size;
        }

        public String getNationalSize() {
            return nationalSize;
        }

        public void setNationalSize(String nationalSize) {
            this.nationalSize = nationalSize;
        }

        public String getStyle() {
            return style;
        }

        public void setStyle(String style) {
            this.style = style;
        }

        public String getCuttingNo() {
            return cuttingNo;
        }

        public void setCuttingNo(String cuttingNo) {
            this.cuttingNo = cuttingNo;
        }

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public String getDestination() {
            return destination;
        }

        public void setDestination(String destination) {
            this.destination = destination;
        }

        public java.math.BigDecimal getSupplyAmount() {
            return supplyAmount;
        }

        public void setSupplyAmount(java.math.BigDecimal supplyAmount) {
            this.supplyAmount = supplyAmount;
        }

        public java.math.BigDecimal getVatAmount() {
            return vatAmount;
        }

        public void setVatAmount(java.math.BigDecimal vatAmount) {
            this.vatAmount = vatAmount;
        }

        public java.math.BigDecimal getFobPrice() {
            return fobPrice;
        }

        public void setFobPrice(java.math.BigDecimal fobPrice) {
            this.fobPrice = fobPrice;
        }

        public java.math.BigDecimal getLdpPrice() {
            return ldpPrice;
        }

        public void setLdpPrice(java.math.BigDecimal ldpPrice) {
            this.ldpPrice = ldpPrice;
        }

        public java.math.BigDecimal getDpPrice() {
            return dpPrice;
        }

        public void setDpPrice(java.math.BigDecimal dpPrice) {
            this.dpPrice = dpPrice;
        }

        public java.math.BigDecimal getCmtCost() {
            return cmtCost;
        }

        public void setCmtCost(java.math.BigDecimal cmtCost) {
            this.cmtCost = cmtCost;
        }

        public java.math.BigDecimal getCmCost() {
            return cmCost;
        }

        public void setCmCost(java.math.BigDecimal cmCost) {
            this.cmCost = cmCost;
        }

        public LocalDate getFabricEta() {
            return fabricEta;
        }

        public void setFabricEta(LocalDate fabricEta) {
            this.fabricEta = fabricEta;
        }

        public LocalDate getFabricEtd() {
            return fabricEtd;
        }

        public void setFabricEtd(LocalDate fabricEtd) {
            this.fabricEtd = fabricEtd;
        }

        public LocalDate getDeliveryDate() {
            return deliveryDate;
        }

        public void setDeliveryDate(LocalDate deliveryDate) {
            this.deliveryDate = deliveryDate;
        }

        public String getShipMode() {
            return shipMode;
        }

        public void setShipMode(String shipMode) {
            this.shipMode = shipMode;
        }

        public String getFactory() {
            return factory;
        }

        public void setFactory(String factory) {
            this.factory = factory;
        }

        public String getRemark() {
            return remark;
        }

        public void setRemark(String remark) {
            this.remark = remark;
        }

        public String getFilePath() {
            return filePath;
        }

        public void setFilePath(String filePath) {
            this.filePath = filePath;
        }
    }

    public static class CreateSalesOrderDeliveryScheduleRequest {
        private LocalDate deliveryDate;
        private String shipMode;
        private String factory;
        private String remark;
        private String filePath;

        public LocalDate getDeliveryDate() {
            return deliveryDate;
        }

        public void setDeliveryDate(LocalDate deliveryDate) {
            this.deliveryDate = deliveryDate;
        }

        public String getShipMode() {
            return shipMode;
        }

        public void setShipMode(String shipMode) {
            this.shipMode = shipMode;
        }

        public String getFactory() {
            return factory;
        }

        public void setFactory(String factory) {
            this.factory = factory;
        }

        public String getRemark() {
            return remark;
        }

        public void setRemark(String remark) {
            this.remark = remark;
        }

        public String getFilePath() {
            return filePath;
        }

        public void setFilePath(String filePath) {
            this.filePath = filePath;
        }
    }
}
