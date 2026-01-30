package com.erp.core.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.core.entity.Attachment;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    List<Attachment> findByCompanyIdAndRefTypeAndRefIdOrderByCreatedAtDesc(Long companyId, String refType, Long refId);

    Optional<Attachment> findByIdAndCompanyId(Long id, Long companyId);
}
