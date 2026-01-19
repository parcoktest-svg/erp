package com.erp.masterdata.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.masterdata.entity.Warehouse;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    List<Warehouse> findByCompanyId(Long companyId);

    boolean existsByCompanyIdAndCodeIgnoreCase(Long companyId, String code);

    boolean existsByCompanyIdAndCodeIgnoreCaseAndIdNot(Long companyId, String code, Long id);
}
