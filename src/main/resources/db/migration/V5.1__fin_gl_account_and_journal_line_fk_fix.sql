-- Fix failed migration V5
-- This migration repairs the failed foreign key constraint and data consistency issues

-- First, remove any existing failed foreign key constraints
ALTER TABLE fin_journal_line DROP FOREIGN KEY IF EXISTS fk_fin_journal_line_gl_account;

-- Remove the column if it exists to start fresh
ALTER TABLE fin_journal_line DROP COLUMN IF EXISTS gl_account_id;

-- Now recreate the column and constraint properly
ALTER TABLE fin_journal_line
    ADD COLUMN gl_account_id BIGINT NULL;

ALTER TABLE fin_journal_line
    ADD KEY idx_fin_journal_line_gl_account (gl_account_id);

ALTER TABLE fin_journal_line
    ADD CONSTRAINT fk_fin_journal_line_gl_account FOREIGN KEY (gl_account_id) REFERENCES fin_gl_account(id) ON DELETE SET NULL;

-- Clean up any potential orphaned data
UPDATE fin_journal_line SET gl_account_id = NULL WHERE gl_account_id IS NOT NULL AND gl_account_id NOT IN (SELECT id FROM fin_gl_account);
