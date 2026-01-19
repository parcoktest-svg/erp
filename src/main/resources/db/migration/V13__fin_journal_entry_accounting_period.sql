ALTER TABLE fin_journal_entry
ADD COLUMN accounting_period_id BIGINT,
ADD CONSTRAINT fk_journal_entry_period FOREIGN KEY (accounting_period_id) REFERENCES fin_accounting_period(id);
