package com.erp.finance.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.finance.entity.BankStatement;

public interface BankStatementRepository extends JpaRepository<BankStatement, Long> {

    List<BankStatement> findByCompanyId(Long companyId);
}
