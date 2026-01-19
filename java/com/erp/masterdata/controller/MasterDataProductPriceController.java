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

import com.erp.masterdata.entity.ProductPrice;
import com.erp.masterdata.service.ProductPriceService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/api/masterdata/price-list-versions/{priceListVersionId}/product-prices")
public class MasterDataProductPriceController {

    private final ProductPriceService productPriceService;

    public MasterDataProductPriceController(ProductPriceService productPriceService) {
        this.productPriceService = productPriceService;
    }

    @GetMapping
    public ResponseEntity<List<ProductPrice>> list(@PathVariable Long priceListVersionId) {
        return ResponseEntity.ok(productPriceService.listByPriceListVersion(priceListVersionId));
    }

    @PostMapping
    public ResponseEntity<ProductPrice> create(@PathVariable Long priceListVersionId, @Valid @RequestBody CreateProductPriceRequest request) {
        ProductPrice saved = productPriceService.create(priceListVersionId, request.getProductId(), request.getPrice());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    public static class CreateProductPriceRequest {
        @NotNull
        private Long productId;

        @NotNull
        @DecimalMin("0.0")
        private BigDecimal price;

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }
    }
}
