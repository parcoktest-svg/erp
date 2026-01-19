package com.erp.manufacturing.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.erp.core.entity.Company;
import com.erp.core.entity.Org;
import com.erp.core.model.BaseEntity;
import com.erp.core.model.DocumentStatus;
import com.erp.inventory.entity.Locator;
import com.erp.masterdata.entity.Product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "mfg_work_order")
public class WorkOrder extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id")
    private Org org;

    @Column(nullable = false, unique = true)
    private String documentNo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentStatus status = DocumentStatus.DRAFTED;

    @Column(nullable = false)
    private LocalDate workDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bom_id", nullable = false)
    private Bom bom;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private BigDecimal qty;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "from_locator_id", nullable = false)
    private Locator fromLocator;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "to_locator_id", nullable = false)
    private Locator toLocator;

    private String description;

    private String issueMovementDocNo;

    private String receiptMovementDocNo;

    private String issueReversalMovementDocNo;

    private String receiptReversalMovementDocNo;

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Org getOrg() {
        return org;
    }

    public void setOrg(Org org) {
        this.org = org;
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

    public Bom getBom() {
        return bom;
    }

    public void setBom(Bom bom) {
        this.bom = bom;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public BigDecimal getQty() {
        return qty;
    }

    public void setQty(BigDecimal qty) {
        this.qty = qty;
    }

    public Locator getFromLocator() {
        return fromLocator;
    }

    public void setFromLocator(Locator fromLocator) {
        this.fromLocator = fromLocator;
    }

    public Locator getToLocator() {
        return toLocator;
    }

    public void setToLocator(Locator toLocator) {
        this.toLocator = toLocator;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public String getIssueReversalMovementDocNo() {
        return issueReversalMovementDocNo;
    }

    public void setIssueReversalMovementDocNo(String issueReversalMovementDocNo) {
        this.issueReversalMovementDocNo = issueReversalMovementDocNo;
    }

    public String getReceiptReversalMovementDocNo() {
        return receiptReversalMovementDocNo;
    }

    public void setReceiptReversalMovementDocNo(String receiptReversalMovementDocNo) {
        this.receiptReversalMovementDocNo = receiptReversalMovementDocNo;
    }
}
