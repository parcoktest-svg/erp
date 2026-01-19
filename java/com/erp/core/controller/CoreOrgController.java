package com.erp.core.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.core.dto.OrgDto;
import com.erp.core.entity.Org;
import com.erp.core.service.OrgService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/api/core/companies/{companyId}/orgs")
public class CoreOrgController {

    private final OrgService orgService;

    public CoreOrgController(OrgService orgService) {
        this.orgService = orgService;
    }

    @GetMapping
    public ResponseEntity<List<OrgDto>> list(@PathVariable Long companyId) {
        List<OrgDto> result = orgService.findByCompany(companyId).stream().map(this::toDto).toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<OrgDto> create(@PathVariable Long companyId, @Valid @RequestBody CreateOrgRequest request) {
        Org org = new Org();
        org.setCode(request.getCode());
        org.setName(request.getName());
        org.setActive(true);
        Org saved = orgService.create(companyId, org);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    private OrgDto toDto(Org org) {
        OrgDto dto = new OrgDto();
        dto.setId(org.getId());
        dto.setCompanyId(org.getCompany() != null ? org.getCompany().getId() : null);
        dto.setCode(org.getCode());
        dto.setName(org.getName());
        dto.setActive(org.isActive());
        return dto;
    }

    public static class CreateOrgRequest {
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
