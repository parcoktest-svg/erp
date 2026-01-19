package com.erp.finance.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.finance.dto.GlAccountDto;
import com.erp.finance.entity.GlAccount;
import com.erp.finance.request.CreateGlAccountRequest;
import com.erp.finance.service.GlAccountService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/finance/companies/{companyId}/gl-accounts")
public class GlAccountController {

    private final GlAccountService glAccountService;

    public GlAccountController(GlAccountService glAccountService) {
        this.glAccountService = glAccountService;
    }

    @GetMapping
    public ResponseEntity<List<GlAccountDto>> list(@PathVariable Long companyId) {
        return ResponseEntity.ok(glAccountService.listByCompany(companyId).stream().map(this::toDto).toList());
    }

    @PostMapping
    public ResponseEntity<GlAccountDto> create(@PathVariable Long companyId, @Valid @RequestBody CreateGlAccountRequest request) {
        GlAccount saved = glAccountService.create(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    @PostMapping("/seed-defaults")
    public ResponseEntity<Void> seedDefaults(@PathVariable Long companyId) {
        glAccountService.seedDefaults(companyId);
        return ResponseEntity.ok().build();
    }

    private GlAccountDto toDto(GlAccount a) {
        GlAccountDto dto = new GlAccountDto();
        dto.setId(a.getId());
        dto.setCompanyId(a.getCompany() != null ? a.getCompany().getId() : null);
        dto.setCode(a.getCode());
        dto.setName(a.getName());
        dto.setType(a.getType());
        dto.setActive(a.isActive());
        return dto;
    }
}
