package com.erp.finance.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.erp.core.model.DocumentType;
import com.erp.finance.entity.JournalEntry;

public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
    List<JournalEntry> findByCompanyId(Long companyId);

    Optional<JournalEntry> findByCompanyIdAndSourceDocumentTypeAndSourceDocumentNo(
            Long companyId,
            DocumentType sourceDocumentType,
            String sourceDocumentNo);

    @Query("select coalesce(sum(jl.debit - jl.credit), 0) from JournalLine jl " +
           "where jl.glAccount.id = :glAccountId and jl.journalEntry.accountingPeriod.id = :periodId")
    BigDecimal sumActualByAccountAndPeriod(@Param("glAccountId") Long glAccountId, @Param("periodId") Long periodId);
}
