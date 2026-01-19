package com.erp.masterdata.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.masterdata.entity.BusinessPartner;
import com.erp.masterdata.model.BusinessPartnerType;
import com.erp.masterdata.service.BusinessPartnerService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/api/masterdata/companies/{companyId}/business-partners")
public class MasterDataBusinessPartnerController {

    private final BusinessPartnerService businessPartnerService;

    public MasterDataBusinessPartnerController(BusinessPartnerService businessPartnerService) {
        this.businessPartnerService = businessPartnerService;
    }

    @GetMapping
    public ResponseEntity<List<BusinessPartner>> list(@PathVariable Long companyId) {
        return ResponseEntity.ok(businessPartnerService.listByCompany(companyId));
    }

    @PostMapping
    public ResponseEntity<BusinessPartner> create(@PathVariable Long companyId, @Valid @RequestBody CreateBusinessPartnerRequest request) {
        BusinessPartner bp = new BusinessPartner();
        bp.setName(request.getName());
        bp.setEmail(request.getEmail());
        bp.setPhone(request.getPhone());
        bp.setType(request.getType());
        bp.setActive(true);

        return ResponseEntity.status(HttpStatus.CREATED).body(businessPartnerService.create(companyId, bp));
    }

    @PutMapping("/{businessPartnerId}")
    public ResponseEntity<BusinessPartner> update(
            @PathVariable Long companyId,
            @PathVariable Long businessPartnerId,
            @Valid @RequestBody UpdateBusinessPartnerRequest request) {
        BusinessPartner patch = new BusinessPartner();
        patch.setName(request.getName());
        patch.setEmail(request.getEmail());
        patch.setPhone(request.getPhone());
        patch.setType(request.getType());
        patch.setActive(request.isActive());
        return ResponseEntity.ok(businessPartnerService.update(companyId, businessPartnerId, patch));
    }

    @DeleteMapping("/{businessPartnerId}")
    public ResponseEntity<Void> delete(@PathVariable Long companyId, @PathVariable Long businessPartnerId) {
        businessPartnerService.delete(companyId, businessPartnerId);
        return ResponseEntity.noContent().build();
    }

    public static class CreateBusinessPartnerRequest {
        @NotBlank
        private String name;

        private String email;
        private String phone;

        @NotNull
        private BusinessPartnerType type;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public BusinessPartnerType getType() {
            return type;
        }

        public void setType(BusinessPartnerType type) {
            this.type = type;
        }
    }

    public static class UpdateBusinessPartnerRequest {
        @NotBlank
        private String name;

        private String email;
        private String phone;

        @NotNull
        private BusinessPartnerType type;

        private boolean active = true;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public BusinessPartnerType getType() {
            return type;
        }

        public void setType(BusinessPartnerType type) {
            this.type = type;
        }

        public boolean isActive() {
            return active;
        }

        public void setActive(boolean active) {
            this.active = active;
        }
    }
}
