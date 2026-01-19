package com.erp.dto;

import java.time.LocalDate;

public class PerformanceReviewDto {

    private Long id;
    private Long employeeId;
    private LocalDate reviewDate;
    private String performanceRating;
    private String comments;
    
    // Newly added fields
    private Double bonusAmount;
    private Double performanceImpact;
    private Double finalSalary;

    public PerformanceReviewDto() {
    }

    public PerformanceReviewDto(Long id, Long employeeId, LocalDate reviewDate, String performanceRating, String comments, Double bonusAmount, Double performanceImpact, Double finalSalary) {
        this.id = id;
        this.employeeId = employeeId;
        this.reviewDate = reviewDate;
        this.performanceRating = performanceRating;
        this.comments = comments;
        this.bonusAmount = bonusAmount;
        this.performanceImpact = performanceImpact;
        this.finalSalary = finalSalary;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public LocalDate getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(LocalDate reviewDate) {
        this.reviewDate = reviewDate;
    }

    public String getPerformanceRating() {
        return performanceRating;
    }

    public void setPerformanceRating(String performanceRating) {
        this.performanceRating = performanceRating;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public Double getBonusAmount() {
        return bonusAmount;
    }

    public void setBonusAmount(Double bonusAmount) {
        this.bonusAmount = bonusAmount;
    }

    public Double getPerformanceImpact() {
        return performanceImpact;
    }

    public void setPerformanceImpact(Double performanceImpact) {
        this.performanceImpact = performanceImpact;
    }

    public Double getFinalSalary() {
        return finalSalary;
    }

    public void setFinalSalary(Double finalSalary) {
        this.finalSalary = finalSalary;
    }

    // Manual Builder
    public static PerformanceReviewDtoBuilder builder() {
        return new PerformanceReviewDtoBuilder();
    }

    public static class PerformanceReviewDtoBuilder {
        private Long id;
        private Long employeeId;
        private LocalDate reviewDate;
        private String performanceRating;
        private String comments;
        private Double bonusAmount;
        private Double performanceImpact;
        private Double finalSalary;

        PerformanceReviewDtoBuilder() { }

        public PerformanceReviewDtoBuilder id(Long id) { this.id = id; return this; }
        public PerformanceReviewDtoBuilder employeeId(Long employeeId) { this.employeeId = employeeId; return this; }
        public PerformanceReviewDtoBuilder reviewDate(LocalDate reviewDate) { this.reviewDate = reviewDate; return this; }
        public PerformanceReviewDtoBuilder performanceRating(String performanceRating) { this.performanceRating = performanceRating; return this; }
        public PerformanceReviewDtoBuilder comments(String comments) { this.comments = comments; return this; }
        public PerformanceReviewDtoBuilder bonusAmount(Double bonusAmount) { this.bonusAmount = bonusAmount; return this; }
        public PerformanceReviewDtoBuilder performanceImpact(Double performanceImpact) { this.performanceImpact = performanceImpact; return this; }
        public PerformanceReviewDtoBuilder finalSalary(Double finalSalary) { this.finalSalary = finalSalary; return this; }

        public PerformanceReviewDto build() {
            return new PerformanceReviewDto(id, employeeId, reviewDate, performanceRating, comments, bonusAmount, performanceImpact, finalSalary);
        }
    }
}
