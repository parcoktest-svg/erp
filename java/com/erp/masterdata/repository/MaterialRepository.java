package com.erp.masterdata.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.masterdata.entity.Material;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByCompanyId(Long companyId);

    boolean existsByCompanyIdAndCodeIgnoreCase(Long companyId, String code);

    boolean existsByCompanyIdAndCodeIgnoreCaseAndIdNot(Long companyId, String code, Long id);
}
