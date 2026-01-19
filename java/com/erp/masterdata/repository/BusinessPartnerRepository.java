package com.erp.masterdata.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.masterdata.entity.BusinessPartner;

public interface BusinessPartnerRepository extends JpaRepository<BusinessPartner, Long> {
    List<BusinessPartner> findByCompanyId(Long companyId);
}
