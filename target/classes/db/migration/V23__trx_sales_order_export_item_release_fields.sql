-- Export item release fields per Sales Order line

ALTER TABLE trx_sales_order_line
    ADD COLUMN delivery_date DATE NULL,
    ADD COLUMN ship_mode VARCHAR(100) NULL,
    ADD COLUMN factory VARCHAR(100) NULL,
    ADD COLUMN remark VARCHAR(255) NULL,
    ADD COLUMN file_path VARCHAR(255) NULL;
