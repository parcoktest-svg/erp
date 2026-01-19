package com.erp.purchase.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.purchase.entity.PurchaseOrder;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    List<PurchaseOrder> findByCompanyId(Long companyId);
}
