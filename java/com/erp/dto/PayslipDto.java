package com.erp.dto;

import java.time.LocalDate;
import java.util.List;

public class PayslipDto {

    private Long payslipId;

    private Long employeeId;
    private String employeeName;
    private String department;
    private String role;

    private String payslipMonth;     // e.g., "April 2025"
    private LocalDate paymentDate;

    private double baseSalary;
    private double bonus;
    private double deductions;
    private double finalSalary;

    private double performanceRating;
    private String performanceImpact;

    private String status;
    private String downloadUrl;

    private List<PayslipLogDto> logs;  // Optional: For audit trail

    public PayslipDto() {
    }

    public PayslipDto(Long payslipId, Long employeeId, String employeeName, String department, String role, String payslipMonth, LocalDate paymentDate, double baseSalary, double bonus, double deductions, double finalSalary, double performanceRating, String performanceImpact, String status, String downloadUrl, List<PayslipLogDto> logs) {
        this.payslipId = payslipId;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.department = department;
        this.role = role;
        this.payslipMonth = payslipMonth;
        this.paymentDate = paymentDate;
        this.baseSalary = baseSalary;
        this.bonus = bonus;
        this.deductions = deductions;
        this.finalSalary = finalSalary;
        this.performanceRating = performanceRating;
        this.performanceImpact = performanceImpact;
        this.status = status;
        this.downloadUrl = downloadUrl;
        this.logs = logs;
    }

    public Long getPayslipId() { return payslipId; }
    public void setPayslipId(Long payslipId) { this.payslipId = payslipId; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPayslipMonth() { return payslipMonth; }
    public void setPayslipMonth(String payslipMonth) { this.payslipMonth = payslipMonth; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

    public double getBaseSalary() { return baseSalary; }
    public void setBaseSalary(double baseSalary) { this.baseSalary = baseSalary; }

    public double getBonus() { return bonus; }
    public void setBonus(double bonus) { this.bonus = bonus; }

    public double getDeductions() { return deductions; }
    public void setDeductions(double deductions) { this.deductions = deductions; }

    public double getFinalSalary() { return finalSalary; }
    public void setFinalSalary(double finalSalary) { this.finalSalary = finalSalary; }

    public double getPerformanceRating() { return performanceRating; }
    public void setPerformanceRating(double performanceRating) { this.performanceRating = performanceRating; }

    public String getPerformanceImpact() { return performanceImpact; }
    public void setPerformanceImpact(String performanceImpact) { this.performanceImpact = performanceImpact; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDownloadUrl() { return downloadUrl; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }

    public List<PayslipLogDto> getLogs() { return logs; }
    public void setLogs(List<PayslipLogDto> logs) { this.logs = logs; }
}
