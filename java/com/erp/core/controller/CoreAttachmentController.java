package com.erp.core.controller;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.erp.core.dto.AttachmentDto;
import com.erp.core.entity.Attachment;
import com.erp.core.service.AttachmentService;

@RestController
@RequestMapping("/api/core/companies/{companyId}/attachments")
public class CoreAttachmentController {

    private final AttachmentService attachmentService;

    public CoreAttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @GetMapping
    public ResponseEntity<List<AttachmentDto>> list(
            @PathVariable Long companyId,
            @RequestParam String refType,
            @RequestParam Long refId) {
        List<AttachmentDto> result = attachmentService.list(companyId, refType, refId).stream().map(this::toDto).toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AttachmentDto> upload(
            @PathVariable Long companyId,
            @RequestParam String refType,
            @RequestParam Long refId,
            @RequestParam(required = false) String name,
            @RequestParam("file") MultipartFile file) {
        Attachment saved = attachmentService.upload(companyId, refType, refId, name, file);
        return ResponseEntity.ok(toDto(saved));
    }

    @GetMapping("/{attachmentId}/download")
    public ResponseEntity<Resource> download(@PathVariable Long companyId, @PathVariable Long attachmentId) {
        Attachment att = attachmentService.get(companyId, attachmentId);
        Resource resource = attachmentService.loadAsResource(companyId, attachmentId);

        String ct = att.getContentType() != null ? att.getContentType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(ContentDisposition.attachment().filename(att.getOriginalFileName()).build());

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType(ct))
                .body(resource);
    }

    @DeleteMapping("/{attachmentId}")
    public ResponseEntity<Void> delete(@PathVariable Long companyId, @PathVariable Long attachmentId) {
        attachmentService.delete(companyId, attachmentId);
        return ResponseEntity.noContent().build();
    }

    private AttachmentDto toDto(Attachment a) {
        AttachmentDto dto = new AttachmentDto();
        dto.setId(a.getId());
        dto.setCompanyId(a.getCompanyId());
        dto.setRefType(a.getRefType());
        dto.setRefId(a.getRefId());
        dto.setName(a.getName());
        dto.setOriginalFileName(a.getOriginalFileName());
        dto.setContentType(a.getContentType());
        dto.setSizeBytes(a.getSizeBytes());
        dto.setCreatedAt(a.getCreatedAt());
        return dto;
    }
}
