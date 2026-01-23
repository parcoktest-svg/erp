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
    }
}
