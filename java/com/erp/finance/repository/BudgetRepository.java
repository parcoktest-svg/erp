package com.erp.finance.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.finance.entity.Budget;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByCompanyId(Long companyId);
    List<Budget> findByCompanyIdAndFiscalYearId(Long companyId, Long fiscalYearId);
}
