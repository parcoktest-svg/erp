package com.erp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private USER_ROLE role;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    @JsonBackReference
    private Department department;

    @OneToMany(mappedBy = "employee")
    private List<Salary> salaries;

    private Boolean isActive;

    @Column(nullable = false)
    private String password;

    private Double baseSalary;
    private Double bonus;
    private Double deduction;
    
    private Double performanceRating;
    private Double finalSalary;
    
    private Double performanceImpact; 


    // Change from performanceRating to a list of performance reviews
    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY)
    private List<PerformanceReview> performanceReviews; // Store multiple performance reviews

    public Employee() {
    }

    public Employee(Long id, String name, String email, String phone, USER_ROLE role, Department department, List<Salary> salaries, Boolean isActive, String password, Double baseSalary, Double bonus, Double deduction, Double performanceRating, Double finalSalary, Double performanceImpact, List<PerformanceReview> performanceReviews) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.department = department;
        this.salaries = salaries;
        this.isActive = isActive;
        this.password = password;
        this.baseSalary = baseSalary;
        this.bonus = bonus;
        this.deduction = deduction;
        this.performanceRating = performanceRating;
        this.finalSalary = finalSalary;
        this.performanceImpact = performanceImpact;
        this.performanceReviews = performanceReviews;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public USER_ROLE getRole() { return role; }
    public void setRole(USER_ROLE role) { this.role = role; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public List<Salary> getSalaries() { return salaries; }
    public void setSalaries(List<Salary> salaries) { this.salaries = salaries; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Double getBaseSalary() { return baseSalary; }
    public void setBaseSalary(Double baseSalary) { this.baseSalary = baseSalary; }

    public Double getBonus() { return bonus; }
    public void setBonus(Double bonus) { this.bonus = bonus; }

    public Double getDeduction() { return deduction; }
    public void setDeduction(Double deduction) { this.deduction = deduction; }

    public Double getPerformanceRating() { return performanceRating; }
    // setPerformanceRating is already defined below

    public Double getFinalSalary() { return finalSalary; }
    // setFinalSalary is already defined below

    public List<PerformanceReview> getPerformanceReviews() { return performanceReviews; }
    public void setPerformanceReviews(List<PerformanceReview> performanceReviews) { this.performanceReviews = performanceReviews; }

    // Manual Builder
    public static EmployeeBuilder builder() {
        return new EmployeeBuilder();
    }

    public static class EmployeeBuilder {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private USER_ROLE role;
        private Department department;
        private List<Salary> salaries;
        private Boolean isActive;
        private String password;
        private Double baseSalary;
        private Double bonus;
        private Double deduction;
        private Double performanceRating;
        private Double finalSalary;
        private Double performanceImpact;
        private List<PerformanceReview> performanceReviews;

        EmployeeBuilder() { }

        public EmployeeBuilder id(Long id) { this.id = id; return this; }
        public EmployeeBuilder name(String name) { this.name = name; return this; }
        public EmployeeBuilder email(String email) { this.email = email; return this; }
        public EmployeeBuilder phone(String phone) { this.phone = phone; return this; }
        public EmployeeBuilder role(USER_ROLE role) { this.role = role; return this; }
        public EmployeeBuilder department(Department department) { this.department = department; return this; }
        public EmployeeBuilder salaries(List<Salary> salaries) { this.salaries = salaries; return this; }
        public EmployeeBuilder isActive(Boolean isActive) { this.isActive = isActive; return this; }
        public EmployeeBuilder password(String password) { this.password = password; return this; }
        public EmployeeBuilder baseSalary(Double baseSalary) { this.baseSalary = baseSalary; return this; }
        public EmployeeBuilder bonus(Double bonus) { this.bonus = bonus; return this; }
        public EmployeeBuilder deduction(Double deduction) { this.deduction = deduction; return this; }
        public EmployeeBuilder performanceRating(Double performanceRating) { this.performanceRating = performanceRating; return this; }
        public EmployeeBuilder finalSalary(Double finalSalary) { this.finalSalary = finalSalary; return this; }
        public EmployeeBuilder performanceImpact(Double performanceImpact) { this.performanceImpact = performanceImpact; return this; }
        public EmployeeBuilder performanceReviews(List<PerformanceReview> performanceReviews) { this.performanceReviews = performanceReviews; return this; }

        public Employee build() {
            return new Employee(id, name, email, phone, role, department, salaries, isActive, password, baseSalary, bonus, deduction, performanceRating, finalSalary, performanceImpact, performanceReviews);
        }
    }

    // Add method to get the latest performance review
    public PerformanceReview getLatestPerformanceReview() {
        if (performanceReviews != null && !performanceReviews.isEmpty()) {
            return performanceReviews.stream()
                    .max((r1, r2) -> r1.getReviewDate().compareTo(r2.getReviewDate()))
                    .orElse(null); // return null if no reviews are present
        }
        return null;
    }

    // Add method to get employee's name (for generating payslip filenames)
    public String getEmployeeName() {
        return this.name;  // Assuming 'name' is the field storing the employee's name
    }
    public void setPerformanceRating(Double performanceRating) {
        this.performanceRating = performanceRating;
    }
    public void setFinalSalary(Double finalSalary) {
        this.finalSalary = finalSalary;
    }

    

    // Getter and Setter for performanceImpact
    public Double getPerformanceImpact() {
        return performanceImpact; // Return calculated value or a fixed one
    }

    public void setPerformanceImpact(Double performanceImpact) {
        this.performanceImpact = performanceImpact;
    }

	@Override
	public String toString() {
		return "Employee [id=" + id + ", name=" + name + ", email=" + email + ", phone=" + phone + ", role=" + role
				+ ", department=" + department + ", salaries=" + salaries + ", isActive=" + isActive + ", password="
				+ password + ", baseSalary=" + baseSalary + ", bonus=" + bonus + ", deduction=" + deduction
				+ ", performanceRating=" + performanceRating + ", finalSalary=" + finalSalary + ", performanceImpact="
				+ performanceImpact + ", performanceReviews=" + performanceReviews + "]";
	}

}
