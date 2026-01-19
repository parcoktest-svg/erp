package com.erp.dto;

import java.util.Map;

public class DepartmentAttendanceDto {
	
    private Map<String, Map<String, Long>> departmentAttendance;

    private Map<String, Map<String, Long>> departmentStatus;
    
    public DepartmentAttendanceDto() {
    }

    public DepartmentAttendanceDto(Map<String, Map<String, Long>> departmentAttendance, Map<String, Map<String, Long>> departmentStatus) {
        this.departmentAttendance = departmentAttendance;
        this.departmentStatus = departmentStatus;
    }

    public Map<String, Map<String, Long>> getDepartmentAttendance() {
        return departmentAttendance;
    }

    public void setDepartmentAttendance(Map<String, Map<String, Long>> departmentAttendance) {
        this.departmentAttendance = departmentAttendance;
    }

    public Map<String, Map<String, Long>> getDepartmentStatus() {
        return departmentStatus;
    }

    public void setDepartmentStatus(Map<String, Map<String, Long>> departmentStatus) {
        this.departmentStatus = departmentStatus;
    }
}
