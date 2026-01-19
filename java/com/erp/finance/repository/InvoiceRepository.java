package com.erp.finance.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.core.model.DocumentStatus;
import com.erp.finance.entity.Invoice;
import com.erp.finance.model.InvoiceType;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByCompanyId(Long companyId);

    List<Invoice> findByCompanyIdAndInvoiceTypeAndStatusNotAndOpenAmountGreaterThan(
            Long companyId,
            InvoiceType invoiceType,
            DocumentStatus status,
            BigDecimal openAmount);
}
