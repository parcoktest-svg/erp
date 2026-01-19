package com.erp.dto;

public class SalaryPayslipDto {

    private Long id;
    private String employeeName;
    private String employeeEmail;  // ✅ Add this line
    private String department;
    private String month; // e.g., "April 2025"

    private double baseSalary;
    private double bonus;
    private double tax;
    private double deduction;

    private int presentDays;
    private int absentDays;
    private int leaveDays;

    private double totalEarnings;
    private boolean approvedByHR;
    private boolean forwardedToFinance;
    private boolean paid;

    private double netSalary;
    private String status;
    private String downloadUrl;

    public SalaryPayslipDto() {
    }

    public SalaryPayslipDto(Long id, String employeeName, String employeeEmail, String department, String month, double baseSalary, double bonus, double tax, double deduction, int presentDays, int absentDays, int leaveDays, double totalEarnings, boolean approvedByHR, boolean forwardedToFinance, boolean paid, double netSalary, String status, String downloadUrl) {
        this.id = id;
        this.employeeName = employeeName;
        this.employeeEmail = employeeEmail;
        this.department = department;
        this.month = month;
        this.baseSalary = baseSalary;
        this.bonus = bonus;
        this.tax = tax;
        this.deduction = deduction;
        this.presentDays = presentDays;
        this.absentDays = absentDays;
        this.leaveDays = leaveDays;
        this.totalEarnings = totalEarnings;
        this.approvedByHR = approvedByHR;
        this.forwardedToFinance = forwardedToFinance;
        this.paid = paid;
        this.netSalary = netSalary;
        this.status = status;
        this.downloadUrl = downloadUrl;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
    public String getEmployeeEmail() { return employeeEmail; }
    public void setEmployeeEmail(String employeeEmail) { this.employeeEmail = employeeEmail; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
    public double getBaseSalary() { return baseSalary; }
    public void setBaseSalary(double baseSalary) { this.baseSalary = baseSalary; }
    public double getBonus() { return bonus; }
    public void setBonus(double bonus) { this.bonus = bonus; }
    public double getTax() { return tax; }
    public void setTax(double tax) { this.tax = tax; }
    public double getDeduction() { return deduction; }
    public void setDeduction(double deduction) { this.deduction = deduction; }
    public int getPresentDays() { return presentDays; }
    public void setPresentDays(int presentDays) { this.presentDays = presentDays; }
    public int getAbsentDays() { return absentDays; }
    public void setAbsentDays(int absentDays) { this.absentDays = absentDays; }
    public int getLeaveDays() { return leaveDays; }
    public void setLeaveDays(int leaveDays) { this.leaveDays = leaveDays; }
    public double getTotalEarnings() { return totalEarnings; }
    public void setTotalEarnings(double totalEarnings) { this.totalEarnings = totalEarnings; }
    public boolean isApprovedByHR() { return approvedByHR; }
    public void setApprovedByHR(boolean approvedByHR) { this.approvedByHR = approvedByHR; }
    public boolean isForwardedToFinance() { return forwardedToFinance; }
    public void setForwardedToFinance(boolean forwardedToFinance) { this.forwardedToFinance = forwardedToFinance; }
    public boolean isPaid() { return paid; }
    public void setPaid(boolean paid) { this.paid = paid; }
    public double getNetSalary() { return netSalary; }
    public void setNetSalary(double netSalary) { this.netSalary = netSalary; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDownloadUrl() { return downloadUrl; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }

    // Manual Builder
    public static SalaryPayslipDtoBuilder builder() {
        return new SalaryPayslipDtoBuilder();
    }

    public static class SalaryPayslipDtoBuilder {
        private Long id;
        private String employeeName;
        private String employeeEmail;
        private String department;
        private String month;
        private double baseSalary;
        private double bonus;
        private double tax;
        private double deduction;
        private int presentDays;
        private int absentDays;
        private int leaveDays;
        private double totalEarnings;
        private boolean approvedByHR;
        private boolean forwardedToFinance;
        private boolean paid;
        private double netSalary;
        private String status;
        private String downloadUrl;

        SalaryPayslipDtoBuilder() { }

        public SalaryPayslipDtoBuilder id(Long id) { this.id = id; return this; }
        public SalaryPayslipDtoBuilder employeeName(String employeeName) { this.employeeName = employeeName; return this; }
        public SalaryPayslipDtoBuilder employeeEmail(String employeeEmail) { this.employeeEmail = employeeEmail; return this; }
        public SalaryPayslipDtoBuilder department(String department) { this.department = department; return this; }
        public SalaryPayslipDtoBuilder month(String month) { this.month = month; return this; }
        public SalaryPayslipDtoBuilder baseSalary(double baseSalary) { this.baseSalary = baseSalary; return this; }
        public SalaryPayslipDtoBuilder bonus(double bonus) { this.bonus = bonus; return this; }
        public SalaryPayslipDtoBuilder tax(double tax) { this.tax = tax; return this; }
        public SalaryPayslipDtoBuilder deduction(double deduction) { this.deduction = deduction; return this; }
        public SalaryPayslipDtoBuilder presentDays(int presentDays) { this.presentDays = presentDays; return this; }
        public SalaryPayslipDtoBuilder absentDays(int absentDays) { this.absentDays = absentDays; return this; }
        public SalaryPayslipDtoBuilder leaveDays(int leaveDays) { this.leaveDays = leaveDays; return this; }
        public SalaryPayslipDtoBuilder totalEarnings(double totalEarnings) { this.totalEarnings = totalEarnings; return this; }
        public SalaryPayslipDtoBuilder approvedByHR(boolean approvedByHR) { this.approvedByHR = approvedByHR; return this; }
        public SalaryPayslipDtoBuilder forwardedToFinance(boolean forwardedToFinance) { this.forwardedToFinance = forwardedToFinance; return this; }
        public SalaryPayslipDtoBuilder paid(boolean paid) { this.paid = paid; return this; }
        public SalaryPayslipDtoBuilder netSalary(double netSalary) { this.netSalary = netSalary; return this; }
        public SalaryPayslipDtoBuilder status(String status) { this.status = status; return this; }
        public SalaryPayslipDtoBuilder downloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; return this; }

        public SalaryPayslipDto build() {
            return new SalaryPayslipDto(id, employeeName, employeeEmail, department, month, baseSalary, bonus, tax, deduction, presentDays, absentDays, leaveDays, totalEarnings, approvedByHR, forwardedToFinance, paid, netSalary, status, downloadUrl);
        }
    }
}
