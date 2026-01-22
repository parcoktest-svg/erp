ALTER TABLE fin_invoice_line
    ADD COLUMN purchase_order_line_id BIGINT NULL;

CREATE INDEX idx_fin_invoice_line_purchase_order_line_id ON fin_invoice_line (purchase_order_line_id);
