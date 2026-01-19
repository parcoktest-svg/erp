CREATE TABLE IF NOT EXISTS fin_fiscal_year (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    company_id BIGINT NOT NULL,
    year INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uk_fin_fiscal_year_company_year (company_id, year),
    KEY idx_fin_fiscal_year_company (company_id)
);

CREATE TABLE IF NOT EXISTS fin_accounting_period (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    fiscal_year_id BIGINT NOT NULL,
    period_no INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uk_fin_period_year_period (fiscal_year_id, period_no),
    KEY idx_fin_period_year (fiscal_year_id),
    KEY idx_fin_period_dates (start_date, end_date),
    CONSTRAINT fk_fin_period_year FOREIGN KEY (fiscal_year_id) REFERENCES fin_fiscal_year(id)
);
