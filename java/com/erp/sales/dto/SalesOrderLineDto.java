package com.erp.sales.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SalesOrderLineDto {

    private Long id;
    private Long productId;
    private Long uomId;
    private BigDecimal qty;
    private BigDecimal price;
    private BigDecimal lineNet;
    private BigDecimal shippedQty;

    private String description;
    private String unit;
    private String size;
    private String nationalSize;
    private String style;
    private String cuttingNo;
    private String color;
    private String destination;
    private BigDecimal supplyAmount;
    private BigDecimal vatAmount;
    private BigDecimal fobPrice;
    private BigDecimal ldpPrice;
    private BigDecimal dpPrice;
    private BigDecimal cmtCost;
    private BigDecimal cmCost;
    private LocalDate fabricEta;
    private LocalDate fabricEtd;

    private LocalDate deliveryDate;
    private String shipMode;
    private String factory;
    private String remark;
    private String filePath;

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

    public Long getUomId() {
        return uomId;
    }

    public void setUomId(Long uomId) {
        this.uomId = uomId;
    }

    public BigDecimal getQty() {
        return qty;
    }

    public void setQty(BigDecimal qty) {
        this.qty = qty;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getLineNet() {
        return lineNet;
    }

    public void setLineNet(BigDecimal lineNet) {
        this.lineNet = lineNet;
    }

    public BigDecimal getShippedQty() {
        return shippedQty;
    }

    public void setShippedQty(BigDecimal shippedQty) {
        this.shippedQty = shippedQty;
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

    public BigDecimal getSupplyAmount() {
        return supplyAmount;
    }

    public void setSupplyAmount(BigDecimal supplyAmount) {
        this.supplyAmount = supplyAmount;
    }

    public BigDecimal getVatAmount() {
        return vatAmount;
    }

    public void setVatAmount(BigDecimal vatAmount) {
        this.vatAmount = vatAmount;
    }

    public BigDecimal getFobPrice() {
        return fobPrice;
    }

    public void setFobPrice(BigDecimal fobPrice) {
        this.fobPrice = fobPrice;
    }

    public BigDecimal getLdpPrice() {
        return ldpPrice;
    }

    public void setLdpPrice(BigDecimal ldpPrice) {
        this.ldpPrice = ldpPrice;
    }

    public BigDecimal getDpPrice() {
        return dpPrice;
    }

    public void setDpPrice(BigDecimal dpPrice) {
        this.dpPrice = dpPrice;
    }

    public BigDecimal getCmtCost() {
        return cmtCost;
    }

    public void setCmtCost(BigDecimal cmtCost) {
        this.cmtCost = cmtCost;
    }

    public BigDecimal getCmCost() {
        return cmCost;
    }

    public void setCmCost(BigDecimal cmCost) {
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
