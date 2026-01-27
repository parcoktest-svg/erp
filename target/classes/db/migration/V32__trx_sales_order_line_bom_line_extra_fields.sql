ALTER TABLE trx_sales_order_line_bom_line
    ADD COLUMN bom_code VARCHAR(255) NULL,
    ADD COLUMN description1 VARCHAR(255) NULL,
    ADD COLUMN color_description2 VARCHAR(255) NULL,
    ADD COLUMN unit VARCHAR(64) NULL,
    ADD COLUMN unit_price_foreign DECIMAL(19,4) NULL,
    ADD COLUMN unit_price_domestic DECIMAL(19,4) NULL,
    ADD COLUMN yy DECIMAL(19,4) NULL,
    ADD COLUMN exchange_rate DECIMAL(19,4) NULL,
    ADD COLUMN amount_foreign DECIMAL(19,4) NULL,
    ADD COLUMN amount_domestic DECIMAL(19,4) NULL,
    ADD COLUMN currency_id BIGINT NULL;
