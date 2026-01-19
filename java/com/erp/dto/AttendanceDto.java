package com.erp.dto;

import java.time.LocalDate;

import com.erp.entity.Attendance;
import com.erp.entity.Attendance.AttendanceStatus;
import com.erp.entity.Employee;

import jakarta.validation.constraints.NotNull;

public class AttendanceDto {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    private String employeeName;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Status is required")
    private AttendanceStatus status;

    private boolean present;

    private boolean overtime;

    private String remarks;

    public AttendanceDto() {
    }

    public AttendanceDto(Long employeeId, String employeeName, LocalDate date, AttendanceStatus status, boolean present, boolean overtime, String remarks) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.date = date;
        this.status = status;
        this.present = present;
        this.overtime = overtime;
        this.remarks = remarks;
    }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public AttendanceStatus getStatus() { return status; }
    public void setStatus(AttendanceStatus status) { this.status = status; }

    public boolean isPresent() { return present; }
    public void setPresent(boolean present) { this.present = present; }

    public boolean isOvertime() { return overtime; }
    public void setOvertime(boolean overtime) { this.overtime = overtime; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public static AttendanceDtoBuilder builder() {
        return new AttendanceDtoBuilder();
    }

    public static class AttendanceDtoBuilder {
        private Long employeeId;
        private String employeeName;
        private LocalDate date;
        private AttendanceStatus status;
        private boolean present;
        private boolean overtime;
        private String remarks;

        AttendanceDtoBuilder() { }

        public AttendanceDtoBuilder employeeId(Long employeeId) { this.employeeId = employeeId; return this; }
        public AttendanceDtoBuilder employeeName(String employeeName) { this.employeeName = employeeName; return this; }
        public AttendanceDtoBuilder date(LocalDate date) { this.date = date; return this; }
        public AttendanceDtoBuilder status(AttendanceStatus status) { this.status = status; return this; }
        public AttendanceDtoBuilder present(boolean present) { this.present = present; return this; }
        public AttendanceDtoBuilder overtime(boolean overtime) { this.overtime = overtime; return this; }
        public AttendanceDtoBuilder remarks(String remarks) { this.remarks = remarks; return this; }

        public AttendanceDto build() {
            return new AttendanceDto(employeeId, employeeName, date, status, present, overtime, remarks);
        }
    }

    public static AttendanceDto fromEntity(Attendance attendance) {
        return AttendanceDto.builder()
                .employeeId(attendance.getEmployee().getId())
                .employeeName(attendance.getEmployee().getName())
                .date(attendance.getDate())
                .status(attendance.getStatus())
                .present(attendance.getStatus().isCountedAsPresent())
                .overtime(attendance.isOvertime())
                .remarks(attendance.getRemarks())
                .build();
    }

    
    public Attendance toEntity(Employee employee) {
        return Attendance.builder()
                .employee(employee)
                .date(this.date != null ? this.date : LocalDate.now())
                .status(this.status)
                .present(this.status.isCountedAsPresent())
                .overtime(this.overtime)
                .remarks(this.remarks)
                .build();
    }

}
