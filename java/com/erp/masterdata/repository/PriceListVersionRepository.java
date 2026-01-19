package com.erp.masterdata.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.masterdata.entity.PriceListVersion;

public interface PriceListVersionRepository extends JpaRepository<PriceListVersion, Long> {
    List<PriceListVersion> findByPriceListId(Long priceListId);
}
