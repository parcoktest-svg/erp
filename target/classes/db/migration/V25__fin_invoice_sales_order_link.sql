ALTER TABLE fin_invoice
    ADD COLUMN sales_order_id BIGINT NULL;

CREATE INDEX idx_fin_invoice_sales_order_id ON fin_invoice (sales_order_id);
