package com.erp.masterdata.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.masterdata.entity.Uom;

public interface UomRepository extends JpaRepository<Uom, Long> {
    List<Uom> findByCompanyId(Long companyId);

    boolean existsByCompanyIdAndCodeIgnoreCase(Long companyId, String code);

    boolean existsByCompanyIdAndCodeIgnoreCaseAndIdNot(Long companyId, String code, Long id);
}
