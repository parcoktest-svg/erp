package com.erp.inventory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.inventory.entity.InventoryMovement;

public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {
    List<InventoryMovement> findByCompanyId(Long companyId);
}
