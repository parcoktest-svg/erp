package com.erp.finance.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.finance.entity.BankStatementLine;

public interface BankStatementLineRepository extends JpaRepository<BankStatementLine, Long> {

    List<BankStatementLine> findByBankStatementId(Long bankStatementId);
}
