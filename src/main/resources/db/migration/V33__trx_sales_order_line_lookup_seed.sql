CREATE TABLE IF NOT EXISTS trx_sales_order_line_lookup (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    company_id BIGINT NOT NULL,
    field_name VARCHAR(32) NOT NULL,
    field_value VARCHAR(64) NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uk_trx_sol_lookup (company_id, field_name, field_value),
    KEY idx_trx_sol_lookup_company (company_id),
    KEY idx_trx_sol_lookup_field (field_name)
);

-- Seed dummy values for all companies
INSERT IGNORE INTO trx_sales_order_line_lookup (company_id, field_name, field_value)
SELECT c.id, 'unit', v.val
FROM core_company c
JOIN (
    SELECT 'PCS' AS val UNION ALL
    SELECT 'PCE' UNION ALL
    SELECT 'YARD' UNION ALL
    SELECT 'METER'
) v;

INSERT IGNORE INTO trx_sales_order_line_lookup (company_id, field_name, field_value)
SELECT c.id, 'size', v.val
FROM core_company c
JOIN (
    SELECT 'S' AS val UNION ALL
    SELECT 'M' UNION ALL
    SELECT 'L' UNION ALL
    SELECT 'XL'
) v;

INSERT IGNORE INTO trx_sales_order_line_lookup (company_id, field_name, field_value)
SELECT c.id, 'nationalSize', v.val
FROM core_company c
JOIN (
    SELECT '36' AS val UNION ALL
    SELECT '38' UNION ALL
    SELECT '40' UNION ALL
    SELECT '42'
) v;

INSERT IGNORE INTO trx_sales_order_line_lookup (company_id, field_name, field_value)
SELECT c.id, 'style', v.val
FROM core_company c
JOIN (
    SELECT 'KIMONO' AS val UNION ALL
    SELECT 'T-SHIRT' UNION ALL
    SELECT 'PANTS'
) v;

INSERT IGNORE INTO trx_sales_order_line_lookup (company_id, field_name, field_value)
SELECT c.id, 'cuttingNo', v.val
FROM core_company c
JOIN (
    SELECT 'CUT-001' AS val UNION ALL
    SELECT 'CUT-002' UNION ALL
    SELECT 'CUT-003'
) v;

INSERT IGNORE INTO trx_sales_order_line_lookup (company_id, field_name, field_value)
SELECT c.id, 'color', v.val
FROM core_company c
JOIN (
    SELECT 'BLACK' AS val UNION ALL
    SELECT 'WHITE' UNION ALL
    SELECT 'NAVY' UNION ALL
    SELECT 'RED'
) v;

INSERT IGNORE INTO trx_sales_order_line_lookup (company_id, field_name, field_value)
SELECT c.id, 'destination', v.val
FROM core_company c
JOIN (
    SELECT 'JAKARTA' AS val UNION ALL
    SELECT 'BANDUNG' UNION ALL
    SELECT 'SURABAYA'
) v;
