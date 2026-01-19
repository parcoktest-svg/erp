package com.erp.dto;

import java.time.LocalDate;

import com.erp.entity.Attendance;

public class AttendanceResponseDto {
	
    private Long employeeId;
    private String employeeName;
    private LocalDate date;
    private String status;
    private boolean present;
    
    public AttendanceResponseDto() {
    }
    
	public AttendanceResponseDto(Long employeeId, String employeeName, LocalDate date, String status, boolean present) {
		super();
		this.employeeId = employeeId;
		this.employeeName = employeeName;
		this.date = date;
		this.status = status;
		this.present = present;
	}    
    
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public boolean isPresent() { return present; }
    public void setPresent(boolean present) { this.present = present; }

    public static AttendanceResponseDtoBuilder builder() {
        return new AttendanceResponseDtoBuilder();
    }

    public static class AttendanceResponseDtoBuilder {
        private Long employeeId;
        private String employeeName;
        private LocalDate date;
        private String status;
        private boolean present;

        AttendanceResponseDtoBuilder() {}

        public AttendanceResponseDtoBuilder employeeId(Long employeeId) { this.employeeId = employeeId; return this; }
        public AttendanceResponseDtoBuilder employeeName(String employeeName) { this.employeeName = employeeName; return this; }
        public AttendanceResponseDtoBuilder date(LocalDate date) { this.date = date; return this; }
        public AttendanceResponseDtoBuilder status(String status) { this.status = status; return this; }
        public AttendanceResponseDtoBuilder present(boolean present) { this.present = present; return this; }
        public AttendanceResponseDto build() { return new AttendanceResponseDto(employeeId, employeeName, date, status, present); }
    }

	 public static AttendanceResponseDto fromEntity(Attendance attendance) {
	        return AttendanceResponseDto.builder()
//	                .id(attendance.getId())
	                .employeeId(attendance.getEmployee().getId())
	                .employeeName(attendance.getEmployee().getName())
	                .date(attendance.getDate())
	                .status(attendance.getStatus().toString())
	                .present(attendance.isPresent())
	                .build();
	    }
    
    
}
