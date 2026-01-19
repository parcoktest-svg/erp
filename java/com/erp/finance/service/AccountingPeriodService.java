package com.erp.finance.service;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.entity.Company;
import com.erp.core.repository.CompanyRepository;
import com.erp.finance.entity.AccountingPeriod;
import com.erp.finance.entity.FiscalYear;
import com.erp.finance.model.PeriodStatus;
import com.erp.finance.repository.AccountingPeriodRepository;

@Service
public class AccountingPeriodService {

    private final AccountingPeriodRepository accountingPeriodRepository;
    private final CompanyRepository companyRepository;

    public AccountingPeriodService(AccountingPeriodRepository accountingPeriodRepository, CompanyRepository companyRepository) {
        this.accountingPeriodRepository = accountingPeriodRepository;
        this.companyRepository = companyRepository;
    }

    public AccountingPeriod getPeriodForDate(Long companyId, LocalDate date) {
        return accountingPeriodRepository.findByCompanyIdAndDate(companyId, date)
                .orElseThrow(() -> new IllegalArgumentException("No accounting period for date=" + date));
    }

    public List<AccountingPeriod> listByFiscalYear(Long fiscalYearId) {
        return accountingPeriodRepository.findByFiscalYearId(fiscalYearId);
    }

    @Transactional
    public List<AccountingPeriod> generateMonthlyPeriods(Long companyId, FiscalYear fy) {
        if (fy == null || fy.getId() == null) {
            throw new IllegalArgumentException("Fiscal year is required");
        }

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));
        if (fy.getCompany() == null || fy.getCompany().getId() == null || !fy.getCompany().getId().equals(company.getId())) {
            throw new IllegalArgumentException("Fiscal year company mismatch");
        }

        LocalDate cursor = fy.getStartDate().withDayOfMonth(1);
        LocalDate fyEnd = fy.getEndDate();

        List<AccountingPeriod> periods = new ArrayList<>();
        int periodNo = 1;
        while (!cursor.isAfter(fyEnd) && periodNo <= 12) {
            LocalDate start = cursor;
            LocalDate end = cursor.with(TemporalAdjusters.lastDayOfMonth());
            if (end.isAfter(fyEnd)) {
                end = fyEnd;
            }

            AccountingPeriod p = new AccountingPeriod();
            p.setFiscalYear(fy);
            p.setPeriodNo(periodNo);
            p.setStartDate(start);
            p.setEndDate(end);
            p.setName(String.format("FY%d-P%02d (%s..%s)", fy.getYear(), periodNo, start, end));
            p.setStatus(PeriodStatus.OPEN);
            periods.add(accountingPeriodRepository.save(p));

            cursor = cursor.plusMonths(1);
            periodNo++;
        }

        return periods;
    }

    @Transactional
    public AccountingPeriod closePeriod(Long companyId, Long periodId) {
        AccountingPeriod p = accountingPeriodRepository.findById(periodId)
                .orElseThrow(() -> new IllegalArgumentException("Accounting period not found"));

        if (p.getFiscalYear() == null || p.getFiscalYear().getCompany() == null || p.getFiscalYear().getCompany().getId() == null
                || !p.getFiscalYear().getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Accounting period company mismatch");
        }

        p.setStatus(PeriodStatus.CLOSED);
        return accountingPeriodRepository.save(p);
    }

    @Transactional
    public AccountingPeriod openPeriod(Long companyId, Long periodId) {
        AccountingPeriod p = accountingPeriodRepository.findById(periodId)
                .orElseThrow(() -> new IllegalArgumentException("Accounting period not found"));

        if (p.getFiscalYear() == null || p.getFiscalYear().getCompany() == null || p.getFiscalYear().getCompany().getId() == null
                || !p.getFiscalYear().getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Accounting period company mismatch");
        }

        p.setStatus(PeriodStatus.OPEN);
        return accountingPeriodRepository.save(p);
    }

    public void assertPostingAllowed(Long companyId, LocalDate accountingDate) {
        AccountingPeriod p = getPeriodForDate(companyId, accountingDate);
        if (p.getStatus() == PeriodStatus.CLOSED) {
            throw new IllegalArgumentException("Posting is not allowed: accounting period is CLOSED for date=" + accountingDate);
        }
    }
}
