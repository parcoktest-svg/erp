package com.erp.sales.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.erp.core.model.BaseEntity;
import com.erp.masterdata.entity.Product;
import com.erp.masterdata.entity.Uom;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "trx_sales_order_line")
public class SalesOrderLine extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sales_order_id", nullable = false)
    private SalesOrder salesOrder;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "uom_id", nullable = false)
    private Uom uom;

    @Column(nullable = false)
    private BigDecimal qty;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private BigDecimal lineNet = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal shippedQty = BigDecimal.ZERO;

    private String description;

    private String unit;

    private String size;

    @Column(name = "national_size")
    private String nationalSize;

    private String style;

    @Column(name = "cutting_no")
    private String cuttingNo;

    private String color;

    private String destination;

    @Column(name = "supply_amount")
    private BigDecimal supplyAmount;

    @Column(name = "vat_amount")
    private BigDecimal vatAmount;

    @Column(name = "fob_price")
    private BigDecimal fobPrice;

    @Column(name = "ldp_price")
    private BigDecimal ldpPrice;

    @Column(name = "dp_price")
    private BigDecimal dpPrice;

    @Column(name = "cmt_cost")
    private BigDecimal cmtCost;

    @Column(name = "cm_cost")
    private BigDecimal cmCost;

    @Column(name = "fabric_eta")
    private LocalDate fabricEta;

    @Column(name = "fabric_etd")
    private LocalDate fabricEtd;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Column(name = "ship_mode")
    private String shipMode;

    @Column(name = "factory")
    private String factory;

    @Column(name = "remark")
    private String remark;

    @Column(name = "file_path")
    private String filePath;

    public SalesOrder getSalesOrder() {
        return salesOrder;
    }

    public void setSalesOrder(SalesOrder salesOrder) {
        this.salesOrder = salesOrder;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Uom getUom() {
        return uom;
    }

    public void setUom(Uom uom) {
        this.uom = uom;
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
