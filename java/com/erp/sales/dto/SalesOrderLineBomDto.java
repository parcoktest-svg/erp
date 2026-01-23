package com.erp.sales.dto;

import java.util.List;

public class SalesOrderLineBomDto {

    private Long id;
    private Long salesOrderLineId;
    private Long sourceBomId;
    private Integer sourceBomVersion;
    private List<SalesOrderLineBomLineDto> lines;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public List<SalesOrderLineBomLineDto> getLines() {
        return lines;
    }

    public void setLines(List<SalesOrderLineBomLineDto> lines) {
        this.lines = lines;
    }
}
