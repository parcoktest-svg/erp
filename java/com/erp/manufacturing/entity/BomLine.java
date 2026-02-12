package com.erp.manufacturing.entity;

import java.math.BigDecimal;

import com.erp.core.model.BaseEntity;
import com.erp.masterdata.entity.Material;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "mfg_bom_line")
public class BomLine extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bom_id", nullable = false)
    private Bom bom;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "component_material_id", nullable = false)
    private Material componentMaterial;

    @Column(nullable = false)
    private BigDecimal qty;

    public Bom getBom() {
        return bom;
    }

    public void setBom(Bom bom) {
        this.bom = bom;
    }

    public Material getComponentMaterial() {
        return componentMaterial;
    }

    public void setComponentMaterial(Material componentMaterial) {
        this.componentMaterial = componentMaterial;
    }

    public BigDecimal getQty() {
        return qty;
    }

    public void setQty(BigDecimal qty) {
        this.qty = qty;
    }
}
