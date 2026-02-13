-- Fix failed migration V5
-- Make this migration idempotent and MySQL-compatible.
-- Do NOT drop indexes/columns because they may be referenced by an existing FK.

-- Ensure gl_account_id column exists
SET @gl_col_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'fin_journal_line'
    AND COLUMN_NAME = 'gl_account_id'
);

SET @sql_add_gl_col := IF(
  @gl_col_exists = 0,
  'ALTER TABLE fin_journal_line ADD COLUMN gl_account_id BIGINT NULL',
  'SELECT 1'
);

PREPARE stmt_add_gl_col FROM @sql_add_gl_col;
EXECUTE stmt_add_gl_col;
DEALLOCATE PREPARE stmt_add_gl_col;

-- Ensure index exists
SET @gl_idx_exists := (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'fin_journal_line'
    AND INDEX_NAME = 'idx_fin_journal_line_gl_account'
);

SET @sql_add_gl_idx := IF(
  @gl_idx_exists = 0,
  'ALTER TABLE fin_journal_line ADD KEY idx_fin_journal_line_gl_account (gl_account_id)',
  'SELECT 1'
);

PREPARE stmt_add_gl_idx FROM @sql_add_gl_idx;
EXECUTE stmt_add_gl_idx;
DEALLOCATE PREPARE stmt_add_gl_idx;

-- Ensure FK exists (use ON DELETE SET NULL)
SET @gl_fk_exists := (
  SELECT COUNT(*)
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'fin_journal_line'
    AND CONSTRAINT_NAME = 'fk_fin_journal_line_gl_account'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
);

SET @sql_add_gl_fk := IF(
  @gl_fk_exists = 0,
  'ALTER TABLE fin_journal_line ADD CONSTRAINT fk_fin_journal_line_gl_account FOREIGN KEY (gl_account_id) REFERENCES fin_gl_account(id) ON DELETE SET NULL',
  'SELECT 1'
);

PREPARE stmt_add_gl_fk FROM @sql_add_gl_fk;
EXECUTE stmt_add_gl_fk;
DEALLOCATE PREPARE stmt_add_gl_fk;

-- Clean up any potential orphaned data
UPDATE fin_journal_line
SET gl_account_id = NULL
WHERE gl_account_id IS NOT NULL
  AND gl_account_id NOT IN (SELECT id FROM fin_gl_account);
