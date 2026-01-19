package com.erp.core.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.entity.Company;
import com.erp.core.entity.Org;
import com.erp.core.repository.CompanyRepository;
import com.erp.core.repository.OrgRepository;

@Service
public class OrgService {

    private final OrgRepository orgRepository;
    private final CompanyRepository companyRepository;

    public OrgService(OrgRepository orgRepository, CompanyRepository companyRepository) {
        this.orgRepository = orgRepository;
        this.companyRepository = companyRepository;
    }

    public List<Org> findByCompany(Long companyId) {
        return orgRepository.findByCompanyId(companyId);
    }

    @Transactional
    public Org create(Long companyId, Org org) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));
        org.setCompany(company);
        return orgRepository.save(org);
    }
}
