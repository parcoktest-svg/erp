package com.erp.masterdata.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.entity.Company;
import com.erp.core.repository.CompanyRepository;
import com.erp.masterdata.entity.Uom;
import com.erp.masterdata.repository.UomRepository;

@Service
public class UomService {

    private final UomRepository uomRepository;
    private final CompanyRepository companyRepository;

    public UomService(UomRepository uomRepository, CompanyRepository companyRepository) {
        this.uomRepository = uomRepository;
        this.companyRepository = companyRepository;
    }

    public List<Uom> listByCompany(Long companyId) {
        return uomRepository.findByCompanyId(companyId);
    }

    @Transactional
    public Uom create(Long companyId, Uom uom) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        String code = uom.getCode() != null ? uom.getCode().trim() : null;
        uom.setCode(code);
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Code is required");
        }
        if (uomRepository.existsByCompanyIdAndCodeIgnoreCase(companyId, code)) {
            throw new IllegalArgumentException("UoM code already exists: " + code);
        }

        uom.setCompany(company);
        return uomRepository.save(uom);
    }

    @Transactional
    public Uom update(Long companyId, Long uomId, Uom patch) {
        Uom existing = uomRepository.findById(uomId)
                .orElseThrow(() -> new IllegalArgumentException("UoM not found"));
        if (existing.getCompany() == null || existing.getCompany().getId() == null || !existing.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("UoM company mismatch");
        }

        String code = patch.getCode() != null ? patch.getCode().trim() : null;
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Code is required");
        }
        if (uomRepository.existsByCompanyIdAndCodeIgnoreCaseAndIdNot(companyId, code, existing.getId())) {
            throw new IllegalArgumentException("UoM code already exists: " + code);
        }

        existing.setCode(code);
        existing.setName(patch.getName());
        existing.setActive(patch.isActive());
        return uomRepository.save(existing);
    }

    @Transactional
    public void delete(Long companyId, Long uomId) {
        Uom existing = uomRepository.findById(uomId)
                .orElseThrow(() -> new IllegalArgumentException("UoM not found"));
        if (existing.getCompany() == null || existing.getCompany().getId() == null || !existing.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("UoM company mismatch");
        }
        uomRepository.delete(existing);
    }
}
