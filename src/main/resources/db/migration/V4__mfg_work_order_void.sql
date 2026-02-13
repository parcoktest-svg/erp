-- Idempotent migration: add columns only if missing

SET @c1_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'mfg_work_order'
    AND COLUMN_NAME = 'issue_reversal_movement_doc_no'
);

SET @sql_add_c1 := IF(
  @c1_exists = 0,
  'ALTER TABLE mfg_work_order ADD COLUMN issue_reversal_movement_doc_no VARCHAR(255) NULL',
  'SELECT 1'
);

PREPARE stmt_add_c1 FROM @sql_add_c1;
EXECUTE stmt_add_c1;
DEALLOCATE PREPARE stmt_add_c1;

SET @c2_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'mfg_work_order'
    AND COLUMN_NAME = 'receipt_reversal_movement_doc_no'
);

SET @sql_add_c2 := IF(
  @c2_exists = 0,
  'ALTER TABLE mfg_work_order ADD COLUMN receipt_reversal_movement_doc_no VARCHAR(255) NULL',
  'SELECT 1'
);

PREPARE stmt_add_c2 FROM @sql_add_c2;
EXECUTE stmt_add_c2;
DEALLOCATE PREPARE stmt_add_c2;
