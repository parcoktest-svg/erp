package com.erp.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.erp.finance.dto.BalanceSheetReportDto;
import com.erp.finance.dto.BalanceSheetRowDto;
import com.erp.finance.dto.ProfitLossReportDto;
import com.erp.finance.dto.ProfitLossRowDto;
import com.erp.finance.dto.TrialBalanceReportDto;
import com.erp.finance.dto.TrialBalanceRowDto;
import com.erp.finance.model.GlAccountType;
import com.erp.finance.repository.JournalLineRepository;

@Service
public class FinancialStatementService {

    private final JournalLineRepository journalLineRepository;

    public FinancialStatementService(JournalLineRepository journalLineRepository) {
        this.journalLineRepository = journalLineRepository;
    }

    public TrialBalanceReportDto trialBalance(Long companyId, LocalDate fromDate, LocalDate toDate) {
        if (fromDate == null || toDate == null) {
            throw new IllegalArgumentException("fromDate and toDate are required");
        }
        if (toDate.isBefore(fromDate)) {
            throw new IllegalArgumentException("toDate must be >= fromDate");
        }

        TrialBalanceReportDto dto = new TrialBalanceReportDto();
        dto.setFromDate(fromDate);
        dto.setToDate(toDate);

        for (JournalLineRepository.AccountBalanceRow row : journalLineRepository.summarizeByGlAccountForRange(companyId, fromDate, toDate)) {
            TrialBalanceRowDto r = new TrialBalanceRowDto();
            r.setAccountCode(row.getAccountCode());
            r.setAccountName(row.getAccountName());
            r.setAccountType(row.getAccountType());

            BigDecimal debit = row.getDebitTotal() != null ? row.getDebitTotal() : BigDecimal.ZERO;
            BigDecimal credit = row.getCreditTotal() != null ? row.getCreditTotal() : BigDecimal.ZERO;

            r.setDebitTotal(debit);
            r.setCreditTotal(credit);
            r.setBalance(debit.subtract(credit));

            dto.getRows().add(r);
            dto.setTotalDebit(dto.getTotalDebit().add(debit));
            dto.setTotalCredit(dto.getTotalCredit().add(credit));
        }

        return dto;
    }

    public ProfitLossReportDto profitLoss(Long companyId, LocalDate fromDate, LocalDate toDate) {
        if (fromDate == null || toDate == null) {
            throw new IllegalArgumentException("fromDate and toDate are required");
        }
        if (toDate.isBefore(fromDate)) {
            throw new IllegalArgumentException("toDate must be >= fromDate");
        }

        ProfitLossReportDto dto = new ProfitLossReportDto();
        dto.setFromDate(fromDate);
        dto.setToDate(toDate);

        for (JournalLineRepository.AccountBalanceRow row : journalLineRepository.summarizeByGlAccountForRange(companyId, fromDate, toDate)) {
            if (row.getAccountType() != GlAccountType.REVENUE && row.getAccountType() != GlAccountType.EXPENSE) {
                continue;
            }

            BigDecimal debit = row.getDebitTotal() != null ? row.getDebitTotal() : BigDecimal.ZERO;
            BigDecimal credit = row.getCreditTotal() != null ? row.getCreditTotal() : BigDecimal.ZERO;
            BigDecimal amount = credit.subtract(debit); // revenue positive by default

            ProfitLossRowDto r = new ProfitLossRowDto();
            r.setAccountCode(row.getAccountCode());
            r.setAccountName(row.getAccountName());
            r.setAccountType(row.getAccountType());

            if (row.getAccountType() == GlAccountType.REVENUE) {
                BigDecimal revenue = amount.max(BigDecimal.ZERO);
                r.setAmount(revenue);
                dto.getRows().add(r);
                dto.setTotalRevenue(dto.getTotalRevenue().add(revenue));
            } else {
                // expense positive = debit - credit
                BigDecimal expense = debit.subtract(credit);
                if (expense.compareTo(BigDecimal.ZERO) < 0) {
                    expense = BigDecimal.ZERO;
                }
                r.setAmount(expense);
                dto.getRows().add(r);
                dto.setTotalExpense(dto.getTotalExpense().add(expense));
            }
        }

        dto.setNetIncome(dto.getTotalRevenue().subtract(dto.getTotalExpense()));
        return dto;
    }

    public BalanceSheetReportDto balanceSheet(Long companyId, LocalDate asOfDate) {
        LocalDate asOf = asOfDate != null ? asOfDate : LocalDate.now();

        BalanceSheetReportDto dto = new BalanceSheetReportDto();
        dto.setAsOfDate(asOf);

        for (JournalLineRepository.AccountBalanceRow row : journalLineRepository.summarizeByGlAccountAsOf(companyId, asOf)) {
            if (row.getAccountType() != GlAccountType.ASSET
                    && row.getAccountType() != GlAccountType.LIABILITY
                    && row.getAccountType() != GlAccountType.EQUITY) {
                continue;
            }

            BigDecimal debit = row.getDebitTotal() != null ? row.getDebitTotal() : BigDecimal.ZERO;
            BigDecimal credit = row.getCreditTotal() != null ? row.getCreditTotal() : BigDecimal.ZERO;

            BigDecimal amount;
            if (row.getAccountType() == GlAccountType.ASSET) {
                amount = debit.subtract(credit);
                dto.setTotalAssets(dto.getTotalAssets().add(amount));
            } else {
                amount = credit.subtract(debit);
                if (row.getAccountType() == GlAccountType.LIABILITY) {
                    dto.setTotalLiabilities(dto.getTotalLiabilities().add(amount));
                } else {
                    dto.setTotalEquity(dto.getTotalEquity().add(amount));
                }
            }

            BalanceSheetRowDto r = new BalanceSheetRowDto();
            r.setAccountCode(row.getAccountCode());
            r.setAccountName(row.getAccountName());
            r.setAccountType(row.getAccountType());
            r.setAmount(amount);

            dto.getRows().add(r);
        }

        return dto;
    }
}
