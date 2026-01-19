package com.erp.finance.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.finance.entity.BankAccount;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {

    List<BankAccount> findByCompanyId(Long companyId);
}
