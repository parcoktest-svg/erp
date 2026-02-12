package com.erp.masterdata.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.entity.Company;
import com.erp.core.repository.CompanyRepository;
import com.erp.masterdata.entity.Material;
import com.erp.masterdata.entity.Uom;
import com.erp.masterdata.repository.MaterialRepository;
import com.erp.masterdata.repository.UomRepository;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final CompanyRepository companyRepository;
    private final UomRepository uomRepository;

    public MaterialService(MaterialRepository materialRepository, CompanyRepository companyRepository, UomRepository uomRepository) {
        this.materialRepository = materialRepository;
        this.companyRepository = companyRepository;
        this.uomRepository = uomRepository;
    }

    public List<Material> listByCompany(Long companyId) {
        return materialRepository.findByCompanyId(companyId);
    }

    @Transactional
    public Material create(Long companyId, Long uomId, Material material) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));
        Uom uom = uomRepository.findById(uomId)
                .orElseThrow(() -> new IllegalArgumentException("UOM not found"));

        String code = material.getCode() != null ? material.getCode().trim() : null;
        material.setCode(code);
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Code is required");
        }
        if (materialRepository.existsByCompanyIdAndCodeIgnoreCase(companyId, code)) {
            throw new IllegalArgumentException("Material code already exists: " + code);
        }

        material.setCompany(company);
        material.setUom(uom);

        return materialRepository.save(material);
    }

    @Transactional
    public Material update(Long companyId, Long materialId, Long uomId, Material patch) {
        Material existing = materialRepository.findById(materialId)
                .orElseThrow(() -> new IllegalArgumentException("Material not found"));
        if (existing.getCompany() == null || existing.getCompany().getId() == null || !existing.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Material company mismatch");
        }

        Uom uom = uomRepository.findById(uomId)
                .orElseThrow(() -> new IllegalArgumentException("UOM not found"));

        String code = patch.getCode() != null ? patch.getCode().trim() : null;
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Code is required");
        }
        if (materialRepository.existsByCompanyIdAndCodeIgnoreCaseAndIdNot(companyId, code, existing.getId())) {
            throw new IllegalArgumentException("Material code already exists: " + code);
        }

        existing.setCode(code);
        existing.setName(patch.getName());
        existing.setUom(uom);
        existing.setActive(patch.isActive());
        return materialRepository.save(existing);
    }

    @Transactional
    public void delete(Long companyId, Long materialId) {
        Material existing = materialRepository.findById(materialId)
                .orElseThrow(() -> new IllegalArgumentException("Material not found"));
        if (existing.getCompany() == null || existing.getCompany().getId() == null || !existing.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Material company mismatch");
        }
        materialRepository.delete(existing);
    }
}
