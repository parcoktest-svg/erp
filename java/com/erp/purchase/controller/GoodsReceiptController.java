package com.erp.purchase.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.inventory.entity.InventoryMovement;
import com.erp.inventory.request.CreateGoodsReceiptRequest;
import com.erp.inventory.service.OrderFulfillmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/purchase/companies/{companyId}/purchase-orders/{purchaseOrderId}/goods-receipts")
public class GoodsReceiptController {

    private final OrderFulfillmentService orderFulfillmentService;

    public GoodsReceiptController(OrderFulfillmentService orderFulfillmentService) {
        this.orderFulfillmentService = orderFulfillmentService;
    }

    @PostMapping
    public ResponseEntity<InventoryMovement> create(
            @PathVariable Long companyId,
            @PathVariable Long purchaseOrderId,
            @Valid @RequestBody CreateGoodsReceiptRequest request) {

        InventoryMovement movement = orderFulfillmentService.goodsReceiptFromPurchaseOrder(companyId, purchaseOrderId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(movement);
    }
}
