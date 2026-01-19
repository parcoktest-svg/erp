package com.erp.finance.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.erp.finance.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByCompanyId(Long companyId);
    List<Payment> findByCompanyIdAndInvoiceIdIsNull(Long companyId);
    List<Payment> findByInvoiceId(Long invoiceId);

    @Query("""
            select p
            from Payment p
            where p.company.id = :companyId
              and p.paymentDate >= :fromDate
              and p.paymentDate <= :toDate
              and p.amount = :amount
            order by p.paymentDate desc
            """)
    List<Payment> findMatchesByDateAndAmount(
            @Param("companyId") Long companyId,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            @Param("amount") BigDecimal amount);
}
