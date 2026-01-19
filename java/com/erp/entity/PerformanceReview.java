package com.erp.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "performance_reviews")
public class PerformanceReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonIgnore 
    private Employee employee;

    private LocalDate reviewDate;

    @Column(nullable = false)
    private String performanceRating; // e.g., "Excellent", "Good", etc.

    @Lob
    private String comments;
    
    public PerformanceReview() {
    }

    public PerformanceReview(Long id, Employee employee, LocalDate reviewDate, String performanceRating, String comments) {
        this.id = id;
        this.employee = employee;
        this.reviewDate = reviewDate;
        this.performanceRating = performanceRating;
        this.comments = comments;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
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

    // Manual Builder Implementation
    public static PerformanceReviewBuilder builder() {
        return new PerformanceReviewBuilder();
    }

    public static class PerformanceReviewBuilder {
        private Long id;
        private Employee employee;
        private LocalDate reviewDate;
        private String performanceRating;
        private String comments;

        PerformanceReviewBuilder() {
        }

        public PerformanceReviewBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PerformanceReviewBuilder employee(Employee employee) {
            this.employee = employee;
            return this;
        }

        public PerformanceReviewBuilder reviewDate(LocalDate reviewDate) {
            this.reviewDate = reviewDate;
            return this;
        }

        public PerformanceReviewBuilder performanceRating(String performanceRating) {
            this.performanceRating = performanceRating;
            return this;
        }

        public PerformanceReviewBuilder comments(String comments) {
            this.comments = comments;
            return this;
        }

        public PerformanceReview build() {
            return new PerformanceReview(id, employee, reviewDate, performanceRating, comments);
        }
    }
}
