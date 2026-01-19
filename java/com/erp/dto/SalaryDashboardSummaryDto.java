package com.erp.dto;

public class SalaryDashboardSummaryDto {

    private Double totalPayout;
    private Long pendingPayslipsCount;
    private Long paidPayslipsCount;

    public SalaryDashboardSummaryDto() {
    }

    public SalaryDashboardSummaryDto(Double totalPayout, Long pendingPayslipsCount, Long paidPayslipsCount) {
        this.totalPayout = totalPayout;
        this.pendingPayslipsCount = pendingPayslipsCount;
        this.paidPayslipsCount = paidPayslipsCount;
    }

    public Double getTotalPayout() {
        return totalPayout;
    }

    public void setTotalPayout(Double totalPayout) {
        this.totalPayout = totalPayout;
    }

    public Long getPendingPayslipsCount() {
        return pendingPayslipsCount;
    }

    public void setPendingPayslipsCount(Long pendingPayslipsCount) {
        this.pendingPayslipsCount = pendingPayslipsCount;
    }

    public Long getPaidPayslipsCount() {
        return paidPayslipsCount;
    }

    public void setPaidPayslipsCount(Long paidPayslipsCount) {
        this.paidPayslipsCount = paidPayslipsCount;
    }

}
