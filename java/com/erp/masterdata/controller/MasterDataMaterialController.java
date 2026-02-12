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

import com.erp.masterdata.entity.Material;
import com.erp.masterdata.service.MaterialService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/api/masterdata/companies/{companyId}/materials")
public class MasterDataMaterialController {

    private final MaterialService materialService;

    public MasterDataMaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @GetMapping
    public ResponseEntity<List<Material>> list(@PathVariable Long companyId) {
        return ResponseEntity.ok(materialService.listByCompany(companyId));
    }

    @PostMapping
    public ResponseEntity<Material> create(@PathVariable Long companyId, @Valid @RequestBody CreateMaterialRequest request) {
        Material m = new Material();
        m.setCode(request.getCode());
        m.setName(request.getName());
        m.setActive(true);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(materialService.create(companyId, request.getUomId(), m));
    }

    @PutMapping("/{materialId}")
    public ResponseEntity<Material> update(@PathVariable Long companyId, @PathVariable Long materialId, @Valid @RequestBody UpdateMaterialRequest request) {
        Material patch = new Material();
        patch.setCode(request.getCode());
        patch.setName(request.getName());
        patch.setActive(request.isActive());
        return ResponseEntity.ok(materialService.update(companyId, materialId, request.getUomId(), patch));
    }

    @DeleteMapping("/{materialId}")
    public ResponseEntity<Void> delete(@PathVariable Long companyId, @PathVariable Long materialId) {
        materialService.delete(companyId, materialId);
        return ResponseEntity.noContent().build();
    }

    public static class CreateMaterialRequest {
        @NotBlank
        private String code;

        @NotBlank
        private String name;

        @NotNull
        private Long uomId;

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

        public Long getUomId() {
            return uomId;
        }

        public void setUomId(Long uomId) {
            this.uomId = uomId;
        }
    }

    public static class UpdateMaterialRequest {
        @NotBlank
        private String code;

        @NotBlank
        private String name;

        @NotNull
        private Long uomId;

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

        public Long getUomId() {
            return uomId;
        }

        public void setUomId(Long uomId) {
            this.uomId = uomId;
        }

        public boolean isActive() {
            return active;
        }

        public void setActive(boolean active) {
            this.active = active;
        }
    }
}
