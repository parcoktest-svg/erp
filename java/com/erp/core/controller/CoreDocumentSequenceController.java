package com.erp.core.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.erp.core.dto.DocumentSequenceDto;
import com.erp.core.entity.DocumentSequence;
import com.erp.core.model.DocumentType;
import com.erp.core.service.DocumentNoService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/api/core/companies/{companyId}/sequences")
public class CoreDocumentSequenceController {

    private final DocumentNoService documentNoService;

    public CoreDocumentSequenceController(DocumentNoService documentNoService) {
        this.documentNoService = documentNoService;
    }

    @GetMapping("/next")
    public ResponseEntity<String> next(@PathVariable Long companyId, @RequestParam DocumentType documentType) {
        return ResponseEntity.ok(documentNoService.nextDocumentNo(companyId, documentType));
    }

    @PostMapping("/{documentType}")
    public ResponseEntity<DocumentSequenceDto> upsert(
            @PathVariable Long companyId,
            @PathVariable DocumentType documentType,
            @Valid @RequestBody UpsertSequenceRequest request) {

        DocumentSequence seqReq = new DocumentSequence();
        seqReq.setPrefix(request.getPrefix());
        seqReq.setNextNumber(request.getNextNumber());
        seqReq.setPadding(request.getPadding());

        DocumentSequence saved = documentNoService.upsertSequence(companyId, documentType, seqReq);
        return ResponseEntity.ok(toDto(saved));
    }

    private DocumentSequenceDto toDto(DocumentSequence seq) {
        DocumentSequenceDto dto = new DocumentSequenceDto();
        dto.setId(seq.getId());
        dto.setCompanyId(seq.getCompany() != null ? seq.getCompany().getId() : null);
        dto.setDocumentType(seq.getDocumentType());
        dto.setPrefix(seq.getPrefix());
        dto.setNextNumber(seq.getNextNumber());
        dto.setPadding(seq.getPadding());
        return dto;
    }

    public static class UpsertSequenceRequest {
        @NotBlank
        private String prefix;

        @Min(1)
        private long nextNumber;

        @Min(1)
        private int padding;

        public String getPrefix() {
            return prefix;
        }

        public void setPrefix(String prefix) {
            this.prefix = prefix;
        }

        public long getNextNumber() {
            return nextNumber;
        }

        public void setNextNumber(long nextNumber) {
            this.nextNumber = nextNumber;
        }

        public int getPadding() {
            return padding;
        }

        public void setPadding(int padding) {
            this.padding = padding;
        }
    }
}
