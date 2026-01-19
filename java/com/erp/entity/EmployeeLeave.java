package com.erp.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class EmployeeLeave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee;


    private String leaveType;
    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private LeaveStatus status;

    private String reason;

    public enum LeaveStatus {
        PENDING, APPROVED, REJECTED
    }

    public EmployeeLeave() {
    }

    public EmployeeLeave(Long id, Employee employee, String leaveType, LocalDate startDate, LocalDate endDate, LeaveStatus status, String reason) {
        this.id = id;
        this.employee = employee;
        this.leaveType = leaveType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.reason = reason;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public String getLeaveType() { return leaveType; }
    public void setLeaveType(String leaveType) { this.leaveType = leaveType; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public LeaveStatus getStatus() { return status; }
    public void setStatus(LeaveStatus status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public static EmployeeLeaveBuilder builder() {
        return new EmployeeLeaveBuilder();
    }

    public static class EmployeeLeaveBuilder {
        private Long id;
        private Employee employee;
        private String leaveType;
        private LocalDate startDate;
        private LocalDate endDate;
        private LeaveStatus status;
        private String reason;

        EmployeeLeaveBuilder() { }

        public EmployeeLeaveBuilder id(Long id) { this.id = id; return this; }
        public EmployeeLeaveBuilder employee(Employee employee) { this.employee = employee; return this; }
        public EmployeeLeaveBuilder leaveType(String leaveType) { this.leaveType = leaveType; return this; }
        public EmployeeLeaveBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public EmployeeLeaveBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public EmployeeLeaveBuilder status(LeaveStatus status) { this.status = status; return this; }
        public EmployeeLeaveBuilder reason(String reason) { this.reason = reason; return this; }

        public EmployeeLeave build() {
            return new EmployeeLeave(id, employee, leaveType, startDate, endDate, status, reason);
        }
    }
    
    
	

	
}
