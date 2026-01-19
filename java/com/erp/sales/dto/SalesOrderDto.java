package com.erp.sales.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.erp.core.model.DocumentStatus;
import com.erp.sales.model.SalesOrderType;

public class SalesOrderDto {

    private Long id;
    private Long companyId;
    private Long orgId;
    private Long businessPartnerId;
    private Long priceListVersionId;
    private SalesOrderType orderType;
    private String buyerPo;
    private Long departmentId;
    private Long employeeId;
    private String inCharge;
    private String paymentCondition;
    private String deliveryPlace;
    private Long forwardingWarehouseId;
    private Long currencyId;
    private BigDecimal exchangeRate;
    private BigDecimal foreignAmount;
    private String memo;
    private String documentNo;
    private DocumentStatus status;
    private LocalDate orderDate;
    private BigDecimal totalNet;
    private BigDecimal totalTax;
    private BigDecimal grandTotal;
    private List<SalesOrderLineDto> lines;
    private List<SalesOrderDeliveryScheduleDto> deliverySchedules;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
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

    public BigDecimal getExchangeRate() {
        return exchangeRate;
    }

    public void setExchangeRate(BigDecimal exchangeRate) {
        this.exchangeRate = exchangeRate;
    }

    public BigDecimal getForeignAmount() {
        return foreignAmount;
    }

    public void setForeignAmount(BigDecimal foreignAmount) {
        this.foreignAmount = foreignAmount;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public String getDocumentNo() {
        return documentNo;
    }

    public void setDocumentNo(String documentNo) {
        this.documentNo = documentNo;
    }

    public DocumentStatus getStatus() {
        return status;
    }

    public void setStatus(DocumentStatus status) {
        this.status = status;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public BigDecimal getTotalNet() {
        return totalNet;
    }

    public void setTotalNet(BigDecimal totalNet) {
        this.totalNet = totalNet;
    }

    public BigDecimal getTotalTax() {
        return totalTax;
    }

    public void setTotalTax(BigDecimal totalTax) {
        this.totalTax = totalTax;
    }

    public BigDecimal getGrandTotal() {
        return grandTotal;
    }

    public void setGrandTotal(BigDecimal grandTotal) {
        this.grandTotal = grandTotal;
    }

    public List<SalesOrderLineDto> getLines() {
        return lines;
    }

    public void setLines(List<SalesOrderLineDto> lines) {
        this.lines = lines;
    }

    public List<SalesOrderDeliveryScheduleDto> getDeliverySchedules() {
        return deliverySchedules;
    }

    public void setDeliverySchedules(List<SalesOrderDeliveryScheduleDto> deliverySchedules) {
        this.deliverySchedules = deliverySchedules;
    }
}
