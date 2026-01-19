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

import com.erp.masterdata.entity.Warehouse;
import com.erp.masterdata.service.WarehouseService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/api/masterdata/companies/{companyId}/warehouses")
public class MasterDataWarehouseController {

    private final WarehouseService warehouseService;

    public MasterDataWarehouseController(WarehouseService warehouseService) {
        this.warehouseService = warehouseService;
    }

    @GetMapping
    public ResponseEntity<List<Warehouse>> list(@PathVariable Long companyId) {
        return ResponseEntity.ok(warehouseService.listByCompany(companyId));
    }

    @PostMapping
    public ResponseEntity<Warehouse> create(@PathVariable Long companyId, @Valid @RequestBody CreateWarehouseRequest request) {
        Warehouse wh = new Warehouse();
        wh.setCode(request.getCode());
        wh.setName(request.getName());
        wh.setActive(true);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(warehouseService.create(companyId, request.getOrgId(), wh));
    }

    @PutMapping("/{warehouseId}")
    public ResponseEntity<Warehouse> update(@PathVariable Long companyId, @PathVariable Long warehouseId, @Valid @RequestBody UpdateWarehouseRequest request) {
        Warehouse patch = new Warehouse();
        patch.setCode(request.getCode());
        patch.setName(request.getName());
        patch.setActive(request.isActive());
        return ResponseEntity.ok(warehouseService.update(companyId, warehouseId, request.getOrgId(), patch));
    }

    @DeleteMapping("/{warehouseId}")
    public ResponseEntity<Void> delete(@PathVariable Long companyId, @PathVariable Long warehouseId) {
        warehouseService.delete(companyId, warehouseId);
        return ResponseEntity.noContent().build();
    }

    public static class CreateWarehouseRequest {
        @NotBlank
        private String code;

        @NotBlank
        private String name;

        private Long orgId;

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

        public Long getOrgId() {
            return orgId;
        }

        public void setOrgId(Long orgId) {
            this.orgId = orgId;
        }
    }

    public static class UpdateWarehouseRequest {
        @NotBlank
        private String code;

        @NotBlank
        private String name;

        private Long orgId;

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

        public Long getOrgId() {
            return orgId;
        }

        public void setOrgId(Long orgId) {
            this.orgId = orgId;
        }

        public boolean isActive() {
            return active;
        }

        public void setActive(boolean active) {
            this.active = active;
        }
    }
}
