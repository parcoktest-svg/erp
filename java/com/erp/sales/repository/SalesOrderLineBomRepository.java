package com.erp.sales.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.sales.entity.SalesOrderLineBom;

public interface SalesOrderLineBomRepository extends JpaRepository<SalesOrderLineBom, Long> {

    Optional<SalesOrderLineBom> findBySalesOrderLine_Id(Long salesOrderLineId);

    List<SalesOrderLineBom> findBySalesOrderLine_SalesOrder_Id(Long salesOrderId);
}
