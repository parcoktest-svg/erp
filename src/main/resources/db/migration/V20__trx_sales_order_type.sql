ALTER TABLE trx_sales_order
    ADD COLUMN order_type VARCHAR(16) NOT NULL DEFAULT 'DOMESTIC';

UPDATE trx_sales_order
SET order_type = 'DOMESTIC'
WHERE order_type IS NULL OR order_type = '';
