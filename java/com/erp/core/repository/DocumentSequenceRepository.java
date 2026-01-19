package com.erp.core.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.core.entity.DocumentSequence;
import com.erp.core.model.DocumentType;

public interface DocumentSequenceRepository extends JpaRepository<DocumentSequence, Long> {
    Optional<DocumentSequence> findByCompanyIdAndDocumentType(Long companyId, DocumentType documentType);
}
