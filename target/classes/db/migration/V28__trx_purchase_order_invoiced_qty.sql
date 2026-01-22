ALTER TABLE trx_purchase_order_line
    ADD COLUMN invoiced_qty DECIMAL(19,2) NOT NULL DEFAULT 0;
