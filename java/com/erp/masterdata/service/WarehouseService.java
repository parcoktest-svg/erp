package com.erp.masterdata.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.entity.Company;
import com.erp.core.entity.Org;
import com.erp.core.repository.CompanyRepository;
import com.erp.core.repository.OrgRepository;
import com.erp.masterdata.entity.Warehouse;
import com.erp.masterdata.repository.WarehouseRepository;

@Service
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final CompanyRepository companyRepository;
    private final OrgRepository orgRepository;

    public WarehouseService(WarehouseRepository warehouseRepository, CompanyRepository companyRepository, OrgRepository orgRepository) {
        this.warehouseRepository = warehouseRepository;
        this.companyRepository = companyRepository;
        this.orgRepository = orgRepository;
    }

    public List<Warehouse> listByCompany(Long companyId) {
        return warehouseRepository.findByCompanyId(companyId);
    }

    @Transactional
    public Warehouse create(Long companyId, Long orgId, Warehouse warehouse) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        String code = warehouse.getCode() != null ? warehouse.getCode().trim() : null;
        warehouse.setCode(code);
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Code is required");
        }
        if (warehouseRepository.existsByCompanyIdAndCodeIgnoreCase(companyId, code)) {
            throw new IllegalArgumentException("Warehouse code already exists: " + code);
        }

        warehouse.setCompany(company);

        if (orgId != null) {
            Org org = orgRepository.findById(orgId)
                    .orElseThrow(() -> new IllegalArgumentException("Org not found"));
            warehouse.setOrg(org);
        }

        return warehouseRepository.save(warehouse);
    }

    @Transactional
    public Warehouse update(Long companyId, Long warehouseId, Long orgId, Warehouse patch) {
        Warehouse existing = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found"));
        if (existing.getCompany() == null || existing.getCompany().getId() == null || !existing.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Warehouse company mismatch");
        }

        String code = patch.getCode() != null ? patch.getCode().trim() : null;
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Code is required");
        }
        if (warehouseRepository.existsByCompanyIdAndCodeIgnoreCaseAndIdNot(companyId, code, existing.getId())) {
            throw new IllegalArgumentException("Warehouse code already exists: " + code);
        }

        existing.setCode(code);
        existing.setName(patch.getName());
        existing.setActive(patch.isActive());

        if (orgId == null) {
            existing.setOrg(null);
        } else {
            Org org = orgRepository.findById(orgId)
                    .orElseThrow(() -> new IllegalArgumentException("Org not found"));
            existing.setOrg(org);
        }

        return warehouseRepository.save(existing);
    }

    @Transactional
    public void delete(Long companyId, Long warehouseId) {
        Warehouse existing = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found"));
        if (existing.getCompany() == null || existing.getCompany().getId() == null || !existing.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Warehouse company mismatch");
        }
        warehouseRepository.delete(existing);
    }
}
