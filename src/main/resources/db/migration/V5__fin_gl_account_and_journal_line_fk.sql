CREATE TABLE IF NOT EXISTS fin_gl_account (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    company_id BIGINT NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    active BIT NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uk_fin_gl_account_company_code (company_id, code),
    KEY idx_fin_gl_account_company (company_id)
);

ALTER TABLE fin_journal_line
    ADD COLUMN gl_account_id BIGINT NULL;

ALTER TABLE fin_journal_line
    ADD KEY idx_fin_journal_line_gl_account (gl_account_id);

ALTER TABLE fin_journal_line
    ADD CONSTRAINT fk_fin_journal_line_gl_account FOREIGN KEY (gl_account_id) REFERENCES fin_gl_account(id);

-- Seed default COA for all companies (idempotent because of unique key)
INSERT INTO fin_gl_account (company_id, code, name, type, active)
SELECT c.id, x.code, x.name, x.type, 1
FROM core_company c
JOIN (
    SELECT '1000' AS code, 'Cash' AS name, 'ASSET' AS type
    UNION ALL SELECT '1100', 'Accounts Receivable', 'ASSET'
    UNION ALL SELECT '2000', 'Accounts Payable', 'LIABILITY'
    UNION ALL SELECT '2100', 'Tax Payable', 'LIABILITY'
    UNION ALL SELECT '1200', 'Tax Receivable', 'ASSET'
    UNION ALL SELECT '4000', 'Revenue', 'REVENUE'
    UNION ALL SELECT '5000', 'Expense', 'EXPENSE'
) x
LEFT JOIN fin_gl_account a
  ON a.company_id = c.id AND a.code = x.code
WHERE a.id IS NULL;

-- Backfill journal line gl_account_id based on legacy account_code
UPDATE fin_journal_line jl
JOIN fin_journal_entry je ON je.id = jl.journal_entry_id
JOIN fin_gl_account ga ON ga.company_id = je.company_id
SET jl.gl_account_id = ga.id
WHERE jl.gl_account_id IS NULL
  AND ga.code = (
    CASE jl.account_code
      WHEN 'CASH' THEN '1000'
      WHEN 'AR' THEN '1100'
      WHEN 'AP' THEN '2000'
      WHEN 'TAX_PAYABLE' THEN '2100'
      WHEN 'TAX_RECEIVABLE' THEN '1200'
      WHEN 'REVENUE' THEN '4000'
      WHEN 'EXPENSE' THEN '5000'
      ELSE NULL
    END
  );
