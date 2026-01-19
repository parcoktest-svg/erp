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

import com.erp.manufacturing.dto.WorkOrderDto;
import com.erp.manufacturing.entity.WorkOrder;
import com.erp.manufacturing.request.CompleteWorkOrderRequest;
import com.erp.manufacturing.request.CreateWorkOrderRequest;
import com.erp.manufacturing.request.UpdateWorkOrderRequest;
import com.erp.manufacturing.request.VoidWorkOrderRequest;
import com.erp.manufacturing.service.WorkOrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/manufacturing/companies/{companyId}/work-orders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

    @GetMapping
    public ResponseEntity<List<WorkOrderDto>> list(@PathVariable Long companyId) {
        return ResponseEntity.ok(workOrderService.listByCompany(companyId).stream().map(this::toDto).toList());
    }

    @GetMapping("/{workOrderId}")
    public ResponseEntity<WorkOrderDto> get(@PathVariable Long companyId, @PathVariable Long workOrderId) {
        return ResponseEntity.ok(toDto(workOrderService.get(companyId, workOrderId)));
    }

    @PostMapping
    public ResponseEntity<WorkOrderDto> create(@PathVariable Long companyId, @Valid @RequestBody CreateWorkOrderRequest request) {
        WorkOrder saved = workOrderService.create(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    @PutMapping("/{workOrderId}")
    public ResponseEntity<WorkOrderDto> update(
            @PathVariable Long companyId,
            @PathVariable Long workOrderId,
            @Valid @RequestBody UpdateWorkOrderRequest request) {
        WorkOrder updated = workOrderService.update(companyId, workOrderId, request);
        return ResponseEntity.ok(toDto(updated));
    }

    @DeleteMapping("/{workOrderId}")
    public ResponseEntity<Void> delete(@PathVariable Long companyId, @PathVariable Long workOrderId) {
        workOrderService.delete(companyId, workOrderId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{workOrderId}/complete")
    public ResponseEntity<WorkOrderDto> complete(
            @PathVariable Long companyId,
            @PathVariable Long workOrderId,
            @Valid @RequestBody CompleteWorkOrderRequest request) {
        WorkOrder saved = workOrderService.complete(companyId, workOrderId, request);
        return ResponseEntity.ok(toDto(saved));
    }

    @PostMapping("/{workOrderId}/void")
    public ResponseEntity<WorkOrderDto> voidWorkOrder(
            @PathVariable Long companyId,
            @PathVariable Long workOrderId,
            @Valid @RequestBody VoidWorkOrderRequest request) {
        WorkOrder saved = workOrderService.voidWorkOrder(companyId, workOrderId, request);
        return ResponseEntity.ok(toDto(saved));
    }

    private WorkOrderDto toDto(WorkOrder wo) {
        WorkOrderDto dto = new WorkOrderDto();
        dto.setId(wo.getId());
        dto.setCompanyId(wo.getCompany() != null ? wo.getCompany().getId() : null);
        dto.setOrgId(wo.getOrg() != null ? wo.getOrg().getId() : null);
        dto.setDocumentNo(wo.getDocumentNo());
        dto.setStatus(wo.getStatus());
        dto.setWorkDate(wo.getWorkDate());
        dto.setBomId(wo.getBom() != null ? wo.getBom().getId() : null);
        dto.setProductId(wo.getProduct() != null ? wo.getProduct().getId() : null);
        dto.setQty(wo.getQty());
        dto.setFromLocatorId(wo.getFromLocator() != null ? wo.getFromLocator().getId() : null);
        dto.setToLocatorId(wo.getToLocator() != null ? wo.getToLocator().getId() : null);
        dto.setDescription(wo.getDescription());
        dto.setIssueMovementDocNo(wo.getIssueMovementDocNo());
        dto.setReceiptMovementDocNo(wo.getReceiptMovementDocNo());
        dto.setIssueReversalMovementDocNo(wo.getIssueReversalMovementDocNo());
        dto.setReceiptReversalMovementDocNo(wo.getReceiptReversalMovementDocNo());
        return dto;
    }
}
