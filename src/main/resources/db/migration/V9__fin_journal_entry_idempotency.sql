ALTER TABLE fin_journal_entry
    ADD KEY idx_fin_je_source (company_id, source_document_type, source_document_no);

ALTER TABLE fin_journal_entry
    ADD CONSTRAINT uk_fin_je_company_source UNIQUE (company_id, source_document_type, source_document_no);
