package com.erp.manufacturing.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.manufacturing.entity.Bom;

public interface BomRepository extends JpaRepository<Bom, Long> {

    List<Bom> findByCompanyId(Long companyId);

    Optional<Bom> findByCompanyIdAndProductIdAndVersion(Long companyId, Long productId, Integer version);
}
