package com.erp.sales.request;

import jakarta.validation.constraints.NotNull;

public class CopySalesOrderBomRequest {

    @NotNull
    private Long fromSalesOrderId;

    public Long getFromSalesOrderId() {
        return fromSalesOrderId;
    }

    public void setFromSalesOrderId(Long fromSalesOrderId) {
        this.fromSalesOrderId = fromSalesOrderId;
    }
}
