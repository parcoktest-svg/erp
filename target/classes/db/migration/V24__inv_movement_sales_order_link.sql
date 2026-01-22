ALTER TABLE inv_movement
    ADD COLUMN sales_order_id BIGINT NULL;

CREATE INDEX idx_inv_movement_sales_order_id ON inv_movement (sales_order_id);
