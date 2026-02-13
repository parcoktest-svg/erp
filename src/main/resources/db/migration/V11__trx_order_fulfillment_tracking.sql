-- Idempotent migration: add columns only if missing

SET @sol_col_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'trx_sales_order_line'
    AND COLUMN_NAME = 'shipped_qty'
);

SET @sql_add_sol_col := IF(
  @sol_col_exists = 0,
  'ALTER TABLE trx_sales_order_line ADD COLUMN shipped_qty DECIMAL(19,2) NOT NULL DEFAULT 0',
  'SELECT 1'
);

PREPARE stmt_add_sol_col FROM @sql_add_sol_col;
EXECUTE stmt_add_sol_col;
DEALLOCATE PREPARE stmt_add_sol_col;

SET @pol_col_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'trx_purchase_order_line'
    AND COLUMN_NAME = 'received_qty'
);

SET @sql_add_pol_col := IF(
  @pol_col_exists = 0,
  'ALTER TABLE trx_purchase_order_line ADD COLUMN received_qty DECIMAL(19,2) NOT NULL DEFAULT 0',
  'SELECT 1'
);

PREPARE stmt_add_pol_col FROM @sql_add_pol_col;
EXECUTE stmt_add_pol_col;
DEALLOCATE PREPARE stmt_add_pol_col;
