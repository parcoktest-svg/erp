package com.erp.finance.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.finance.entity.FiscalYear;

public interface FiscalYearRepository extends JpaRepository<FiscalYear, Long> {

    List<FiscalYear> findByCompanyId(Long companyId);

    Optional<FiscalYear> findByCompanyIdAndYear(Long companyId, Integer year);
}
