package com.erp.dto;

public class EmployeeDto {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;

    private Long departmentId;         // Reference to Department
    private String departmentName;     // Useful for UI display

    private Double baseSalary;
    private Double bonus;
    private Double deduction;

    private String performanceRating;

    private Boolean active;

    private String password; // Consider excluding this field in responses

    public EmployeeDto() {
    }

    public EmployeeDto(Long id, String name, String email, String phone, String role, Long departmentId, String departmentName, Double baseSalary, Double bonus, Double deduction, String performanceRating, Boolean active, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.baseSalary = baseSalary;
        this.bonus = bonus;
        this.deduction = deduction;
        this.performanceRating = performanceRating;
        this.active = active;
        this.password = password;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public Double getBaseSalary() { return baseSalary; }
    public void setBaseSalary(Double baseSalary) { this.baseSalary = baseSalary; }
    public Double getBonus() { return bonus; }
    public void setBonus(Double bonus) { this.bonus = bonus; }
    public Double getDeduction() { return deduction; }
    public void setDeduction(Double deduction) { this.deduction = deduction; }
    public String getPerformanceRating() { return performanceRating; }
    public void setPerformanceRating(String performanceRating) { this.performanceRating = performanceRating; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    // Manual Builder
    public static EmployeeDtoBuilder builder() {
        return new EmployeeDtoBuilder();
    }

    public static class EmployeeDtoBuilder {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String role;
        private Long departmentId;
        private String departmentName;
        private Double baseSalary;
        private Double bonus;
        private Double deduction;
        private String performanceRating;
        private Boolean active;
        private String password;

        EmployeeDtoBuilder() { }

        public EmployeeDtoBuilder id(Long id) { this.id = id; return this; }
        public EmployeeDtoBuilder name(String name) { this.name = name; return this; }
        public EmployeeDtoBuilder email(String email) { this.email = email; return this; }
        public EmployeeDtoBuilder phone(String phone) { this.phone = phone; return this; }
        public EmployeeDtoBuilder role(String role) { this.role = role; return this; }
        public EmployeeDtoBuilder departmentId(Long departmentId) { this.departmentId = departmentId; return this; }
        public EmployeeDtoBuilder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public EmployeeDtoBuilder baseSalary(Double baseSalary) { this.baseSalary = baseSalary; return this; }
        public EmployeeDtoBuilder bonus(Double bonus) { this.bonus = bonus; return this; }
        public EmployeeDtoBuilder deduction(Double deduction) { this.deduction = deduction; return this; }
        public EmployeeDtoBuilder performanceRating(String performanceRating) { this.performanceRating = performanceRating; return this; }
        public EmployeeDtoBuilder active(Boolean active) { this.active = active; return this; }
        public EmployeeDtoBuilder password(String password) { this.password = password; return this; }

        public EmployeeDto build() {
            return new EmployeeDto(id, name, email, phone, role, departmentId, departmentName, baseSalary, bonus, deduction, performanceRating, active, password);
        }
    }
}
