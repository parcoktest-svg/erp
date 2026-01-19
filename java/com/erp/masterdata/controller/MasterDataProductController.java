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

import com.erp.masterdata.entity.Product;
import com.erp.masterdata.service.ProductService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/api/masterdata/companies/{companyId}/products")
public class MasterDataProductController {

    private final ProductService productService;

    public MasterDataProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> list(@PathVariable Long companyId) {
        return ResponseEntity.ok(productService.listByCompany(companyId));
    }

    @PostMapping
    public ResponseEntity<Product> create(@PathVariable Long companyId, @Valid @RequestBody CreateProductRequest request) {
        Product p = new Product();
        p.setCode(request.getCode());
        p.setName(request.getName());
        p.setActive(true);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.create(companyId, request.getUomId(), p));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Product> update(@PathVariable Long companyId, @PathVariable Long productId, @Valid @RequestBody UpdateProductRequest request) {
        Product patch = new Product();
        patch.setCode(request.getCode());
        patch.setName(request.getName());
        patch.setActive(request.isActive());
        return ResponseEntity.ok(productService.update(companyId, productId, request.getUomId(), patch));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> delete(@PathVariable Long companyId, @PathVariable Long productId) {
        productService.delete(companyId, productId);
        return ResponseEntity.noContent().build();
    }

    public static class CreateProductRequest {
        @NotBlank
        private String code;

        @NotBlank
        private String name;

        @NotNull
        private Long uomId;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Long getUomId() {
            return uomId;
        }

        public void setUomId(Long uomId) {
            this.uomId = uomId;
        }
    }

    public static class UpdateProductRequest {
        @NotBlank
        private String code;

        @NotBlank
        private String name;

        @NotNull
        private Long uomId;

        private boolean active = true;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Long getUomId() {
            return uomId;
        }

        public void setUomId(Long uomId) {
            this.uomId = uomId;
        }

        public boolean isActive() {
            return active;
        }

        public void setActive(boolean active) {
            this.active = active;
        }
    }
}
