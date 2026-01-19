ALTER TABLE mfg_work_order
    ADD COLUMN issue_reversal_movement_doc_no VARCHAR(255) NULL;

ALTER TABLE mfg_work_order
    ADD COLUMN receipt_reversal_movement_doc_no VARCHAR(255) NULL;
