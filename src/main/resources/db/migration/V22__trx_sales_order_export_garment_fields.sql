-- Export garment fields for Sales Order

ALTER TABLE trx_sales_order
    ADD COLUMN currency_id BIGINT NULL,
    ADD COLUMN exchange_rate DECIMAL(19, 6) NULL,
    ADD COLUMN foreign_amount DECIMAL(19, 2) NULL,
    ADD CONSTRAINT fk_trx_sales_order_currency
        FOREIGN KEY (currency_id) REFERENCES md_currency(id);

ALTER TABLE trx_sales_order_line
    ADD COLUMN dp_price DECIMAL(19, 2) NULL;
