ALTER TABLE trx_sales_order_line
    ADD COLUMN shipped_qty DECIMAL(19,2) NOT NULL DEFAULT 0;

ALTER TABLE trx_purchase_order_line
    ADD COLUMN received_qty DECIMAL(19,2) NOT NULL DEFAULT 0;
