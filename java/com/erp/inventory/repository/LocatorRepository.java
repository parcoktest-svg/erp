package com.erp.inventory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.inventory.entity.Locator;

public interface LocatorRepository extends JpaRepository<Locator, Long> {
    List<Locator> findByCompanyId(Long companyId);
    List<Locator> findByWarehouseId(Long warehouseId);
}
