package com.erp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.logging.Logger;

@Entity
@Table(name = "salary")
public class Salary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    @JsonIgnore
    private Employee employee;

    private String employeeName;

    @NotNull(message = "Department cannot be null")
    private String department;

    @NotNull(message = "Month cannot be null")
    private LocalDate month;

    @Min(value = 0, message = "Base salary must be a positive value")
    private Double baseSalary;

    private Double bonus = 0.0;  // Default value for bonus
    private Double tax = 0.0;    // Default value for tax
    private Double deduction = 0.0;  // Default value for deduction

    private int presentDays;
    private int leaveDays;
    private int absentDays;
    


    @Column(nullable = false)
    private Double finalSalary; // baseSalary + bonus - deductions

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performance_review_id", nullable = true)
    private PerformanceReview performanceReview;  // new field for performance review

    private Double totalPayable;
    private boolean approvedByHR;
    private boolean forwardedToFinance;
    private boolean paid;

    private LocalDate date;

    // Logger for business operations
    private static final Logger logger = Logger.getLogger(Salary.class.getName());
    
    // Manual Builder Implementation
    public static SalaryBuilder builder() {
        return new SalaryBuilder();
    }

    public static class SalaryBuilder {
        private Long id;
        private Employee employee;
        private String employeeName;
        private String department;
        private LocalDate month;
        private Double baseSalary;
        private Double bonus = 0.0;
        private Double tax = 0.0;
        private Double deduction = 0.0;
        private int presentDays;
        private int leaveDays;
        private int absentDays;
        private Double finalSalary;
        private PerformanceReview performanceReview;
        private Double totalPayable;
        private boolean approvedByHR;
        private boolean forwardedToFinance;
        private boolean paid;
        private LocalDate date;

        SalaryBuilder() {
        }

        public SalaryBuilder id(Long id) { this.id = id; return this; }
        public SalaryBuilder employee(Employee employee) { this.employee = employee; return this; }
        public SalaryBuilder employeeName(String employeeName) { this.employeeName = employeeName; return this; }
        public SalaryBuilder department(String department) { this.department = department; return this; }
        public SalaryBuilder month(LocalDate month) { this.month = month; return this; }
        public SalaryBuilder baseSalary(Double baseSalary) { this.baseSalary = baseSalary; return this; }
        public SalaryBuilder bonus(Double bonus) { this.bonus = bonus; return this; }
        public SalaryBuilder tax(Double tax) { this.tax = tax; return this; }
        public SalaryBuilder deduction(Double deduction) { this.deduction = deduction; return this; }
        public SalaryBuilder presentDays(int presentDays) { this.presentDays = presentDays; return this; }
        public SalaryBuilder leaveDays(int leaveDays) { this.leaveDays = leaveDays; return this; }
        public SalaryBuilder absentDays(int absentDays) { this.absentDays = absentDays; return this; }
        public SalaryBuilder finalSalary(Double finalSalary) { this.finalSalary = finalSalary; return this; }
        public SalaryBuilder performanceReview(PerformanceReview performanceReview) { this.performanceReview = performanceReview; return this; }
        public SalaryBuilder totalPayable(Double totalPayable) { this.totalPayable = totalPayable; return this; }
        public SalaryBuilder approvedByHR(boolean approvedByHR) { this.approvedByHR = approvedByHR; return this; }
        public SalaryBuilder forwardedToFinance(boolean forwardedToFinance) { this.forwardedToFinance = forwardedToFinance; return this; }
        public SalaryBuilder paid(boolean paid) { this.paid = paid; return this; }
        public SalaryBuilder date(LocalDate date) { this.date = date; return this; }

        public Salary build() {
            Salary salary = new Salary();
            salary.setId(id);
            salary.setEmployee(employee);
            salary.setEmployeeName(employeeName);
            salary.setDepartment(department);
            salary.setMonth(month);
            salary.setBaseSalary(baseSalary);
            salary.setBonus(bonus);
            salary.setTax(tax);
            salary.setDeduction(deduction);
            salary.setPresentDays(presentDays);
            salary.setLeaveDays(leaveDays);
            salary.setAbsentDays(absentDays);
            salary.setFinalSalary(finalSalary);
            salary.setPerformanceReview(performanceReview);
            salary.setTotalPayable(totalPayable);
            salary.setApprovedByHR(approvedByHR);
            salary.setForwardedToFinance(forwardedToFinance);
            salary.setPaid(paid);
            salary.setDate(date);
            return salary;
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public LocalDate getMonth() { return month; }
    public void setMonth(LocalDate month) { this.month = month; }

    public Double getBaseSalary() { return baseSalary; }
    public void setBaseSalary(Double baseSalary) { this.baseSalary = baseSalary; }

    public Double getBonus() { return bonus; }
    public void setBonus(Double bonus) { this.bonus = bonus; }

    public Double getTax() { return tax; }
    public void setTax(Double tax) { this.tax = tax; }

    public Double getDeduction() { return deduction; }
    public void setDeduction(Double deduction) { this.deduction = deduction; }

    public int getPresentDays() { return presentDays; }
    public void setPresentDays(int presentDays) { this.presentDays = presentDays; }

    public int getLeaveDays() { return leaveDays; }
    public void setLeaveDays(int leaveDays) { this.leaveDays = leaveDays; }

    public int getAbsentDays() { return absentDays; }
    public void setAbsentDays(int absentDays) { this.absentDays = absentDays; }

    public Double getFinalSalary() { return finalSalary; }
    public void setFinalSalary(Double finalSalary) { this.finalSalary = finalSalary; }

    public PerformanceReview getPerformanceReview() { return performanceReview; }
    public void setPerformanceReview(PerformanceReview performanceReview) { this.performanceReview = performanceReview; }

    public Double getTotalPayable() { return totalPayable; }
    public void setTotalPayable(Double totalPayable) { this.totalPayable = totalPayable; }

    public boolean isApprovedByHR() { return approvedByHR; }
    public void setApprovedByHR(boolean approvedByHR) { this.approvedByHR = approvedByHR; }

    public boolean isForwardedToFinance() { return forwardedToFinance; }
    public void setForwardedToFinance(boolean forwardedToFinance) { this.forwardedToFinance = forwardedToFinance; }

    public boolean isPaid() { return paid; }
    public void setPaid(boolean paid) { this.paid = paid; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    

 
    public Double getTotalEarnings() {
        Double earnings = baseSalary + (bonus != null ? bonus : 0.0)
                - (tax != null ? tax : 0.0)
                - (deduction != null ? deduction : 0.0);
        
        // Log the earnings calculation
        logger.info("Earnings calculation: " + earnings);
        
        return earnings;
    }

    /**
     * Determines the salary approval status based on internal flags.
     * This is important in real-world use to track the approval workflow.
     */
    public String getStatus() {
        if (!approvedByHR) {
            return "Pending HR Approval";
        }
        if (!forwardedToFinance) {
            return "Awaiting Finance";
        }
        if (paid) {
            return "Paid";
        }
        return "Forwarded to Finance";
    }

    /**
     * Calculates and sets the total payable amount.
     * In real-world systems, this could include other dynamic factors such as bonuses, tax rules, etc.
     */
    public void calculateTotalPayable() {
        this.totalPayable = getTotalEarnings();  // Can be expanded with more business logic
        logger.info("Total payable amount calculated: " + totalPayable);
    }

    /**
     * Validates the salary object. This ensures the object is in a valid state before performing any operations.
     */
    public void validate() {
        if (baseSalary <= 0) {
            throw new IllegalArgumentException("Base salary must be greater than zero");
        }
        if (month.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Month cannot be in the future");
        }
        logger.info("Salary object validated successfully.");
    }

    /**
     * Event triggered when salary is approved by HR.
     * In real-world use, this could trigger notifications or further actions.
     */
    public void approveByHR() {
        if (approvedByHR) {
            throw new IllegalStateException("Salary already approved by HR.");
        }
        approvedByHR = true;
        logger.info("Salary approved by HR for employee: " + employeeName);
    }

    /**
     * Event triggered when salary is forwarded to finance.
     * This would trigger the finance team to process the payment.
     */
    public void forwardToFinance() {
        if (!approvedByHR) {
            throw new IllegalStateException("Salary must be approved by HR first.");
        }
        forwardedToFinance = true;
        logger.info("Salary forwarded to finance for employee: " + employeeName);
    }

    /**
     * Marks salary as paid and triggers a payment action.
     */
    public void markAsPaid() {
        if (!forwardedToFinance) {
            throw new IllegalStateException("Salary must be forwarded to finance before marking as paid.");
        }
        paid = true;
        logger.info("Salary marked as paid for employee: " + employeeName);
    }

	@Override
	public String toString() {
		return "Salary [id=" + id + ", employee=" + employee + ", employeeName=" + employeeName + ", department="
				+ department + ", month=" + month + ", baseSalary=" + baseSalary + ", bonus=" + bonus + ", tax=" + tax
				+ ", deduction=" + deduction + ", presentDays=" + presentDays + ", leaveDays=" + leaveDays
				+ ", absentDays=" + absentDays + ", finalSalary=" + finalSalary + ", performanceReview="
				+ performanceReview + ", totalPayable=" + totalPayable + ", approvedByHR=" + approvedByHR
				+ ", forwardedToFinance=" + forwardedToFinance + ", paid=" + paid + ", date=" + date + "]";
	}
}
