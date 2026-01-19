package com.erp.core.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.entity.Company;
import com.erp.core.entity.DocumentSequence;
import com.erp.core.model.DocumentType;
import com.erp.core.repository.CompanyRepository;
import com.erp.core.repository.DocumentSequenceRepository;

@Service
public class DocumentNoService {

    private final DocumentSequenceRepository documentSequenceRepository;
    private final CompanyRepository companyRepository;

    public DocumentNoService(DocumentSequenceRepository documentSequenceRepository, CompanyRepository companyRepository) {
        this.documentSequenceRepository = documentSequenceRepository;
        this.companyRepository = companyRepository;
    }

    @Transactional
    public String nextDocumentNo(Long companyId, DocumentType documentType) {
        DocumentSequence seq = documentSequenceRepository.findByCompanyIdAndDocumentType(companyId, documentType)
                .orElseGet(() -> createDefaultSequence(companyId, documentType));

        long number = seq.getNextNumber();
        String formatted = seq.getPrefix() + String.format("%0" + seq.getPadding() + "d", number);

        seq.setNextNumber(number + 1);
        documentSequenceRepository.save(seq);

        return formatted;
    }

    @Transactional
    public DocumentSequence upsertSequence(Long companyId, DocumentType documentType, DocumentSequence request) {
        DocumentSequence seq = documentSequenceRepository.findByCompanyIdAndDocumentType(companyId, documentType)
                .orElseGet(DocumentSequence::new);

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        seq.setCompany(company);
        seq.setDocumentType(documentType);
        seq.setPrefix(request.getPrefix());
        seq.setNextNumber(request.getNextNumber());
        seq.setPadding(request.getPadding());

        return documentSequenceRepository.save(seq);
    }

    private DocumentSequence createDefaultSequence(Long companyId, DocumentType documentType) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        DocumentSequence seq = new DocumentSequence();
        seq.setCompany(company);
        seq.setDocumentType(documentType);
        seq.setPrefix(defaultPrefix(documentType));
        seq.setNextNumber(1L);
        seq.setPadding(5);

        return documentSequenceRepository.save(seq);
    }

    private String defaultPrefix(DocumentType documentType) {
        return switch (documentType) {
            case SALES_ORDER -> "SO-";
            case PURCHASE_ORDER -> "PO-";
            case INVOICE -> "INV-";
            case PAYMENT -> "PAY-";
            case INVENTORY_MOVEMENT -> "MM-";
            case JOURNAL_ENTRY -> "JE-";
            case WORK_ORDER -> "WO-";
            case BANK_STATEMENT -> "BS-";
            case INVENTORY_ADJUSTMENT -> "IA-";
        };
    }
}
