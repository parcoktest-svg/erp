package com.erp.masterdata.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.entity.Company;
import com.erp.core.repository.CompanyRepository;
import com.erp.masterdata.entity.TaxRate;
import com.erp.masterdata.repository.TaxRateRepository;

@Service
public class TaxRateService {

    private final TaxRateRepository taxRateRepository;
    private final CompanyRepository companyRepository;

    public TaxRateService(TaxRateRepository taxRateRepository, CompanyRepository companyRepository) {
        this.taxRateRepository = taxRateRepository;
        this.companyRepository = companyRepository;
    }

    public List<TaxRate> listByCompany(Long companyId) {
        return taxRateRepository.findByCompanyId(companyId);
    }

    @Transactional
    public TaxRate create(Long companyId, TaxRate taxRate) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));
        taxRate.setCompany(company);
        return taxRateRepository.save(taxRate);
    }
}
