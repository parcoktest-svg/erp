package com.erp.inventory.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.erp.inventory.dto.OnHandByProductRow;
import com.erp.inventory.dto.OnHandResponse;
import com.erp.inventory.service.InventoryService;

@RestController
@RequestMapping("/api/inventory/companies/{companyId}/onhand")
public class InventoryOnHandController {

    private final InventoryService inventoryService;

    public InventoryOnHandController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<OnHandResponse> getOnHand(
            @PathVariable Long companyId,
            @RequestParam Long locatorId,
            @RequestParam Long productId) {

        BigDecimal qty = inventoryService.getOnHandQty(locatorId, productId);
        return ResponseEntity.ok(new OnHandResponse(locatorId, productId, qty));
    }

    @GetMapping("/by-locator")
    public ResponseEntity<List<OnHandByProductRow>> getOnHandByLocator(
            @PathVariable Long companyId,
            @RequestParam Long locatorId) {
        return ResponseEntity.ok(inventoryService.getOnHandByLocator(companyId, locatorId));
    }
}
