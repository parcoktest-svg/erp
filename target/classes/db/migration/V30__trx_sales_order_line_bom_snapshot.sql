CREATE TABLE IF NOT EXISTS trx_sales_order_line_bom (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    sales_order_line_id BIGINT NOT NULL,
    source_bom_id BIGINT NULL,
    source_bom_version INT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uk_trx_sol_bom_line (sales_order_line_id),
    KEY idx_trx_sol_bom_line (sales_order_line_id),
    KEY idx_trx_sol_bom_source_bom (source_bom_id)
);

CREATE TABLE IF NOT EXISTS trx_sales_order_line_bom_line (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    sales_order_line_bom_id BIGINT NOT NULL,
    component_product_id BIGINT NOT NULL,
    qty DECIMAL(19,2) NOT NULL,

    PRIMARY KEY (id),
    KEY idx_trx_sol_bomline_bom (sales_order_line_bom_id),
    KEY idx_trx_sol_bomline_component (component_product_id),
    CONSTRAINT fk_trx_sol_bomline_bom FOREIGN KEY (sales_order_line_bom_id) REFERENCES trx_sales_order_line_bom(id)
);
