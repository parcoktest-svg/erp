package com.erp.masterdata.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.masterdata.entity.ProductPrice;

public interface ProductPriceRepository extends JpaRepository<ProductPrice, Long> {
    List<ProductPrice> findByPriceListVersion_Id(Long priceListVersionId);

    java.util.Optional<ProductPrice> findByPriceListVersion_IdAndProduct_Id(Long priceListVersionId, Long productId);
}
