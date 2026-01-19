ALTER TABLE trx_sales_order
    ADD COLUMN buyer_po VARCHAR(64) NULL,
    ADD COLUMN department_id BIGINT NULL,
    ADD COLUMN employee_id BIGINT NULL,
    ADD COLUMN in_charge VARCHAR(255) NULL,
    ADD COLUMN payment_condition VARCHAR(255) NULL,
    ADD COLUMN delivery_place VARCHAR(255) NULL,
    ADD COLUMN forwarding_warehouse_id BIGINT NULL,
    ADD COLUMN memo VARCHAR(255) NULL;

ALTER TABLE trx_sales_order_line
    ADD COLUMN description VARCHAR(255) NULL,
    ADD COLUMN unit VARCHAR(64) NULL,
    ADD COLUMN size VARCHAR(64) NULL,
    ADD COLUMN national_size VARCHAR(64) NULL,
    ADD COLUMN style VARCHAR(64) NULL,
    ADD COLUMN cutting_no VARCHAR(64) NULL,
    ADD COLUMN color VARCHAR(64) NULL,
    ADD COLUMN destination VARCHAR(64) NULL,
    ADD COLUMN supply_amount DECIMAL(38,2) NULL,
    ADD COLUMN vat_amount DECIMAL(38,2) NULL,
    ADD COLUMN fob_price DECIMAL(38,2) NULL,
    ADD COLUMN ldp_price DECIMAL(38,2) NULL,
    ADD COLUMN cmt_cost DECIMAL(38,2) NULL,
    ADD COLUMN cm_cost DECIMAL(38,2) NULL,
    ADD COLUMN fabric_eta DATE NULL,
    ADD COLUMN fabric_etd DATE NULL;

CREATE TABLE IF NOT EXISTS trx_sales_order_delivery_schedule (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    sales_order_id BIGINT NOT NULL,
    delivery_date DATE NULL,
    ship_mode VARCHAR(64) NULL,
    factory VARCHAR(128) NULL,
    remark VARCHAR(255) NULL,
    file_path VARCHAR(255) NULL,

    PRIMARY KEY (id),
    KEY idx_trx_so_sched_so (sales_order_id)
);
