package com.erp.inventory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.inventory.entity.InventoryAdjustmentLine;

public interface InventoryAdjustmentLineRepository extends JpaRepository<InventoryAdjustmentLine, Long> {
    List<InventoryAdjustmentLine> findByAdjustmentId(Long adjustmentId);
}
