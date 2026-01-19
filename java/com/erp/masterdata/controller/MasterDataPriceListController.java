package com.erp.masterdata.controller;

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

import com.erp.masterdata.entity.PriceList;
import com.erp.masterdata.service.PriceListService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/api/masterdata/companies/{companyId}/price-lists")
public class MasterDataPriceListController {

    private final PriceListService priceListService;

    public MasterDataPriceListController(PriceListService priceListService) {
        this.priceListService = priceListService;
    }

    @GetMapping
    public ResponseEntity<List<PriceList>> list(@PathVariable Long companyId) {
        return ResponseEntity.ok(priceListService.listByCompany(companyId));
    }

    @PostMapping
    public ResponseEntity<PriceList> create(@PathVariable Long companyId, @Valid @RequestBody CreatePriceListRequest request) {
        PriceList pl = new PriceList();
        pl.setName(request.getName());
        pl.setSalesPriceList(request.isSalesPriceList());
        pl.setActive(true);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(priceListService.create(companyId, request.getCurrencyId(), pl));
    }

    @PutMapping("/{priceListId}")
    public ResponseEntity<PriceList> update(@PathVariable Long companyId, @PathVariable Long priceListId, @Valid @RequestBody UpdatePriceListRequest request) {
        PriceList patch = new PriceList();
        patch.setName(request.getName());
        patch.setSalesPriceList(request.isSalesPriceList());
        patch.setActive(request.isActive());
        return ResponseEntity.ok(priceListService.update(companyId, priceListId, request.getCurrencyId(), patch));
    }

    @DeleteMapping("/{priceListId}")
    public ResponseEntity<Void> delete(@PathVariable Long companyId, @PathVariable Long priceListId) {
        priceListService.delete(companyId, priceListId);
        return ResponseEntity.noContent().build();
    }

    public static class CreatePriceListRequest {
        @NotBlank
        private String name;

        @NotNull
        private Long currencyId;

        private boolean salesPriceList = true;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Long getCurrencyId() {
            return currencyId;
        }

        public void setCurrencyId(Long currencyId) {
            this.currencyId = currencyId;
        }

        public boolean isSalesPriceList() {
            return salesPriceList;
        }

        public void setSalesPriceList(boolean salesPriceList) {
            this.salesPriceList = salesPriceList;
        }
    }

    public static class UpdatePriceListRequest {
        @NotBlank
        private String name;

        @NotNull
        private Long currencyId;

        private boolean salesPriceList = true;

        private boolean active = true;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Long getCurrencyId() {
            return currencyId;
        }

        public void setCurrencyId(Long currencyId) {
            this.currencyId = currencyId;
        }

        public boolean isSalesPriceList() {
            return salesPriceList;
        }

        public void setSalesPriceList(boolean salesPriceList) {
            this.salesPriceList = salesPriceList;
        }

        public boolean isActive() {
            return active;
        }

        public void setActive(boolean active) {
            this.active = active;
        }
    }
}
