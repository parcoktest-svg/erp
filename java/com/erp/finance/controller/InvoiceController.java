package com.erp.finance.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.finance.dto.InvoiceDto;
import com.erp.finance.dto.InvoiceLineDto;
import com.erp.finance.dto.InvoiceTaxLineDto;
import com.erp.finance.entity.Invoice;
import com.erp.finance.entity.InvoiceLine;
import com.erp.finance.entity.InvoiceTaxLine;
import com.erp.finance.request.CreateInvoiceRequest;
import com.erp.finance.request.VoidInvoiceRequest;
import com.erp.finance.service.InvoiceService;
import com.erp.finance.service.InvoiceVoidService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/finance/companies/{companyId}/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final InvoiceVoidService invoiceVoidService;

    public InvoiceController(InvoiceService invoiceService, InvoiceVoidService invoiceVoidService) {
        this.invoiceService = invoiceService;
        this.invoiceVoidService = invoiceVoidService;
    }

    @GetMapping
    public ResponseEntity<List<InvoiceDto>> list(@PathVariable Long companyId) {
        List<InvoiceDto> result = invoiceService.listByCompany(companyId).stream().map(this::toDto).toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<InvoiceDto> create(@PathVariable Long companyId, @Valid @RequestBody CreateInvoiceRequest request) {
        Invoice saved = invoiceService.create(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    @PostMapping("/{invoiceId}/void")
    public ResponseEntity<InvoiceDto> voidInvoice(
            @PathVariable Long companyId,
            @PathVariable Long invoiceId,
            @Valid @RequestBody VoidInvoiceRequest request) {
        Invoice saved = invoiceVoidService.voidInvoice(companyId, invoiceId, request);
        return ResponseEntity.ok(toDto(saved));
    }

    private InvoiceDto toDto(Invoice invoice) {
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
        dto.setLines(invoice.getLines() != null ? invoice.getLines().stream().map(this::toLineDto).toList() : List.of());
        dto.setTaxLines(invoice.getTaxLines() != null ? invoice.getTaxLines().stream().map(this::toTaxLineDto).toList() : List.of());
        return dto;
    }

    private InvoiceLineDto toLineDto(InvoiceLine line) {
        InvoiceLineDto dto = new InvoiceLineDto();
        dto.setId(line.getId());
        dto.setProductId(line.getProduct() != null ? line.getProduct().getId() : null);
        dto.setUomId(line.getUom() != null ? line.getUom().getId() : null);
        dto.setQty(line.getQty());
        dto.setPrice(line.getPrice());
        dto.setLineNet(line.getLineNet());
        return dto;
    }

    private InvoiceTaxLineDto toTaxLineDto(InvoiceTaxLine line) {
        InvoiceTaxLineDto dto = new InvoiceTaxLineDto();
        dto.setId(line.getId());
        dto.setTaxRateId(line.getTaxRate() != null ? line.getTaxRate().getId() : null);
        dto.setTaxBase(line.getTaxBase());
        dto.setTaxAmount(line.getTaxAmount());
        dto.setRoundingAmount(line.getRoundingAmount());
        return dto;
    }
}
