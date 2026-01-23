package com.erp.sales.entity;

import java.util.ArrayList;
import java.util.List;

import com.erp.core.model.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "trx_sales_order_line_bom",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_trx_sol_bom_line", columnNames = { "sales_order_line_id" })
        })
public class SalesOrderLineBom extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sales_order_line_id", nullable = false)
    private SalesOrderLine salesOrderLine;

    @Column(name = "source_bom_id")
    private Long sourceBomId;

    @Column(name = "source_bom_version")
    private Integer sourceBomVersion;

    @OneToMany(mappedBy = "salesOrderLineBom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SalesOrderLineBomLine> lines = new ArrayList<>();

    public SalesOrderLine getSalesOrderLine() {
        return salesOrderLine;
    }

    public void setSalesOrderLine(SalesOrderLine salesOrderLine) {
        this.salesOrderLine = salesOrderLine;
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

    public List<SalesOrderLineBomLine> getLines() {
        return lines;
    }

    public void setLines(List<SalesOrderLineBomLine> lines) {
        this.lines = lines;
    }
}
