-- Idempotent migration: add columns only if missing

SET @c1_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'fin_journal_entry'
    AND COLUMN_NAME = 'source_document_type'
);

SET @sql_add_c1 := IF(
  @c1_exists = 0,
  'ALTER TABLE fin_journal_entry ADD COLUMN source_document_type VARCHAR(50) NULL',
  'SELECT 1'
);

PREPARE stmt_add_c1 FROM @sql_add_c1;
EXECUTE stmt_add_c1;
DEALLOCATE PREPARE stmt_add_c1;

SET @c2_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'fin_journal_entry'
    AND COLUMN_NAME = 'source_document_no'
);

SET @sql_add_c2 := IF(
  @c2_exists = 0,
  'ALTER TABLE fin_journal_entry ADD COLUMN source_document_no VARCHAR(255) NULL',
  'SELECT 1'
);

PREPARE stmt_add_c2 FROM @sql_add_c2;
EXECUTE stmt_add_c2;
DEALLOCATE PREPARE stmt_add_c2;
