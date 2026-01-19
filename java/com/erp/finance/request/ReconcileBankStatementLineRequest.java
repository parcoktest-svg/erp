package com.erp.finance.request;

import java.math.BigDecimal;

import com.erp.finance.model.GlAccountCode;

public class ReconcileBankStatementLineRequest {

    private Long paymentId;

    private BigDecimal adjustmentAmount;

    private GlAccountCode adjustmentAccountCode;

    private String description;

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public BigDecimal getAdjustmentAmount() {
        return adjustmentAmount;
    }

    public void setAdjustmentAmount(BigDecimal adjustmentAmount) {
        this.adjustmentAmount = adjustmentAmount;
    }

    public GlAccountCode getAdjustmentAccountCode() {
        return adjustmentAccountCode;
    }

    public void setAdjustmentAccountCode(GlAccountCode adjustmentAccountCode) {
        this.adjustmentAccountCode = adjustmentAccountCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
