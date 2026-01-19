package com.erp.inventory.controller;

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

import com.erp.inventory.dto.InventoryAdjustmentDto;
import com.erp.inventory.entity.InventoryAdjustment;
import com.erp.inventory.request.CreateInventoryAdjustmentRequest;
import com.erp.inventory.request.UpdateInventoryAdjustmentRequest;
import com.erp.inventory.service.InventoryAdjustmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/inventory/companies/{companyId}/adjustments")
public class InventoryAdjustmentController {

    private final InventoryAdjustmentService inventoryAdjustmentService;

    public InventoryAdjustmentController(InventoryAdjustmentService inventoryAdjustmentService) {
        this.inventoryAdjustmentService = inventoryAdjustmentService;
    }

    @GetMapping
    public ResponseEntity<List<InventoryAdjustmentDto>> list(@PathVariable Long companyId) {
        List<InventoryAdjustmentDto> result = inventoryAdjustmentService.listByCompany(companyId).stream().map(this::toDto).toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<InventoryAdjustmentDto> create(@PathVariable Long companyId, @Valid @RequestBody CreateInventoryAdjustmentRequest request) {
        InventoryAdjustment saved = inventoryAdjustmentService.create(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    @PutMapping("/{adjustmentId}")
    public ResponseEntity<InventoryAdjustmentDto> update(
            @PathVariable Long companyId,
            @PathVariable Long adjustmentId,
            @Valid @RequestBody UpdateInventoryAdjustmentRequest request) {
        InventoryAdjustment updated = inventoryAdjustmentService.update(companyId, adjustmentId, request);
        return ResponseEntity.ok(toDto(updated));
    }

    @DeleteMapping("/{adjustmentId}")
    public ResponseEntity<Void> delete(@PathVariable Long companyId, @PathVariable Long adjustmentId) {
        inventoryAdjustmentService.delete(companyId, adjustmentId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{adjustmentId}/complete")
    public ResponseEntity<InventoryAdjustmentDto> complete(@PathVariable Long companyId, @PathVariable Long adjustmentId) {
        InventoryAdjustment updated = inventoryAdjustmentService.complete(companyId, adjustmentId);
        return ResponseEntity.ok(toDto(updated));
    }

    @PostMapping("/{adjustmentId}/void")
    public ResponseEntity<InventoryAdjustmentDto> voidAdjustment(@PathVariable Long companyId, @PathVariable Long adjustmentId) {
        InventoryAdjustment updated = inventoryAdjustmentService.voidAdjustment(companyId, adjustmentId);
        return ResponseEntity.ok(toDto(updated));
    }

    private InventoryAdjustmentDto toDto(InventoryAdjustment adj) {
        InventoryAdjustmentDto dto = new InventoryAdjustmentDto();
        dto.setId(adj.getId());
        dto.setCompanyId(adj.getCompany() != null ? adj.getCompany().getId() : null);
        dto.setOrgId(adj.getOrg() != null ? adj.getOrg().getId() : null);
        dto.setDocumentNo(adj.getDocumentNo());
        dto.setAdjustmentDate(adj.getAdjustmentDate());
        dto.setDescription(adj.getDescription());
        dto.setStatus(adj.getStatus());
        dto.setJournalEntryId(adj.getJournalEntry() != null ? adj.getJournalEntry().getId() : null);
        dto.setLines(adj.getLines() != null ? adj.getLines().stream().map(this::toLineDto).toList() : List.of());
        return dto;
    }

    private com.erp.inventory.dto.InventoryAdjustmentLineDto toLineDto(com.erp.inventory.entity.InventoryAdjustmentLine line) {
        com.erp.inventory.dto.InventoryAdjustmentLineDto dto = new com.erp.inventory.dto.InventoryAdjustmentLineDto();
        dto.setId(line.getId());
        dto.setProductId(line.getProduct() != null ? line.getProduct().getId() : null);
        dto.setProductCode(line.getProduct() != null ? line.getProduct().getCode() : null);
        dto.setProductName(line.getProduct() != null ? line.getProduct().getName() : null);
        dto.setLocatorId(line.getLocator() != null ? line.getLocator().getId() : null);
        dto.setLocatorCode(line.getLocator() != null ? line.getLocator().getCode() : null);
        dto.setLocatorName(line.getLocator() != null ? line.getLocator().getName() : null);
        dto.setQuantityOnHandBefore(line.getQuantityOnHandBefore());
        dto.setQuantityAdjusted(line.getQuantityAdjusted());
        dto.setQuantityOnHandAfter(line.getQuantityOnHandAfter());
        dto.setAdjustmentAmount(line.getAdjustmentAmount());
        dto.setNotes(line.getNotes());
        return dto;
    }
}
