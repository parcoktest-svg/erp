package com.erp.finance.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.erp.finance.entity.AccountingPeriod;

public interface AccountingPeriodRepository extends JpaRepository<AccountingPeriod, Long> {

    List<AccountingPeriod> findByFiscalYearId(Long fiscalYearId);

    @Query("""
            select p from AccountingPeriod p
            where p.fiscalYear.company.id = :companyId
              and :date between p.startDate and p.endDate
            """)
    Optional<AccountingPeriod> findByCompanyIdAndDate(@Param("companyId") Long companyId, @Param("date") LocalDate date);
}
