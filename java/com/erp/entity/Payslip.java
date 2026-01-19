package com.erp.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "payslips")
public class Payslip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private Double baseSalary;
    private Double bonus;
    private Double deduction;
    private Double totalPayable;

    private LocalDate dateIssued;

    private String status; // e.g., "Generated", "Emailed"
    private String downloadUrl;

    public Payslip() {
    }

    public Payslip(Long id, Employee employee, Double baseSalary, Double bonus, Double deduction, Double totalPayable, LocalDate dateIssued, String status, String downloadUrl) {
        this.id = id;
        this.employee = employee;
        this.baseSalary = baseSalary;
        this.bonus = bonus;
        this.deduction = deduction;
        this.totalPayable = totalPayable;
        this.dateIssued = dateIssued;
        this.status = status;
        this.downloadUrl = downloadUrl;
    }

    @PrePersist
    public void prePersist() {
        if (this.dateIssued == null) {
            this.dateIssued = LocalDate.now();
        }
    }

    public Double calculateNetSalary() {
        return (baseSalary != null ? baseSalary : 0.0) +
               (bonus != null ? bonus : 0.0) -
               (deduction != null ? deduction : 0.0);
    }

    public Double getNetSalary() {
        return calculateNetSalary();
    }

    public int getMonth() {
        return dateIssued != null ? dateIssued.getMonthValue() : 0;
    }

    public int getYear() {
        return dateIssued != null ? dateIssued.getYear() : 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Double getBaseSalary() {
        return baseSalary;
    }

    public void setBaseSalary(Double baseSalary) {
        this.baseSalary = baseSalary;
    }

    public Double getBonus() {
        return bonus;
    }

    public void setBonus(Double bonus) {
        this.bonus = bonus;
    }

    public Double getDeduction() {
        return deduction;
    }

    public void setDeduction(Double deduction) {
        this.deduction = deduction;
    }

    public Double getTotalPayable() {
        return totalPayable;
    }

    public void setTotalPayable(Double totalPayable) {
        this.totalPayable = totalPayable;
    }

    public LocalDate getDateIssued() {
        return dateIssued;
    }

    public void setDateIssued(LocalDate dateIssued) {
        this.dateIssued = dateIssued;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }
}
