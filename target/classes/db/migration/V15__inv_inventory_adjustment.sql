CREATE TABLE inv_inventory_adjustment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    org_id BIGINT,
    document_no VARCHAR(50) NOT NULL UNIQUE,
    adjustment_date DATE NOT NULL,
    description VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFTED',
    journal_entry_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES core_company(id),
    FOREIGN KEY (org_id) REFERENCES core_org(id),
    FOREIGN KEY (journal_entry_id) REFERENCES fin_journal_entry(id)
);

CREATE TABLE inv_inventory_adjustment_line (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    adjustment_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    locator_id BIGINT NOT NULL,
    quantity_on_hand_before DECIMAL(19,4) NOT NULL,
    quantity_adjusted DECIMAL(19,4) NOT NULL,
    quantity_on_hand_after DECIMAL(19,4) NOT NULL,
    adjustment_amount DECIMAL(19,2) NOT NULL,
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_adjustment_line_product_locator (adjustment_id, product_id, locator_id),
    FOREIGN KEY (adjustment_id) REFERENCES inv_inventory_adjustment(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES md_product(id),
    FOREIGN KEY (locator_id) REFERENCES inv_locator(id)
);
