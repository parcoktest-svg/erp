CREATE TABLE IF NOT EXISTS core_attachment (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    company_id BIGINT NOT NULL,

    ref_type VARCHAR(64) NOT NULL,
    ref_id BIGINT NOT NULL,

    name VARCHAR(255) NULL,
    original_file_name VARCHAR(255) NOT NULL,
    stored_file_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(255) NULL,
    size_bytes BIGINT NOT NULL,
    storage_path VARCHAR(1024) NOT NULL,

    PRIMARY KEY (id),
    KEY idx_core_attachment_company (company_id),
    KEY idx_core_attachment_ref (ref_type, ref_id)
);
