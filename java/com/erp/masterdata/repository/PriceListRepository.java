package com.erp.masterdata.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.masterdata.entity.PriceList;

public interface PriceListRepository extends JpaRepository<PriceList, Long> {
    List<PriceList> findByCompanyId(Long companyId);
}
