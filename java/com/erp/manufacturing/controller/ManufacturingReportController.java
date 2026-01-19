package com.erp.manufacturing.controller;

import java.math.BigDecimal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.erp.manufacturing.dto.ProductionCostReportDto;
import com.erp.manufacturing.dto.WipReportDto;
import com.erp.manufacturing.service.ManufacturingReportService;

@RestController
@RequestMapping("/api/manufacturing/companies/{companyId}/reports")
public class ManufacturingReportController {

    private final ManufacturingReportService manufacturingReportService;

    public ManufacturingReportController(ManufacturingReportService manufacturingReportService) {
        this.manufacturingReportService = manufacturingReportService;
    }

    @GetMapping("/wip")
    public ResponseEntity<WipReportDto> wip(@PathVariable Long companyId) {
        return ResponseEntity.ok(manufacturingReportService.wip(companyId));
    }

    @GetMapping("/production-cost")
    public ResponseEntity<ProductionCostReportDto> productionCost(
            @PathVariable Long companyId,
            @RequestParam Long bomId,
            @RequestParam BigDecimal qty,
            @RequestParam Long priceListVersionId) {

        return ResponseEntity.ok(manufacturingReportService.productionCost(companyId, bomId, qty, priceListVersionId));
    }
}
