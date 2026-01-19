package com.erp.inventory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.inventory.entity.InventoryAdjustment;

public interface InventoryAdjustmentRepository extends JpaRepository<InventoryAdjustment, Long> {
    List<InventoryAdjustment> findByCompanyId(Long companyId);
}
