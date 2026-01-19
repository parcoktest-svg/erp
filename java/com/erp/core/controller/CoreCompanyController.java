package com.erp.core.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.core.dto.CompanyDto;
import com.erp.core.entity.Company;
import com.erp.core.service.CompanyService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/api/core/companies")
public class CoreCompanyController {

    private final CompanyService companyService;

    public CoreCompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    public ResponseEntity<List<CompanyDto>> list() {
        List<CompanyDto> result = companyService.findAll().stream().map(this::toDto).toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<CompanyDto> create(@Valid @RequestBody CreateCompanyRequest request) {
        Company company = new Company();
        company.setCode(request.getCode());
        company.setName(request.getName());
        company.setActive(true);
        Company saved = companyService.create(company);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    private CompanyDto toDto(Company company) {
        CompanyDto dto = new CompanyDto();
        dto.setId(company.getId());
        dto.setCode(company.getCode());
        dto.setName(company.getName());
        dto.setActive(company.isActive());
        return dto;
    }

    public static class CreateCompanyRequest {
        @NotBlank
        private String code;

        @NotBlank
        private String name;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
