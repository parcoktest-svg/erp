package com.erp.inventory.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.inventory.entity.InventoryMovement;
import com.erp.inventory.request.CreateInventoryMovementRequest;
import com.erp.inventory.service.InventoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/inventory/companies/{companyId}/movements")
public class InventoryMovementController {

    private final InventoryService inventoryService;

    public InventoryMovementController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<InventoryMovement>> list(@PathVariable Long companyId) {
        return ResponseEntity.ok(inventoryService.listMovementsByCompany(companyId));
    }

    @PostMapping
    public ResponseEntity<InventoryMovement> create(@PathVariable Long companyId, @Valid @RequestBody CreateInventoryMovementRequest request) {
        InventoryMovement saved = inventoryService.createMovement(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
