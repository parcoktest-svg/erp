ALTER TABLE fin_invoice
    ADD COLUMN purchase_order_id BIGINT NULL;

CREATE INDEX idx_fin_invoice_purchase_order_id ON fin_invoice (purchase_order_id);
