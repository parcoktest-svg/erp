ALTER TABLE mfg_work_order
    ADD COLUMN sales_order_line_bom_id BIGINT NULL;

ALTER TABLE mfg_work_order
    MODIFY COLUMN bom_id BIGINT NULL;

CREATE INDEX idx_mfg_work_order_sol_bom ON mfg_work_order(sales_order_line_bom_id);
