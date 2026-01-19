package com.erp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private LocalDate date;

    private boolean present;
    

    private String remarks; // optional notes

    @Enumerated(EnumType.STRING)
    private AttendanceStatus status; // e.g., "PRESENT", "ABSENT", "LEAVE", "NOT_MARKED"

    private boolean overtime;  // Assuming you want to store overtime status.
    
    public Attendance() {}

    public Attendance(Long id, Employee employee, LocalDate date, boolean present, String remarks, AttendanceStatus status, boolean overtime) {
        this.id = id;
        this.employee = employee;
        this.date = date;
        this.present = present;
        this.remarks = remarks;
        this.status = status;
        this.overtime = overtime;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public boolean isPresent() { return present; }
    public void setPresent(boolean present) { this.present = present; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public AttendanceStatus getStatus() { return status; }
    public void setStatus(AttendanceStatus status) { this.status = status; }
    public void setOvertime(boolean overtime) { this.overtime = overtime; }

    public static AttendanceBuilder builder() { return new AttendanceBuilder(); }

    public static class AttendanceBuilder {
        private Long id;
        private Employee employee;
        private LocalDate date;
        private boolean present;
        private String remarks;
        private AttendanceStatus status;
        private boolean overtime;

        AttendanceBuilder() {}

        public AttendanceBuilder id(Long id) { this.id = id; return this; }
        public AttendanceBuilder employee(Employee employee) { this.employee = employee; return this; }
        public AttendanceBuilder date(LocalDate date) { this.date = date; return this; }
        public AttendanceBuilder present(boolean present) { this.present = present; return this; }
        public AttendanceBuilder remarks(String remarks) { this.remarks = remarks; return this; }
        public AttendanceBuilder status(AttendanceStatus status) { this.status = status; return this; }
        public AttendanceBuilder overtime(boolean overtime) { this.overtime = overtime; return this; }
        public Attendance build() { return new Attendance(id, employee, date, present, remarks, status, overtime); }
    }

    public enum AttendanceStatus {
        PRESENT,
        ABSENT,
        LEAVE,
        HALF_DAY,
        NOT_MARKED;

        public boolean isCountedAsPresent() {
            return this == PRESENT || this == HALF_DAY;
        }
    }


    public boolean isOvertime() {
        return overtime;
    }
}
