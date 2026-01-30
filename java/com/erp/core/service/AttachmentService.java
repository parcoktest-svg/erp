package com.erp.core.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.erp.core.entity.Attachment;
import com.erp.core.repository.AttachmentRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;

    private final Path baseDir;

    public AttachmentService(AttachmentRepository attachmentRepository, @Value("${app.attachments.base-dir:uploads}") String baseDir) {
        this.attachmentRepository = attachmentRepository;
        this.baseDir = Paths.get(baseDir);
    }

    public List<Attachment> list(Long companyId, String refType, Long refId) {
        return attachmentRepository.findByCompanyIdAndRefTypeAndRefIdOrderByCreatedAtDesc(companyId, refType, refId);
    }

    public Attachment upload(Long companyId, String refType, Long refId, String name, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("file is required");
        }

        String original = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
        String ext = "";
        int idx = original.lastIndexOf('.');
        if (idx >= 0 && idx < original.length() - 1) {
            ext = original.substring(idx);
        }

        String stored = UUID.randomUUID().toString().replace("-", "") + ext;
        Path targetDir = baseDir.resolve("companies").resolve(String.valueOf(companyId)).resolve("refs").resolve(refType).resolve(String.valueOf(refId));

        try {
            Files.createDirectories(targetDir);
            Path target = targetDir.resolve(stored);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            Attachment att = new Attachment();
            att.setCompanyId(companyId);
            att.setRefType(refType);
            att.setRefId(refId);
            att.setName(name);
            att.setOriginalFileName(original);
            att.setStoredFileName(stored);
            att.setContentType(file.getContentType());
            att.setSizeBytes(file.getSize());
            att.setStoragePath(target.toAbsolutePath().toString());
            return attachmentRepository.save(att);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store attachment", e);
        }
    }

    public Resource loadAsResource(Long companyId, Long attachmentId) {
        Attachment att = attachmentRepository.findByIdAndCompanyId(attachmentId, companyId)
                .orElseThrow(() -> new EntityNotFoundException("Attachment not found"));

        try {
            Path path = Paths.get(att.getStoragePath());
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new EntityNotFoundException("File not found");
            }
            return resource;
        } catch (Exception e) {
            throw new RuntimeException("Failed to read attachment", e);
        }
    }

    public Attachment get(Long companyId, Long attachmentId) {
        return attachmentRepository.findByIdAndCompanyId(attachmentId, companyId)
                .orElseThrow(() -> new EntityNotFoundException("Attachment not found"));
    }

    public void delete(Long companyId, Long attachmentId) {
        Attachment att = attachmentRepository.findByIdAndCompanyId(attachmentId, companyId)
                .orElseThrow(() -> new EntityNotFoundException("Attachment not found"));

        try {
            if (att.getStoragePath() != null) {
                Files.deleteIfExists(Paths.get(att.getStoragePath()));
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete attachment file", e);
        }

        attachmentRepository.delete(att);
    }
}
