package com.erp.finance.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.erp.finance.dto.BudgetVsActualDto;
import com.erp.finance.entity.BudgetLine;
import com.erp.finance.repository.BudgetLineRepository;
import com.erp.finance.repository.JournalEntryRepository;

@Service
public class BudgetVsActualService {

    private final BudgetLineRepository budgetLineRepository;
    private final JournalEntryRepository journalEntryRepository;

    public BudgetVsActualService(
            BudgetLineRepository budgetLineRepository,
            JournalEntryRepository journalEntryRepository) {
        this.budgetLineRepository = budgetLineRepository;
        this.journalEntryRepository = journalEntryRepository;
    }

    public List<BudgetVsActualDto> generate(Long budgetId) {
        List<BudgetLine> lines = budgetLineRepository.findByBudgetId(budgetId);
        List<BudgetVsActualDto> result = new ArrayList<>();

        for (BudgetLine bl : lines) {
            BudgetVsActualDto dto = new BudgetVsActualDto();
            dto.setGlAccountId(bl.getGlAccount().getId());
            dto.setGlAccountCode(bl.getGlAccount().getCode());
            dto.setGlAccountName(bl.getGlAccount().getName());
            dto.setAccountingPeriodId(bl.getAccountingPeriod().getId());
            dto.setPeriodName(bl.getAccountingPeriod().getName());
            dto.setBudgetAmount(bl.getBudgetAmount());

            // Actual = sum(debit - credit) for the account in the period
            BigDecimal actual = journalEntryRepository.sumActualByAccountAndPeriod(
                    bl.getGlAccount().getId(),
                    bl.getAccountingPeriod().getId());
            if (actual == null) {
                actual = BigDecimal.ZERO;
            }
            dto.setActualAmount(actual);

            // Variance = actual - budget
            BigDecimal variance = actual.subtract(bl.getBudgetAmount());
            dto.setVariance(variance);

            // Variance % = (variance / budget) * 100, avoid division by zero
            BigDecimal variancePercent = BigDecimal.ZERO;
            if (bl.getBudgetAmount().compareTo(BigDecimal.ZERO) != 0) {
                variancePercent = variance
                        .divide(bl.getBudgetAmount(), 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"));
            }
            dto.setVariancePercent(variancePercent);

            result.add(dto);
        }

        return result;
    }
}
