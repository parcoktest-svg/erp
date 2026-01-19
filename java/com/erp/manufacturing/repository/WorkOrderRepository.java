package com.erp.manufacturing.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.core.model.DocumentStatus;
import com.erp.manufacturing.entity.WorkOrder;

public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
    List<WorkOrder> findByCompanyId(Long companyId);

    List<WorkOrder> findByCompanyIdAndStatusNot(Long companyId, DocumentStatus status);

    boolean existsByBom_Id(Long bomId);
}
