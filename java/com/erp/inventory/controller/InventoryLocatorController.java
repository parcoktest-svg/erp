package com.erp.inventory.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.erp.inventory.entity.Locator;
import com.erp.inventory.request.CreateLocatorRequest;
import com.erp.inventory.service.InventoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/inventory/companies/{companyId}/locators")
public class InventoryLocatorController {

    private final InventoryService inventoryService;

    public InventoryLocatorController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<Locator>> list(@PathVariable Long companyId, @RequestParam(required = false) Long warehouseId) {
        if (warehouseId != null) {
            return ResponseEntity.ok(inventoryService.listLocatorsByWarehouse(warehouseId));
        }
        return ResponseEntity.ok(inventoryService.listLocatorsByCompany(companyId));
    }

    @PostMapping
    public ResponseEntity<Locator> create(@PathVariable Long companyId, @Valid @RequestBody CreateLocatorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryService.createLocator(companyId, request));
    }
}
