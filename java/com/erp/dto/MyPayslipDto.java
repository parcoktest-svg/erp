package com.erp.dto;

public class MyPayslipDto {
    private Long id;
    private String month;
    private int year;
    private double netSalary;
    private String status;
    private String downloadUrl;

    public MyPayslipDto() {
    }

    public MyPayslipDto(Long id, String month, int year, double netSalary, String status, String downloadUrl) {
        this.id = id;
        this.month = month;
        this.year = year;
        this.netSalary = netSalary;
        this.status = status;
        this.downloadUrl = downloadUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public double getNetSalary() { return netSalary; }
    public void setNetSalary(double netSalary) { this.netSalary = netSalary; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDownloadUrl() { return downloadUrl; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }
}
