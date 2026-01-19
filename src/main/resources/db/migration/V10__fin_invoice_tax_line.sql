CREATE TABLE IF NOT EXISTS fin_invoice_tax_line (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    invoice_id BIGINT NOT NULL,
    tax_rate_id BIGINT NULL,

    tax_base DECIMAL(19,2) NOT NULL,
    tax_amount DECIMAL(19,2) NOT NULL,
    rounding_amount DECIMAL(19,2) NOT NULL,

    PRIMARY KEY (id),
    KEY idx_fin_invoice_tax_line_invoice (invoice_id),
    KEY idx_fin_invoice_tax_line_tax_rate (tax_rate_id),
    CONSTRAINT fk_fin_invoice_tax_line_invoice FOREIGN KEY (invoice_id) REFERENCES fin_invoice(id),
    CONSTRAINT fk_fin_invoice_tax_line_tax_rate FOREIGN KEY (tax_rate_id) REFERENCES md_tax_rate(id)
);
