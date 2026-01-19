package com.erp.finance.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.entity.Company;
import com.erp.core.repository.CompanyRepository;
import com.erp.finance.entity.GlAccount;
import com.erp.finance.model.GlAccountCode;
import com.erp.finance.model.GlAccountType;
import com.erp.finance.repository.GlAccountRepository;

@Service
public class GlAccountMappingService {

    private final GlAccountRepository glAccountRepository;
    private final CompanyRepository companyRepository;

    public GlAccountMappingService(GlAccountRepository glAccountRepository, CompanyRepository companyRepository) {
        this.glAccountRepository = glAccountRepository;
        this.companyRepository = companyRepository;
    }

    @Transactional
    public GlAccount resolve(Long companyId, GlAccountCode legacyCode) {
        if (legacyCode == null) {
            return null;
        }

        String coaCode = mapToCoaCode(legacyCode);
        if (coaCode == null) {
            return null;
        }

        return glAccountRepository.findByCompanyIdAndCode(companyId, coaCode)
                .orElseGet(() -> createDefault(companyId, coaCode, legacyCode));
    }

    private String mapToCoaCode(GlAccountCode code) {
        return switch (code) {
            case CASH -> "1000";
            case AR -> "1100";
            case AP -> "2000";
            case TAX_PAYABLE -> "2100";
            case TAX_RECEIVABLE -> "1200";
            case REVENUE -> "4000";
            case EXPENSE -> "5000";
            case INVENTORY -> "1400";
            case ADJUSTMENT -> "5100";
        };
    }

    private GlAccount createDefault(Long companyId, String coaCode, GlAccountCode legacyCode) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        GlAccount a = new GlAccount();
        a.setCompany(company);
        a.setCode(coaCode);
        a.setName(defaultName(legacyCode));
        a.setType(defaultType(legacyCode));
        a.setActive(true);
        return glAccountRepository.save(a);
    }

    private String defaultName(GlAccountCode code) {
        return switch (code) {
            case CASH -> "Cash";
            case AR -> "Accounts Receivable";
            case AP -> "Accounts Payable";
            case TAX_PAYABLE -> "Tax Payable";
            case TAX_RECEIVABLE -> "Tax Receivable";
            case REVENUE -> "Revenue";
            case EXPENSE -> "Expense";
            case INVENTORY -> "Inventory";
            case ADJUSTMENT -> "Adjustment";
        };
    }

    private GlAccountType defaultType(GlAccountCode code) {
        return switch (code) {
            case CASH, AR, TAX_RECEIVABLE, INVENTORY -> GlAccountType.ASSET;
            case AP, TAX_PAYABLE -> GlAccountType.LIABILITY;
            case REVENUE -> GlAccountType.REVENUE;
            case EXPENSE, ADJUSTMENT -> GlAccountType.EXPENSE;
        };
    }
}
