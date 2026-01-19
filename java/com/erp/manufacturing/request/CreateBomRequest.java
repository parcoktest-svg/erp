package com.erp.manufacturing.request;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class CreateBomRequest {

    private Long orgId;

    @NotNull
    private Long productId;

    @NotNull
    private Integer version;

    private Boolean active;

    @Valid
    @NotNull
    private List<CreateBomLineRequest> lines;

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

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public List<CreateBomLineRequest> getLines() {
        return lines;
    }

    public void setLines(List<CreateBomLineRequest> lines) {
        this.lines = lines;
    }

    public static class CreateBomLineRequest {
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
