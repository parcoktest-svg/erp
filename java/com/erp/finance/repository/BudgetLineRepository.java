package com.erp.finance.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.erp.finance.entity.BudgetLine;

public interface BudgetLineRepository extends JpaRepository<BudgetLine, Long> {
    List<BudgetLine> findByBudgetId(Long budgetId);
    List<BudgetLine> findByBudgetIdAndGlAccountId(Long budgetId, Long glAccountId);
    List<BudgetLine> findByBudgetIdAndAccountingPeriodId(Long budgetId, Long accountingPeriodId);

    @Query("select coalesce(sum(bl.budgetAmount), 0) from BudgetLine bl where bl.budget.id = :budgetId and bl.glAccount.id = :glAccountId")
    java.math.BigDecimal sumBudgetAmountByBudgetAndAccount(@Param("budgetId") Long budgetId, @Param("glAccountId") Long glAccountId);
}
