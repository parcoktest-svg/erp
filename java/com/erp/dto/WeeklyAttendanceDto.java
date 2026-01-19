package com.erp.dto;

import java.util.Map;

public class WeeklyAttendanceDto {
    private Map<String, Map<String, Long>> dailyStatus;

    public WeeklyAttendanceDto() {}

    public WeeklyAttendanceDto(Map<String, Map<String, Long>> dailyStatus) {
        this.dailyStatus = dailyStatus;
    }

    public Map<String, Map<String, Long>> getDailyStatus() { return dailyStatus; }
    public void setDailyStatus(Map<String, Map<String, Long>> dailyStatus) { this.dailyStatus = dailyStatus; }
}
