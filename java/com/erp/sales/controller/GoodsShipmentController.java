package com.erp.sales.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.inventory.entity.InventoryMovement;
import com.erp.inventory.request.CreateGoodsShipmentRequest;
import com.erp.inventory.service.OrderFulfillmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/sales/companies/{companyId}/sales-orders/{salesOrderId}/goods-shipments")
public class GoodsShipmentController {

    private final OrderFulfillmentService orderFulfillmentService;

    public GoodsShipmentController(OrderFulfillmentService orderFulfillmentService) {
        this.orderFulfillmentService = orderFulfillmentService;
    }

    @PostMapping
    public ResponseEntity<InventoryMovement> create(
            @PathVariable Long companyId,
            @PathVariable Long salesOrderId,
            @Valid @RequestBody CreateGoodsShipmentRequest request) {

        InventoryMovement movement = orderFulfillmentService.goodsShipmentFromSalesOrder(companyId, salesOrderId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(movement);
    }
}
