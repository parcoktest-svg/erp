package com.erp.masterdata.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.masterdata.entity.PriceListVersion;
import com.erp.masterdata.service.PriceListVersionService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/api/masterdata/price-lists/{priceListId}/versions")
public class MasterDataPriceListVersionController {

    private final PriceListVersionService priceListVersionService;

    public MasterDataPriceListVersionController(PriceListVersionService priceListVersionService) {
        this.priceListVersionService = priceListVersionService;
    }

    @GetMapping
    public ResponseEntity<List<PriceListVersion>> list(@PathVariable Long priceListId) {
        return ResponseEntity.ok(priceListVersionService.listByPriceList(priceListId));
    }

    @PostMapping
    public ResponseEntity<PriceListVersion> create(@PathVariable Long priceListId, @Valid @RequestBody CreatePriceListVersionRequest request) {
        PriceListVersion saved = priceListVersionService.create(priceListId, request.getValidFrom());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    public static class CreatePriceListVersionRequest {
        @NotNull
        private LocalDate validFrom;

        public LocalDate getValidFrom() {
            return validFrom;
        }

        public void setValidFrom(LocalDate validFrom) {
            this.validFrom = validFrom;
        }
    }
}
