package com.erp.finance.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.finance.entity.JournalEntry;
import com.erp.finance.repository.JournalEntryRepository;

@RestController
@RequestMapping("/api/finance/companies/{companyId}/journals")
public class JournalEntryController {

    private final JournalEntryRepository journalEntryRepository;

    public JournalEntryController(JournalEntryRepository journalEntryRepository) {
        this.journalEntryRepository = journalEntryRepository;
    }

    @GetMapping
    public ResponseEntity<List<JournalEntry>> list(@PathVariable Long companyId) {
        return ResponseEntity.ok(journalEntryRepository.findByCompanyId(companyId));
    }
}
