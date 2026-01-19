package com.erp.manufacturing.controller;

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

import com.erp.manufacturing.dto.BomDto;
import com.erp.manufacturing.dto.BomLineDto;
import com.erp.manufacturing.entity.Bom;
import com.erp.manufacturing.entity.BomLine;
import com.erp.manufacturing.request.CreateBomRequest;
import com.erp.manufacturing.request.UpdateBomRequest;
import com.erp.manufacturing.service.BomService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/manufacturing/companies/{companyId}/boms")
public class BomController {

    private final BomService bomService;

    public BomController(BomService bomService) {
        this.bomService = bomService;
    }

    @GetMapping
    public ResponseEntity<List<BomDto>> list(@PathVariable Long companyId) {
        List<BomDto> result = bomService.listByCompany(companyId).stream().map(this::toDto).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{bomId}")
    public ResponseEntity<BomDto> get(@PathVariable Long companyId, @PathVariable Long bomId) {
        return ResponseEntity.ok(toDto(bomService.get(companyId, bomId)));
    }

    @PostMapping
    public ResponseEntity<BomDto> create(@PathVariable Long companyId, @Valid @RequestBody CreateBomRequest request) {
        Bom saved = bomService.create(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    @PutMapping("/{bomId}")
    public ResponseEntity<BomDto> update(@PathVariable Long companyId, @PathVariable Long bomId, @Valid @RequestBody UpdateBomRequest request) {
        Bom updated = bomService.update(companyId, bomId, request);
        return ResponseEntity.ok(toDto(updated));
    }

    @DeleteMapping("/{bomId}")
    public ResponseEntity<Void> delete(@PathVariable Long companyId, @PathVariable Long bomId) {
        bomService.delete(companyId, bomId);
        return ResponseEntity.noContent().build();
    }

    private BomDto toDto(Bom bom) {
        BomDto dto = new BomDto();
        dto.setId(bom.getId());
        dto.setCompanyId(bom.getCompany() != null ? bom.getCompany().getId() : null);
        dto.setOrgId(bom.getOrg() != null ? bom.getOrg().getId() : null);
        dto.setProductId(bom.getProduct() != null ? bom.getProduct().getId() : null);
        dto.setVersion(bom.getVersion());
        dto.setActive(bom.isActive());
        dto.setLines(bom.getLines() != null ? bom.getLines().stream().map(this::toLineDto).toList() : List.of());
        return dto;
    }

    private BomLineDto toLineDto(BomLine line) {
        BomLineDto dto = new BomLineDto();
        dto.setId(line.getId());
        dto.setComponentProductId(line.getComponentProduct() != null ? line.getComponentProduct().getId() : null);
        dto.setQty(line.getQty());
        return dto;
    }
}
