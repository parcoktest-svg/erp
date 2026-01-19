ALTER TABLE fin_journal_entry
    ADD COLUMN source_document_type VARCHAR(50) NULL;

ALTER TABLE fin_journal_entry
    ADD COLUMN source_document_no VARCHAR(255) NULL;
