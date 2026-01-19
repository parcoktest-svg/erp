package com.erp.inventory.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.inventory.entity.InventoryOnHand;

public interface InventoryOnHandRepository extends JpaRepository<InventoryOnHand, Long> {
    Optional<InventoryOnHand> findByCompanyIdAndProductIdAndLocatorId(Long companyId, Long productId, Long locatorId);
}
