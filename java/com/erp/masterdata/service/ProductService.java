package com.erp.masterdata.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.entity.Company;
import com.erp.core.repository.CompanyRepository;
import com.erp.masterdata.entity.Product;
import com.erp.masterdata.entity.Uom;
import com.erp.masterdata.repository.ProductRepository;
import com.erp.masterdata.repository.UomRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CompanyRepository companyRepository;
    private final UomRepository uomRepository;

    public ProductService(ProductRepository productRepository, CompanyRepository companyRepository, UomRepository uomRepository) {
        this.productRepository = productRepository;
        this.companyRepository = companyRepository;
        this.uomRepository = uomRepository;
    }

    public List<Product> listByCompany(Long companyId) {
        return productRepository.findByCompanyId(companyId);
    }

    @Transactional
    public Product create(Long companyId, Long uomId, Product product) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));
        Uom uom = uomRepository.findById(uomId)
                .orElseThrow(() -> new IllegalArgumentException("UOM not found"));

        String code = product.getCode() != null ? product.getCode().trim() : null;
        product.setCode(code);
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Code is required");
        }
        if (productRepository.existsByCompanyIdAndCodeIgnoreCase(companyId, code)) {
            throw new IllegalArgumentException("Product code already exists: " + code);
        }

        product.setCompany(company);
        product.setUom(uom);

        return productRepository.save(product);
    }

    @Transactional
    public Product update(Long companyId, Long productId, Long uomId, Product patch) {
        Product existing = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        if (existing.getCompany() == null || existing.getCompany().getId() == null || !existing.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Product company mismatch");
        }

        Uom uom = uomRepository.findById(uomId)
                .orElseThrow(() -> new IllegalArgumentException("UOM not found"));

        String code = patch.getCode() != null ? patch.getCode().trim() : null;
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Code is required");
        }
        if (productRepository.existsByCompanyIdAndCodeIgnoreCaseAndIdNot(companyId, code, existing.getId())) {
            throw new IllegalArgumentException("Product code already exists: " + code);
        }

        existing.setCode(code);
        existing.setName(patch.getName());
        existing.setUom(uom);
        existing.setActive(patch.isActive());
        return productRepository.save(existing);
    }

    @Transactional
    public void delete(Long companyId, Long productId) {
        Product existing = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        if (existing.getCompany() == null || existing.getCompany().getId() == null || !existing.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Product company mismatch");
        }
        productRepository.delete(existing);
    }
}
