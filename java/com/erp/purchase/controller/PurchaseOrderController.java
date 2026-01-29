package com.erp.purchase.controller;

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

import com.erp.finance.dto.InvoiceDto;
import com.erp.finance.dto.InvoiceLineDto;
import com.erp.finance.dto.InvoiceTaxLineDto;
import com.erp.finance.entity.Invoice;
import com.erp.finance.entity.InvoiceLine;
import com.erp.finance.entity.InvoiceTaxLine;
import com.erp.purchase.dto.PurchaseOrderDto;
import com.erp.purchase.dto.PurchaseOrderLineDto;
import com.erp.purchase.entity.PurchaseOrder;
import com.erp.purchase.entity.PurchaseOrderLine;
import com.erp.purchase.request.CreateInvoiceFromPurchaseOrderRequest;
import com.erp.purchase.request.CreatePurchaseOrderRequest;
import com.erp.purchase.request.UpdatePurchaseOrderRequest;
import com.erp.purchase.request.VoidPurchaseOrderRequest;
import com.erp.purchase.service.PurchaseInvoicingService;
import com.erp.purchase.service.PurchaseOrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/purchase/companies/{companyId}/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;
    private final PurchaseInvoicingService purchaseInvoicingService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService, PurchaseInvoicingService purchaseInvoicingService) {
        this.purchaseOrderService = purchaseOrderService;
        this.purchaseInvoicingService = purchaseInvoicingService;
    }

    @GetMapping
    public ResponseEntity<List<PurchaseOrderDto>> list(@PathVariable Long companyId) {
        List<PurchaseOrderDto> result = purchaseOrderService.listByCompany(companyId).stream().map(this::toDto).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{purchaseOrderId}")
    public ResponseEntity<PurchaseOrderDto> get(@PathVariable Long companyId, @PathVariable Long purchaseOrderId) {
        PurchaseOrder po = purchaseOrderService.get(companyId, purchaseOrderId);
        return ResponseEntity.ok(toDto(po));
    }

    @PostMapping
    public ResponseEntity<PurchaseOrderDto> create(@PathVariable Long companyId, @Valid @RequestBody CreatePurchaseOrderRequest request) {
        PurchaseOrder saved = purchaseOrderService.create(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    @PutMapping("/{purchaseOrderId}")
    public ResponseEntity<PurchaseOrderDto> update(
            @PathVariable Long companyId,
            @PathVariable Long purchaseOrderId,
            @Valid @RequestBody UpdatePurchaseOrderRequest request) {
        PurchaseOrder updated = purchaseOrderService.update(companyId, purchaseOrderId, request);
        return ResponseEntity.ok(toDto(updated));
    }

    @DeleteMapping("/{purchaseOrderId}")
    public ResponseEntity<Void> delete(@PathVariable Long companyId, @PathVariable Long purchaseOrderId) {
        purchaseOrderService.delete(companyId, purchaseOrderId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{purchaseOrderId}/approve")
    public ResponseEntity<PurchaseOrderDto> approve(@PathVariable Long companyId, @PathVariable Long purchaseOrderId) {
        PurchaseOrder updated = purchaseOrderService.approve(companyId, purchaseOrderId);
        return ResponseEntity.ok(toDto(updated));
    }

    @PostMapping("/{purchaseOrderId}/void")
    public ResponseEntity<PurchaseOrderDto> voidOrder(
            @PathVariable Long companyId,
            @PathVariable Long purchaseOrderId,
            @Valid @RequestBody VoidPurchaseOrderRequest request) {
        PurchaseOrder updated = purchaseOrderService.voidOrder(companyId, purchaseOrderId, request);
        return ResponseEntity.ok(toDto(updated));
    }

    @PostMapping("/{purchaseOrderId}/invoices")
    public ResponseEntity<InvoiceDto> createApInvoice(
            @PathVariable Long companyId,
            @PathVariable Long purchaseOrderId,
            @Valid @RequestBody CreateInvoiceFromPurchaseOrderRequest request) {
        Invoice invoice = purchaseInvoicingService.createApInvoiceFromPurchaseOrder(companyId, purchaseOrderId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toInvoiceDto(invoice));
    }

    private PurchaseOrderDto toDto(PurchaseOrder po) {
        PurchaseOrderDto dto = new PurchaseOrderDto();
        dto.setId(po.getId());
        dto.setCompanyId(po.getCompany() != null ? po.getCompany().getId() : null);
        dto.setOrgId(po.getOrg() != null ? po.getOrg().getId() : null);
        dto.setVendorId(po.getVendor() != null ? po.getVendor().getId() : null);
        dto.setPriceListVersionId(po.getPriceListVersion() != null ? po.getPriceListVersion().getId() : null);
        dto.setDocumentNo(po.getDocumentNo());
        dto.setStatus(po.getStatus());
        dto.setOrderDate(po.getOrderDate());
        dto.setTotalNet(po.getTotalNet());
        dto.setTotalTax(po.getTotalTax());
        dto.setGrandTotal(po.getGrandTotal());
        dto.setLines(po.getLines() != null ? po.getLines().stream().map(this::toLineDto).toList() : List.of());
        return dto;
    }

    private PurchaseOrderLineDto toLineDto(PurchaseOrderLine line) {
        PurchaseOrderLineDto dto = new PurchaseOrderLineDto();
        dto.setId(line.getId());
        dto.setProductId(line.getProduct() != null ? line.getProduct().getId() : null);
        dto.setUomId(line.getUom() != null ? line.getUom().getId() : null);
        dto.setQty(line.getQty());
        dto.setPrice(line.getPrice());
        dto.setLineNet(line.getLineNet());
        dto.setReceivedQty(line.getReceivedQty());
        dto.setInvoicedQty(line.getInvoicedQty());
        return dto;
    }

    private InvoiceDto toInvoiceDto(Invoice invoice) {
        InvoiceDto dto = new InvoiceDto();
        dto.setId(invoice.getId());
        dto.setCompanyId(invoice.getCompany() != null ? invoice.getCompany().getId() : null);
        dto.setOrgId(invoice.getOrg() != null ? invoice.getOrg().getId() : null);
        dto.setBusinessPartnerId(invoice.getBusinessPartner() != null ? invoice.getBusinessPartner().getId() : null);
        dto.setInvoiceType(invoice.getInvoiceType());
        dto.setTaxRateId(invoice.getTaxRate() != null ? invoice.getTaxRate().getId() : null);
        dto.setDocumentNo(invoice.getDocumentNo());
        dto.setStatus(invoice.getStatus());
        dto.setInvoiceDate(invoice.getInvoiceDate());
        dto.setTotalNet(invoice.getTotalNet());
        dto.setTotalTax(invoice.getTotalTax());
        dto.setGrandTotal(invoice.getGrandTotal());
        dto.setPaidAmount(invoice.getPaidAmount());
        dto.setOpenAmount(invoice.getOpenAmount());
        dto.setSalesOrderId(invoice.getSalesOrderId());
        dto.setPurchaseOrderId(invoice.getPurchaseOrderId());
        dto.setLines(invoice.getLines() != null ? invoice.getLines().stream().map(this::toInvoiceLineDto).toList() : List.of());
        dto.setTaxLines(invoice.getTaxLines() != null ? invoice.getTaxLines().stream().map(this::toInvoiceTaxLineDto).toList() : List.of());
        return dto;
    }

    private InvoiceLineDto toInvoiceLineDto(InvoiceLine line) {
        InvoiceLineDto dto = new InvoiceLineDto();
        dto.setId(line.getId());
        dto.setProductId(line.getProduct() != null ? line.getProduct().getId() : null);
        dto.setUomId(line.getUom() != null ? line.getUom().getId() : null);
        dto.setQty(line.getQty());
        dto.setPrice(line.getPrice());
        dto.setLineNet(line.getLineNet());
        dto.setPurchaseOrderLineId(line.getPurchaseOrderLineId());
        return dto;
    }

    private InvoiceTaxLineDto toInvoiceTaxLineDto(InvoiceTaxLine line) {
        InvoiceTaxLineDto dto = new InvoiceTaxLineDto();
        dto.setId(line.getId());
        dto.setTaxRateId(line.getTaxRate() != null ? line.getTaxRate().getId() : null);
        dto.setTaxBase(line.getTaxBase());
        dto.setTaxAmount(line.getTaxAmount());
        dto.setRoundingAmount(line.getRoundingAmount());
        return dto;
    }
}
