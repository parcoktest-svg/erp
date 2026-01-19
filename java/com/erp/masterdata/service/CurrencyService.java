package com.erp.masterdata.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.entity.Company;
import com.erp.core.repository.CompanyRepository;
import com.erp.masterdata.entity.Currency;
import com.erp.masterdata.repository.CurrencyRepository;

@Service
public class CurrencyService {

    private final CurrencyRepository currencyRepository;
    private final CompanyRepository companyRepository;

    public CurrencyService(CurrencyRepository currencyRepository, CompanyRepository companyRepository) {
        this.currencyRepository = currencyRepository;
        this.companyRepository = companyRepository;
    }

    public List<Currency> listByCompany(Long companyId) {
        return currencyRepository.findByCompanyId(companyId);
    }

    @Transactional
    public Currency create(Long companyId, Currency currency) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        String code = currency.getCode() != null ? currency.getCode().trim() : null;
        currency.setCode(code);
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Code is required");
        }
        if (currencyRepository.existsByCompanyIdAndCodeIgnoreCase(companyId, code)) {
            throw new IllegalArgumentException("Currency code already exists: " + code);
        }

        currency.setCompany(company);
        return currencyRepository.save(currency);
    }

    @Transactional
    public Currency update(Long companyId, Long currencyId, Currency patch) {
        Currency existing = currencyRepository.findById(currencyId)
                .orElseThrow(() -> new IllegalArgumentException("Currency not found"));
        if (existing.getCompany() == null || existing.getCompany().getId() == null || !existing.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Currency company mismatch");
        }

        String code = patch.getCode() != null ? patch.getCode().trim() : null;
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Code is required");
        }
        if (currencyRepository.existsByCompanyIdAndCodeIgnoreCaseAndIdNot(companyId, code, existing.getId())) {
            throw new IllegalArgumentException("Currency code already exists: " + code);
        }

        existing.setCode(code);
        existing.setName(patch.getName());
        existing.setPrecisionValue(patch.getPrecisionValue());
        existing.setActive(patch.isActive());
        return currencyRepository.save(existing);
    }

    @Transactional
    public void delete(Long companyId, Long currencyId) {
        Currency existing = currencyRepository.findById(currencyId)
                .orElseThrow(() -> new IllegalArgumentException("Currency not found"));
        if (existing.getCompany() == null || existing.getCompany().getId() == null || !existing.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Currency company mismatch");
        }
        currencyRepository.delete(existing);
    }
}
