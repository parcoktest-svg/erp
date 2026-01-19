package com.erp.masterdata.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.masterdata.entity.TaxRate;

public interface TaxRateRepository extends JpaRepository<TaxRate, Long> {
    List<TaxRate> findByCompanyId(Long companyId);
}
