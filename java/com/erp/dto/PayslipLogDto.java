package com.erp.dto;

import java.time.LocalDateTime;

import com.erp.entity.PayslipLog;

public class PayslipLogDto {
	
	public PayslipLogDto(PayslipLog.Action action, String doneBy, LocalDateTime timestamp) {
	    this.action = action.name(); // Convert enum to String
	    this.doneBy = doneBy;
	    this.timestamp = timestamp;
	}

    public PayslipLogDto() {
    }

    public PayslipLogDto(String action, String doneBy, LocalDateTime timestamp) {
        this.action = action;
        this.doneBy = doneBy;
        this.timestamp = timestamp;
    }

    private String action;         // e.g. "GENERATED", "EMAILED", "DOWNLOADED"
    private String doneBy;         // e.g. "hr@gmail.com"
    private LocalDateTime timestamp;

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getDoneBy() {
        return doneBy;
    }

    public void setDoneBy(String doneBy) {
        this.doneBy = doneBy;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
