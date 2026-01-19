CREATE TABLE IF NOT EXISTS fin_journal_entry (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    company_id BIGINT NOT NULL,
    org_id BIGINT NULL,
    document_no VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    accounting_date DATE NOT NULL,
    description VARCHAR(255) NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uk_fin_journal_entry_document_no (document_no),
    KEY idx_fin_journal_entry_company (company_id),
    KEY idx_fin_journal_entry_org (org_id)
);

CREATE TABLE IF NOT EXISTS fin_journal_line (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    journal_entry_id BIGINT NOT NULL,
    account_code VARCHAR(50) NOT NULL,
    debit DECIMAL(19,2) NOT NULL DEFAULT 0,
    credit DECIMAL(19,2) NOT NULL DEFAULT 0,

    PRIMARY KEY (id),
    KEY idx_fin_journal_line_je (journal_entry_id),
    KEY idx_fin_journal_line_acct (account_code),
    CONSTRAINT fk_fin_journal_line_je FOREIGN KEY (journal_entry_id) REFERENCES fin_journal_entry(id)
);

CREATE TABLE IF NOT EXISTS fin_invoice (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    company_id BIGINT NOT NULL,
    org_id BIGINT NULL,
    business_partner_id BIGINT NOT NULL,
    invoice_type VARCHAR(50) NOT NULL,
    tax_rate_id BIGINT NULL,
    journal_entry_id BIGINT NULL,
    document_no VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    invoice_date DATE NOT NULL,
    total_net DECIMAL(19,2) NOT NULL DEFAULT 0,
    total_tax DECIMAL(19,2) NOT NULL DEFAULT 0,
    grand_total DECIMAL(19,2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(19,2) NOT NULL DEFAULT 0,
    open_amount DECIMAL(19,2) NOT NULL DEFAULT 0,

    PRIMARY KEY (id),
    UNIQUE KEY uk_fin_invoice_document_no (document_no),
    KEY idx_fin_invoice_company (company_id),
    KEY idx_fin_invoice_bp (business_partner_id),
    KEY idx_fin_invoice_org (org_id)
);

CREATE TABLE IF NOT EXISTS fin_invoice_line (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    invoice_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    uom_id BIGINT NOT NULL,
    qty DECIMAL(19,2) NOT NULL DEFAULT 0,
    price DECIMAL(19,2) NOT NULL DEFAULT 0,
    line_net DECIMAL(19,2) NOT NULL DEFAULT 0,

    PRIMARY KEY (id),
    KEY idx_fin_invoice_line_invoice (invoice_id),
    KEY idx_fin_invoice_line_product (product_id),
    CONSTRAINT fk_fin_invoice_line_invoice FOREIGN KEY (invoice_id) REFERENCES fin_invoice(id)
);

CREATE TABLE IF NOT EXISTS fin_payment (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    company_id BIGINT NOT NULL,
    org_id BIGINT NULL,
    business_partner_id BIGINT NOT NULL,
    invoice_id BIGINT NULL,
    document_no VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(19,2) NOT NULL DEFAULT 0,
    journal_entry_id BIGINT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uk_fin_payment_document_no (document_no),
    KEY idx_fin_payment_company (company_id),
    KEY idx_fin_payment_invoice (invoice_id),
    KEY idx_fin_payment_bp (business_partner_id)
);

CREATE TABLE IF NOT EXISTS fin_payment_allocation (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    payment_id BIGINT NOT NULL,
    invoice_id BIGINT NOT NULL,
    amount DECIMAL(19,2) NOT NULL DEFAULT 0,

    PRIMARY KEY (id),
    KEY idx_fin_payment_allocation_payment (payment_id),
    KEY idx_fin_payment_allocation_invoice (invoice_id),
    CONSTRAINT fk_fin_payment_allocation_payment FOREIGN KEY (payment_id) REFERENCES fin_payment(id),
    CONSTRAINT fk_fin_payment_allocation_invoice FOREIGN KEY (invoice_id) REFERENCES fin_invoice(id)
);
