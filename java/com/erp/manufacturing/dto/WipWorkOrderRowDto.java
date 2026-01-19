package com.erp.manufacturing.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.erp.core.model.DocumentStatus;

public class WipWorkOrderRowDto {

    private Long workOrderId;
    private String documentNo;
    private DocumentStatus status;
    private LocalDate workDate;

    private Long bomId;
    private Long productId;
    private BigDecimal qty;

    private Long fromLocatorId;
    private Long toLocatorId;

    private String issueMovementDocNo;
    private String receiptMovementDocNo;

    public Long getWorkOrderId() {
        return workOrderId;
    }

    public void setWorkOrderId(Long workOrderId) {
        this.workOrderId = workOrderId;
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

    public LocalDate getWorkDate() {
        return workDate;
    }

    public void setWorkDate(LocalDate workDate) {
        this.workDate = workDate;
    }

    public Long getBomId() {
        return bomId;
    }

    public void setBomId(Long bomId) {
        this.bomId = bomId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public BigDecimal getQty() {
        return qty;
    }

    public void setQty(BigDecimal qty) {
        this.qty = qty;
    }

    public Long getFromLocatorId() {
        return fromLocatorId;
    }

    public void setFromLocatorId(Long fromLocatorId) {
        this.fromLocatorId = fromLocatorId;
    }

    public Long getToLocatorId() {
        return toLocatorId;
    }

    public void setToLocatorId(Long toLocatorId) {
        this.toLocatorId = toLocatorId;
    }

    public String getIssueMovementDocNo() {
        return issueMovementDocNo;
    }

    public void setIssueMovementDocNo(String issueMovementDocNo) {
        this.issueMovementDocNo = issueMovementDocNo;
    }

    public String getReceiptMovementDocNo() {
        return receiptMovementDocNo;
    }

    public void setReceiptMovementDocNo(String receiptMovementDocNo) {
        this.receiptMovementDocNo = receiptMovementDocNo;
    }
}
