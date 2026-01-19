package com.erp.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "leaves")
public class Leave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private LeaveStatus status;

    public enum LeaveStatus {
        PENDING,
        APPROVED,
        REJECTED,
        HALF_DAY
    }
    public boolean isLeaveApplicable(LocalDate date) {
        return (status == LeaveStatus.APPROVED) && (date != null && !date.isBefore(startDate) && !date.isAfter(endDate));
    }

    public Leave() {
    }

    public Leave(Long id, Employee employee, LocalDate startDate, LocalDate endDate, LeaveStatus status) {
        this.id = id;
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public LeaveStatus getStatus() { return status; }
    public void setStatus(LeaveStatus status) { this.status = status; }

    public static LeaveBuilder builder() {
        return new LeaveBuilder();
    }

    public static class LeaveBuilder {
        private Long id;
        private Employee employee;
        private LocalDate startDate;
        private LocalDate endDate;
        private LeaveStatus status;

        LeaveBuilder() { }

        public LeaveBuilder id(Long id) { this.id = id; return this; }
        public LeaveBuilder employee(Employee employee) { this.employee = employee; return this; }
        public LeaveBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public LeaveBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public LeaveBuilder status(LeaveStatus status) { this.status = status; return this; }

        public Leave build() {
            return new Leave(id, employee, startDate, endDate, status);
        }
    }
}
