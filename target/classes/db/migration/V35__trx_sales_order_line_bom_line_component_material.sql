-- Fix legacy NOT NULL constraint that blocks BOM snapshot saving after migrating to component_material_id
-- 1) Make legacy component_product_id nullable
-- 2) Add new component_material_id column (nullable for backward compatibility)
--
-- NOTE: Existing data migration from product->material is handled separately.

ALTER TABLE trx_sales_order_line_bom_line
    MODIFY COLUMN component_product_id BIGINT NULL;

-- Add component_material_id if missing
SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'trx_sales_order_line_bom_line'
    AND COLUMN_NAME = 'component_material_id'
);

SET @sql_add_col := IF(
  @col_exists = 0,
  'ALTER TABLE trx_sales_order_line_bom_line ADD COLUMN component_material_id BIGINT NULL',
  'SELECT 1'
);

PREPARE stmt_add_col FROM @sql_add_col;
EXECUTE stmt_add_col;
DEALLOCATE PREPARE stmt_add_col;

-- Add index if missing
SET @idx_exists := (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'trx_sales_order_line_bom_line'
    AND INDEX_NAME = 'idx_trx_sol_bomline_component_material'
);

SET @sql_add_idx := IF(
  @idx_exists = 0,
  'CREATE INDEX idx_trx_sol_bomline_component_material ON trx_sales_order_line_bom_line(component_material_id)',
  'SELECT 1'
);

PREPARE stmt_add_idx FROM @sql_add_idx;
EXECUTE stmt_add_idx;
DEALLOCATE PREPARE stmt_add_idx;
