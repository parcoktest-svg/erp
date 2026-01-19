package com.erp.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;

@Entity
@Table(name = "departments")
public class Department {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @Column(nullable = false)
	    private String name;

	    @OneToMany(mappedBy = "department")
	    @JsonManagedReference
	    private List<Employee> employees;
	    
        public Department() {
        }

        public Department(Long id, String name, List<Employee> employees) {
            this.id = id;
            this.name = name;
            this.employees = employees;
        }

	    // Add this constructor to accept departmentId
	    public Department(Long id) {
	        this.id = id;
	    }
    
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public List<Employee> getEmployees() {
            return employees;
        }

        public void setEmployees(List<Employee> employees) {
            this.employees = employees;
        }

        @Override
        public String toString() {
            return "Department{" +
                    "id=" + id +
                    ", name='" + name + '\'' +
                    '}';
        }
}
