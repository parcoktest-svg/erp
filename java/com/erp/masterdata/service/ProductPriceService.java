package com.erp.masterdata.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.masterdata.entity.PriceListVersion;
import com.erp.masterdata.entity.Product;
import com.erp.masterdata.entity.ProductPrice;
import com.erp.masterdata.repository.PriceListVersionRepository;
import com.erp.masterdata.repository.ProductPriceRepository;
import com.erp.masterdata.repository.ProductRepository;

@Service
public class ProductPriceService {

    private final ProductPriceRepository productPriceRepository;
    private final PriceListVersionRepository priceListVersionRepository;
    private final ProductRepository productRepository;

    public ProductPriceService(ProductPriceRepository productPriceRepository, PriceListVersionRepository priceListVersionRepository, ProductRepository productRepository) {
        this.productPriceRepository = productPriceRepository;
        this.priceListVersionRepository = priceListVersionRepository;
        this.productRepository = productRepository;
    }

    public List<ProductPrice> listByPriceListVersion(Long priceListVersionId) {
        return productPriceRepository.findByPriceListVersion_Id(priceListVersionId);
    }

    @Transactional
    public ProductPrice create(Long priceListVersionId, Long productId, BigDecimal price) {
        PriceListVersion plv = priceListVersionRepository.findById(priceListVersionId)
                .orElseThrow(() -> new IllegalArgumentException("PriceListVersion not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        ProductPrice pp = productPriceRepository
                .findByPriceListVersion_IdAndProduct_Id(priceListVersionId, productId)
                .orElseGet(ProductPrice::new);

        pp.setPriceListVersion(plv);
        pp.setProduct(product);
        pp.setPrice(price);
        pp.setActive(true);

        return productPriceRepository.save(pp);
    }
}
