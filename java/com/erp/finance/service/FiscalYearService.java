package com.erp.finance.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.entity.Company;
import com.erp.core.repository.CompanyRepository;
import com.erp.finance.entity.FiscalYear;
import com.erp.finance.model.PeriodStatus;
import com.erp.finance.repository.FiscalYearRepository;
import com.erp.finance.request.CreateFiscalYearRequest;

@Service
public class FiscalYearService {

    private final FiscalYearRepository fiscalYearRepository;
    private final CompanyRepository companyRepository;
    private final AccountingPeriodService accountingPeriodService;

    public FiscalYearService(
            FiscalYearRepository fiscalYearRepository,
            CompanyRepository companyRepository,
            AccountingPeriodService accountingPeriodService) {
        this.fiscalYearRepository = fiscalYearRepository;
        this.companyRepository = companyRepository;
        this.accountingPeriodService = accountingPeriodService;
    }

    public List<FiscalYear> listByCompany(Long companyId) {
        return fiscalYearRepository.findByCompanyId(companyId);
    }

    @Transactional
    public FiscalYear create(Long companyId, CreateFiscalYearRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        fiscalYearRepository.findByCompanyIdAndYear(companyId, request.getYear())
                .ifPresent(f -> {
                    throw new IllegalArgumentException("Fiscal year already exists");
                });

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new IllegalArgumentException("startDate must be <= endDate");
        }

        FiscalYear fy = new FiscalYear();
        fy.setCompany(company);
        fy.setYear(request.getYear());
        fy.setStartDate(request.getStartDate());
        fy.setEndDate(request.getEndDate());
        fy.setStatus(PeriodStatus.OPEN);

        FiscalYear saved = fiscalYearRepository.save(fy);
        accountingPeriodService.generateMonthlyPeriods(companyId, saved);
        return saved;
    }

    @Transactional
    public FiscalYear close(Long companyId, Long fiscalYearId) {
        FiscalYear fy = fiscalYearRepository.findById(fiscalYearId)
                .orElseThrow(() -> new IllegalArgumentException("Fiscal year not found"));

        if (fy.getCompany() == null || fy.getCompany().getId() == null || !fy.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Fiscal year company mismatch");
        }

        fy.setStatus(PeriodStatus.CLOSED);
        return fiscalYearRepository.save(fy);
    }

    @Transactional
    public FiscalYear open(Long companyId, Long fiscalYearId) {
        FiscalYear fy = fiscalYearRepository.findById(fiscalYearId)
                .orElseThrow(() -> new IllegalArgumentException("Fiscal year not found"));

        if (fy.getCompany() == null || fy.getCompany().getId() == null || !fy.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Fiscal year company mismatch");
        }

        fy.setStatus(PeriodStatus.OPEN);
        return fiscalYearRepository.save(fy);
    }
}
