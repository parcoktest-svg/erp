package com.erp.manufacturing.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductionCostReportDto {

    private Long bomId;
    private Long finishedProductId;
    private java.math.BigDecimal workOrderQty;

    private Long priceListVersionId;

    private List<ProductionCostLineDto> lines = new ArrayList<>();

    private BigDecimal totalCost = BigDecimal.ZERO;

    public Long getBomId() {
        return bomId;
    }

    public void setBomId(Long bomId) {
        this.bomId = bomId;
    }

    public Long getFinishedProductId() {
        return finishedProductId;
    }

    public void setFinishedProductId(Long finishedProductId) {
        this.finishedProductId = finishedProductId;
    }

    public java.math.BigDecimal getWorkOrderQty() {
        return workOrderQty;
    }

    public void setWorkOrderQty(java.math.BigDecimal workOrderQty) {
        this.workOrderQty = workOrderQty;
    }

    public Long getPriceListVersionId() {
        return priceListVersionId;
    }

    public void setPriceListVersionId(Long priceListVersionId) {
        this.priceListVersionId = priceListVersionId;
    }

    public List<ProductionCostLineDto> getLines() {
        return lines;
    }

    public void setLines(List<ProductionCostLineDto> lines) {
        this.lines = lines;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }
}
