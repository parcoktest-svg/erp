package com.erp.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.sales.entity.SalesOrder;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
    List<SalesOrder> findByCompanyId(Long companyId);
}
