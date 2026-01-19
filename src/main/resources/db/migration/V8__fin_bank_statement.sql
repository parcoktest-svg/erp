CREATE TABLE IF NOT EXISTS fin_bank_account (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    company_id BIGINT NOT NULL,
    org_id BIGINT NULL,

    name VARCHAR(255) NOT NULL,
    bank_name VARCHAR(255) NULL,
    account_no VARCHAR(255) NULL,
    currency_code VARCHAR(20) NULL,

    gl_account_id BIGINT NOT NULL,
    active BIT NOT NULL,

    PRIMARY KEY (id),
    KEY idx_fin_bank_account_company (company_id),
    KEY idx_fin_bank_account_org (org_id),
    KEY idx_fin_bank_account_gl (gl_account_id),
    CONSTRAINT fk_fin_bank_account_gl FOREIGN KEY (gl_account_id) REFERENCES fin_gl_account(id)
);

CREATE TABLE IF NOT EXISTS fin_bank_statement (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    company_id BIGINT NOT NULL,
    org_id BIGINT NULL,
    bank_account_id BIGINT NOT NULL,

    document_no VARCHAR(255) NOT NULL,
    statement_date DATE NOT NULL,
    description VARCHAR(255) NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uk_fin_bank_statement_docno (document_no),
    KEY idx_fin_bank_statement_company (company_id),
    KEY idx_fin_bank_statement_bank_account (bank_account_id),
    CONSTRAINT fk_fin_bank_statement_bank_account FOREIGN KEY (bank_account_id) REFERENCES fin_bank_account(id)
);

CREATE TABLE IF NOT EXISTS fin_bank_statement_line (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    bank_statement_id BIGINT NOT NULL,
    trx_date DATE NOT NULL,
    description VARCHAR(255) NULL,
    amount DECIMAL(19,2) NOT NULL,

    payment_id BIGINT NULL,
    journal_entry_id BIGINT NULL,
    reconciled BIT NOT NULL,

    PRIMARY KEY (id),
    KEY idx_fin_bank_stmt_line_stmt (bank_statement_id),
    KEY idx_fin_bank_stmt_line_payment (payment_id),
    KEY idx_fin_bank_stmt_line_je (journal_entry_id),
    CONSTRAINT fk_fin_bank_stmt_line_stmt FOREIGN KEY (bank_statement_id) REFERENCES fin_bank_statement(id),
    CONSTRAINT fk_fin_bank_stmt_line_payment FOREIGN KEY (payment_id) REFERENCES fin_payment(id),
    CONSTRAINT fk_fin_bank_stmt_line_je FOREIGN KEY (journal_entry_id) REFERENCES fin_journal_entry(id)
);
