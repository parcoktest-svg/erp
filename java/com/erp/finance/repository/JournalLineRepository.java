package com.erp.finance.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.erp.finance.entity.JournalLine;
import com.erp.finance.model.GlAccountCode;
import com.erp.finance.model.GlAccountType;

public interface JournalLineRepository extends JpaRepository<JournalLine, Long> {

    interface GlSummaryRow {
        GlAccountCode getAccountCode();

        java.math.BigDecimal getDebitTotal();

        java.math.BigDecimal getCreditTotal();
    }

    @Query("""
            select l.accountCode as accountCode,
                   coalesce(sum(l.debit), 0) as debitTotal,
                   coalesce(sum(l.credit), 0) as creditTotal
            from JournalLine l
            where l.journalEntry.company.id = :companyId
              and l.journalEntry.accountingDate >= :fromDate
              and l.journalEntry.accountingDate <= :toDate
            group by l.accountCode
            """)
    List<GlSummaryRow> summarizeByAccount(
            @Param("companyId") Long companyId,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);

	interface AccountBalanceRow {
		String getAccountCode();

		String getAccountName();

		GlAccountType getAccountType();

		java.math.BigDecimal getDebitTotal();

		java.math.BigDecimal getCreditTotal();
	}

	@Query("""
			select ga.code as accountCode,
			       ga.name as accountName,
			       ga.type as accountType,
			       coalesce(sum(l.debit), 0) as debitTotal,
			       coalesce(sum(l.credit), 0) as creditTotal
			from JournalLine l
			join l.glAccount ga
			where l.journalEntry.company.id = :companyId
			  and l.journalEntry.accountingDate >= :fromDate
			  and l.journalEntry.accountingDate <= :toDate
			group by ga.code, ga.name, ga.type
			order by ga.code
			""")
	List<AccountBalanceRow> summarizeByGlAccountForRange(
			@Param("companyId") Long companyId,
			@Param("fromDate") LocalDate fromDate,
			@Param("toDate") LocalDate toDate);

	@Query("""
			select ga.code as accountCode,
			       ga.name as accountName,
			       ga.type as accountType,
			       coalesce(sum(l.debit), 0) as debitTotal,
			       coalesce(sum(l.credit), 0) as creditTotal
			from JournalLine l
			join l.glAccount ga
			where l.journalEntry.company.id = :companyId
			  and l.journalEntry.accountingDate <= :asOfDate
			group by ga.code, ga.name, ga.type
			order by ga.code
			""")
	List<AccountBalanceRow> summarizeByGlAccountAsOf(
			@Param("companyId") Long companyId,
			@Param("asOfDate") LocalDate asOfDate);
}
