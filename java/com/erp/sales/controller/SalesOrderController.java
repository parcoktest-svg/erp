package com.erp.sales.controller;

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

import com.erp.sales.dto.SalesOrderDeliveryScheduleDto;
import com.erp.sales.dto.SalesOrderDto;
import com.erp.sales.dto.SalesOrderLineDto;
import com.erp.sales.entity.SalesOrder;
import com.erp.sales.entity.SalesOrderDeliverySchedule;
import com.erp.sales.entity.SalesOrderLine;
import com.erp.sales.model.SalesOrderType;
import com.erp.sales.request.CreateSalesOrderRequest;
import com.erp.sales.request.UpdateSalesOrderRequest;
import com.erp.sales.service.SalesOrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/sales/companies/{companyId}/sales-orders")
public class SalesOrderController {

    private final SalesOrderService salesOrderService;

    public SalesOrderController(SalesOrderService salesOrderService) {
        this.salesOrderService = salesOrderService;
    }

    @GetMapping
    public ResponseEntity<List<SalesOrderDto>> list(@PathVariable Long companyId) {
        List<SalesOrderDto> result = salesOrderService.listByCompany(companyId).stream().map(this::toDto).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{salesOrderId}")
    public ResponseEntity<SalesOrderDto> get(@PathVariable Long companyId, @PathVariable Long salesOrderId) {
        SalesOrder so = salesOrderService.getById(companyId, salesOrderId);
        return ResponseEntity.ok(toDto(so));
    }

    @PostMapping
    public ResponseEntity<SalesOrderDto> create(@PathVariable Long companyId, @Valid @RequestBody CreateSalesOrderRequest request) {
        SalesOrder saved = salesOrderService.create(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    @PutMapping("/{salesOrderId}")
    public ResponseEntity<SalesOrderDto> update(
            @PathVariable Long companyId,
            @PathVariable Long salesOrderId,
            @Valid @RequestBody UpdateSalesOrderRequest request) {
        SalesOrder saved = salesOrderService.update(companyId, salesOrderId, request);
        return ResponseEntity.ok(toDto(saved));
    }

    @DeleteMapping("/{salesOrderId}")
    public ResponseEntity<Void> delete(@PathVariable Long companyId, @PathVariable Long salesOrderId) {
        salesOrderService.delete(companyId, salesOrderId);
        return ResponseEntity.noContent().build();
    }

    private SalesOrderDto toDto(SalesOrder so) {
        SalesOrderDto dto = new SalesOrderDto();
        dto.setId(so.getId());
        dto.setCompanyId(so.getCompany() != null ? so.getCompany().getId() : null);
        dto.setOrgId(so.getOrg() != null ? so.getOrg().getId() : null);
        dto.setBusinessPartnerId(so.getBusinessPartner() != null ? so.getBusinessPartner().getId() : null);
        dto.setPriceListVersionId(so.getPriceListVersion() != null ? so.getPriceListVersion().getId() : null);
        dto.setOrderType(so.getOrderType() != null ? so.getOrderType() : SalesOrderType.DOMESTIC);
        dto.setBuyerPo(so.getBuyerPo());
        dto.setDepartmentId(so.getDepartment() != null ? so.getDepartment().getId() : null);
        dto.setEmployeeId(so.getEmployee() != null ? so.getEmployee().getId() : null);
        dto.setInCharge(so.getInCharge());
        dto.setPaymentCondition(so.getPaymentCondition());
        dto.setDeliveryPlace(so.getDeliveryPlace());
        dto.setForwardingWarehouseId(so.getForwardingWarehouse() != null ? so.getForwardingWarehouse().getId() : null);
        dto.setCurrencyId(so.getCurrency() != null ? so.getCurrency().getId() : null);
        dto.setExchangeRate(so.getExchangeRate());
        dto.setForeignAmount(so.getForeignAmount());
        dto.setMemo(so.getMemo());
        dto.setDocumentNo(so.getDocumentNo());
        dto.setStatus(so.getStatus());
        dto.setOrderDate(so.getOrderDate());
        dto.setTotalNet(so.getTotalNet());
        dto.setTotalTax(so.getTotalTax());
        dto.setGrandTotal(so.getGrandTotal());
        dto.setLines(so.getLines() != null ? so.getLines().stream().map(this::toLineDto).toList() : List.of());
        dto.setDeliverySchedules(so.getDeliverySchedules() != null ? so.getDeliverySchedules().stream().map(this::toScheduleDto).toList() : List.of());
        return dto;
    }

    private SalesOrderLineDto toLineDto(SalesOrderLine line) {
        SalesOrderLineDto dto = new SalesOrderLineDto();
        dto.setId(line.getId());
        dto.setProductId(line.getProduct() != null ? line.getProduct().getId() : null);
        dto.setUomId(line.getUom() != null ? line.getUom().getId() : null);
        dto.setQty(line.getQty());
        dto.setPrice(line.getPrice());
        dto.setLineNet(line.getLineNet());
        dto.setShippedQty(line.getShippedQty());
        dto.setDescription(line.getDescription());
        dto.setUnit(line.getUnit());
        dto.setSize(line.getSize());
        dto.setNationalSize(line.getNationalSize());
        dto.setStyle(line.getStyle());
        dto.setCuttingNo(line.getCuttingNo());
        dto.setColor(line.getColor());
        dto.setDestination(line.getDestination());
        dto.setSupplyAmount(line.getSupplyAmount());
        dto.setVatAmount(line.getVatAmount());
        dto.setFobPrice(line.getFobPrice());
        dto.setLdpPrice(line.getLdpPrice());
        dto.setDpPrice(line.getDpPrice());
        dto.setCmtCost(line.getCmtCost());
        dto.setCmCost(line.getCmCost());
        dto.setFabricEta(line.getFabricEta());
        dto.setFabricEtd(line.getFabricEtd());
        dto.setDeliveryDate(line.getDeliveryDate());
        dto.setShipMode(line.getShipMode());
        dto.setFactory(line.getFactory());
        dto.setRemark(line.getRemark());
        dto.setFilePath(line.getFilePath());
        return dto;
    }

    private SalesOrderDeliveryScheduleDto toScheduleDto(SalesOrderDeliverySchedule sched) {
        SalesOrderDeliveryScheduleDto dto = new SalesOrderDeliveryScheduleDto();
        dto.setId(sched.getId());
        dto.setDeliveryDate(sched.getDeliveryDate());
        dto.setShipMode(sched.getShipMode());
        dto.setFactory(sched.getFactory());
        dto.setRemark(sched.getRemark());
        dto.setFilePath(sched.getFilePath());
        return dto;
    }
}
