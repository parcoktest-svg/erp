package com.erp.inventory.repository;

import java.util.List;
import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.erp.inventory.entity.StockTransaction;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
    List<StockTransaction> findByCompanyId(Long companyId);
    List<StockTransaction> findByLocatorIdAndProductId(Long locatorId, Long productId);

    @Query("select coalesce(sum(t.qty), 0) from StockTransaction t where t.locator.id = :locatorId and t.product.id = :productId")
    BigDecimal sumQtyByLocatorAndProduct(@Param("locatorId") Long locatorId, @Param("productId") Long productId);

    @Query("select t.product.id, coalesce(sum(t.qty), 0) from StockTransaction t where t.company.id = :companyId and t.locator.id = :locatorId group by t.product.id")
    List<Object[]> sumQtyByLocatorGroupedByProduct(@Param("companyId") Long companyId, @Param("locatorId") Long locatorId);
}
