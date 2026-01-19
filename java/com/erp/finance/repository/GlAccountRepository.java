package com.erp.finance.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.finance.entity.GlAccount;

public interface GlAccountRepository extends JpaRepository<GlAccount, Long> {

    List<GlAccount> findByCompanyId(Long companyId);

    Optional<GlAccount> findByCompanyIdAndCode(Long companyId, String code);
}
