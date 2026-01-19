CREATE TABLE IF NOT EXISTS mfg_bom (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    company_id BIGINT NOT NULL,
    org_id BIGINT NULL,
    product_id BIGINT NOT NULL,
    version INT NOT NULL,
    active BIT NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uk_mfg_bom_company_product_version (company_id, product_id, version),
    KEY idx_mfg_bom_company (company_id),
    KEY idx_mfg_bom_product (product_id),
    KEY idx_mfg_bom_org (org_id)
);

CREATE TABLE IF NOT EXISTS mfg_bom_line (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    bom_id BIGINT NOT NULL,
    component_product_id BIGINT NOT NULL,
    qty DECIMAL(19,2) NOT NULL,

    PRIMARY KEY (id),
    KEY idx_mfg_bom_line_bom (bom_id),
    KEY idx_mfg_bom_line_component (component_product_id),
    CONSTRAINT fk_mfg_bom_line_bom FOREIGN KEY (bom_id) REFERENCES mfg_bom(id)
);
