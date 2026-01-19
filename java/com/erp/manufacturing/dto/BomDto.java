package com.erp.manufacturing.dto;

import java.util.ArrayList;
import java.util.List;

public class BomDto {

    private Long id;
    private Long companyId;
    private Long orgId;
    private Long productId;
    private Integer version;
    private boolean active;

    private List<BomLineDto> lines = new ArrayList<>();

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

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public List<BomLineDto> getLines() {
        return lines;
    }

    public void setLines(List<BomLineDto> lines) {
        this.lines = lines;
    }
}
