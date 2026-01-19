package com.erp.masterdata.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.masterdata.entity.TaxRate;
import com.erp.masterdata.service.TaxRateService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/api/masterdata/companies/{companyId}/tax-rates")
public class MasterDataTaxRateController {

    private final TaxRateService taxRateService;

    public MasterDataTaxRateController(TaxRateService taxRateService) {
        this.taxRateService = taxRateService;
    }

    @GetMapping
    public ResponseEntity<List<TaxRate>> list(@PathVariable Long companyId) {
        return ResponseEntity.ok(taxRateService.listByCompany(companyId));
    }

    @PostMapping
    public ResponseEntity<TaxRate> create(@PathVariable Long companyId, @Valid @RequestBody CreateTaxRateRequest request) {
        TaxRate tr = new TaxRate();
        tr.setName(request.getName());
        tr.setRate(request.getRate());
        tr.setActive(true);
        return ResponseEntity.status(HttpStatus.CREATED).body(taxRateService.create(companyId, tr));
    }

    public static class CreateTaxRateRequest {
        @NotBlank
        private String name;

        @NotNull
        @DecimalMin("0.0")
        private BigDecimal rate;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public BigDecimal getRate() {
            return rate;
        }

        public void setRate(BigDecimal rate) {
            this.rate = rate;
        }
    }
}
