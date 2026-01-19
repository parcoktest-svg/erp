CREATE TABLE fin_budget (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    org_id BIGINT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    fiscal_year_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFTED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_budget_company_fiscal (company_id, fiscal_year_id, name),
    FOREIGN KEY (company_id) REFERENCES core_company(id),
    FOREIGN KEY (org_id) REFERENCES core_org(id),
    FOREIGN KEY (fiscal_year_id) REFERENCES fin_fiscal_year(id)
);

CREATE TABLE fin_budget_line (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    budget_id BIGINT NOT NULL,
    gl_account_id BIGINT NOT NULL,
    accounting_period_id BIGINT NOT NULL,
    budget_amount DECIMAL(19,2) NOT NULL,
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_budget_line_account_period (budget_id, gl_account_id, accounting_period_id),
    FOREIGN KEY (budget_id) REFERENCES fin_budget(id) ON DELETE CASCADE,
    FOREIGN KEY (gl_account_id) REFERENCES fin_gl_account(id),
    FOREIGN KEY (accounting_period_id) REFERENCES fin_accounting_period(id)
);
