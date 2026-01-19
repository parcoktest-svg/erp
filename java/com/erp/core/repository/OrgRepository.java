package com.erp.core.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.core.entity.Org;

public interface OrgRepository extends JpaRepository<Org, Long> {
    List<Org> findByCompanyId(Long companyId);
}
