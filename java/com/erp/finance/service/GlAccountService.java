package com.erp.finance.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.entity.Company;
import com.erp.core.repository.CompanyRepository;
import com.erp.finance.entity.GlAccount;
import com.erp.finance.model.GlAccountType;
import com.erp.finance.repository.GlAccountRepository;
import com.erp.finance.request.CreateGlAccountRequest;

@Service
public class GlAccountService {

    private final GlAccountRepository glAccountRepository;
    private final CompanyRepository companyRepository;

    public GlAccountService(GlAccountRepository glAccountRepository, CompanyRepository companyRepository) {
        this.glAccountRepository = glAccountRepository;
        this.companyRepository = companyRepository;
    }

    public List<GlAccount> listByCompany(Long companyId) {
        return glAccountRepository.findByCompanyId(companyId);
    }

    @Transactional
    public GlAccount create(Long companyId, CreateGlAccountRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        glAccountRepository.findByCompanyIdAndCode(companyId, request.getCode())
                .ifPresent(a -> {
                    throw new IllegalArgumentException("GL Account code already exists");
                });

        GlAccount a = new GlAccount();
        a.setCompany(company);
        a.setCode(request.getCode());
        a.setName(request.getName());
        a.setType(request.getType());
        if (request.getActive() != null) {
            a.setActive(request.getActive());
        }

        return glAccountRepository.save(a);
    }

    @Transactional
    public void seedDefaults(Long companyId) {
        upsert(companyId, "1000", "Cash", GlAccountType.ASSET);
        upsert(companyId, "1100", "Accounts Receivable", GlAccountType.ASSET);
        upsert(companyId, "2000", "Accounts Payable", GlAccountType.LIABILITY);
        upsert(companyId, "2100", "Tax Payable", GlAccountType.LIABILITY);
        upsert(companyId, "1200", "Tax Receivable", GlAccountType.ASSET);
        upsert(companyId, "4000", "Revenue", GlAccountType.REVENUE);
        upsert(companyId, "5000", "Expense", GlAccountType.EXPENSE);
    }

    private GlAccount upsert(Long companyId, String code, String name, GlAccountType type) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        GlAccount a = glAccountRepository.findByCompanyIdAndCode(companyId, code)
                .orElseGet(GlAccount::new);

        a.setCompany(company);
        a.setCode(code);
        a.setName(name);
        a.setType(type);
        a.setActive(true);

        return glAccountRepository.save(a);
    }
}
