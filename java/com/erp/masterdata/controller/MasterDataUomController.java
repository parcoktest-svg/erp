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

import com.erp.masterdata.entity.Uom;
import com.erp.masterdata.service.UomService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/api/masterdata/companies/{companyId}/uoms")
public class MasterDataUomController {

    private final UomService uomService;

    public MasterDataUomController(UomService uomService) {
        this.uomService = uomService;
    }

    @GetMapping
    public ResponseEntity<List<Uom>> list(@PathVariable Long companyId) {
        return ResponseEntity.ok(uomService.listByCompany(companyId));
    }

    @PostMapping
    public ResponseEntity<Uom> create(@PathVariable Long companyId, @Valid @RequestBody CreateUomRequest request) {
        Uom uom = new Uom();
        uom.setCode(request.getCode());
        uom.setName(request.getName());
        uom.setActive(true);

        return ResponseEntity.status(HttpStatus.CREATED).body(uomService.create(companyId, uom));
    }

    @PutMapping("/{uomId}")
    public ResponseEntity<Uom> update(@PathVariable Long companyId, @PathVariable Long uomId, @Valid @RequestBody UpdateUomRequest request) {
        Uom patch = new Uom();
        patch.setCode(request.getCode());
        patch.setName(request.getName());
        patch.setActive(request.isActive());
        return ResponseEntity.ok(uomService.update(companyId, uomId, patch));
    }

    @DeleteMapping("/{uomId}")
    public ResponseEntity<Void> delete(@PathVariable Long companyId, @PathVariable Long uomId) {
        uomService.delete(companyId, uomId);
        return ResponseEntity.noContent().build();
    }

    public static class CreateUomRequest {
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

    public static class UpdateUomRequest {
        @NotBlank
        private String code;

        @NotBlank
        private String name;

        private boolean active = true;

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

        public boolean isActive() {
            return active;
        }

        public void setActive(boolean active) {
            this.active = active;
        }
    }
}
