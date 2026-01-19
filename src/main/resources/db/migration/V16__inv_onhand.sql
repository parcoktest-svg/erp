CREATE TABLE inv_onhand (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    locator_id BIGINT NOT NULL,
    quantity_on_hand DECIMAL(19,4) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_onhand_company_product_locator (company_id, product_id, locator_id),
    FOREIGN KEY (company_id) REFERENCES core_company(id),
    FOREIGN KEY (product_id) REFERENCES md_product(id),
    FOREIGN KEY (locator_id) REFERENCES inv_locator(id)
);
