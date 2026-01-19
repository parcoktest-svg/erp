package com.erp.finance.dto;

import java.math.BigDecimal;

public class AgingPartnerRowDto {

    private Long businessPartnerId;
    private String businessPartnerName;

    private BigDecimal bucket0To30 = BigDecimal.ZERO;
    private BigDecimal bucket31To60 = BigDecimal.ZERO;
    private BigDecimal bucket61To90 = BigDecimal.ZERO;
    private BigDecimal bucketOver90 = BigDecimal.ZERO;
    private BigDecimal totalOpen = BigDecimal.ZERO;

    public Long getBusinessPartnerId() {
        return businessPartnerId;
    }

    public void setBusinessPartnerId(Long businessPartnerId) {
        this.businessPartnerId = businessPartnerId;
    }

    public String getBusinessPartnerName() {
        return businessPartnerName;
    }

    public void setBusinessPartnerName(String businessPartnerName) {
        this.businessPartnerName = businessPartnerName;
    }

    public BigDecimal getBucket0To30() {
        return bucket0To30;
    }

    public void setBucket0To30(BigDecimal bucket0To30) {
        this.bucket0To30 = bucket0To30;
    }

    public BigDecimal getBucket31To60() {
        return bucket31To60;
    }

    public void setBucket31To60(BigDecimal bucket31To60) {
        this.bucket31To60 = bucket31To60;
    }

    public BigDecimal getBucket61To90() {
        return bucket61To90;
    }

    public void setBucket61To90(BigDecimal bucket61To90) {
        this.bucket61To90 = bucket61To90;
    }

    public BigDecimal getBucketOver90() {
        return bucketOver90;
    }

    public void setBucketOver90(BigDecimal bucketOver90) {
        this.bucketOver90 = bucketOver90;
    }

    public BigDecimal getTotalOpen() {
        return totalOpen;
    }

    public void setTotalOpen(BigDecimal totalOpen) {
        this.totalOpen = totalOpen;
    }
}
