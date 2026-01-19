CREATE TABLE IF NOT EXISTS mfg_work_order (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    company_id BIGINT NOT NULL,
    org_id BIGINT NULL,
    document_no VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    work_date DATE NOT NULL,
    bom_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    qty DECIMAL(19,2) NOT NULL,
    from_locator_id BIGINT NOT NULL,
    to_locator_id BIGINT NOT NULL,
    description VARCHAR(255) NULL,
    issue_movement_doc_no VARCHAR(255) NULL,
    receipt_movement_doc_no VARCHAR(255) NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uk_mfg_work_order_document_no (document_no),
    KEY idx_mfg_work_order_company (company_id),
    KEY idx_mfg_work_order_bom (bom_id),
    KEY idx_mfg_work_order_product (product_id),
    KEY idx_mfg_work_order_from_locator (from_locator_id),
    KEY idx_mfg_work_order_to_locator (to_locator_id)
);
