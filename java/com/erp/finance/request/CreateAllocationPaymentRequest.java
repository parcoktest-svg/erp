package com.erp.finance.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class CreateAllocationPaymentRequest {

    private Long orgId;

    @NotNull
    private Long businessPartnerId;

    @NotNull
    private LocalDate paymentDate;

    private String description;

    @Valid
    @NotNull
    private List<AllocationLine> allocations;

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public Long getBusinessPartnerId() {
        return businessPartnerId;
    }

    public void setBusinessPartnerId(Long businessPartnerId) {
        this.businessPartnerId = businessPartnerId;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<AllocationLine> getAllocations() {
        return allocations;
    }

    public void setAllocations(List<AllocationLine> allocations) {
        this.allocations = allocations;
    }

    public static class AllocationLine {
        @NotNull
        private Long invoiceId;

        @NotNull
        private BigDecimal amount;

        public Long getInvoiceId() {
            return invoiceId;
        }

        public void setInvoiceId(Long invoiceId) {
            this.invoiceId = invoiceId;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }
    }
}
