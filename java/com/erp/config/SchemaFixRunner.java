package com.erp.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class SchemaFixRunner implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public SchemaFixRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        // Idempotent schema fixes for legacy databases.
        // Keep this minimal and safe: only apply required changes for the product/material split & BOM snapshot saving.
        try {
            jdbcTemplate.execute("ALTER TABLE trx_sales_order_line_bom_line MODIFY COLUMN component_product_id BIGINT NULL");
        } catch (Exception ignored) {
            // Never block startup.
        }

        try {
            Integer colExists = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'trx_sales_order_line_bom_line' AND COLUMN_NAME = 'component_material_id'",
                    Integer.class);
            if (colExists != null && colExists == 0) {
                jdbcTemplate.execute("ALTER TABLE trx_sales_order_line_bom_line ADD COLUMN component_material_id BIGINT NULL");
            }
        } catch (Exception ignored) {
            // Never block startup.
        }

        try {
            Integer idxExists = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'trx_sales_order_line_bom_line' AND INDEX_NAME = 'idx_trx_sol_bomline_component_material'",
                    Integer.class);
            if (idxExists != null && idxExists == 0) {
                jdbcTemplate.execute(
                        "CREATE INDEX idx_trx_sol_bomline_component_material ON trx_sales_order_line_bom_line(component_material_id)");
            }
        } catch (Exception ignored) {
            // Never block startup.
        }
    }
}
