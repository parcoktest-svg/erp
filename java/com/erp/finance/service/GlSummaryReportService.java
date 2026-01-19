package com.erp.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.erp.finance.dto.GlSummaryReportDto;
import com.erp.finance.dto.GlSummaryRowDto;
import com.erp.finance.repository.JournalLineRepository;

@Service
public class GlSummaryReportService {

    private final JournalLineRepository journalLineRepository;

    public GlSummaryReportService(JournalLineRepository journalLineRepository) {
        this.journalLineRepository = journalLineRepository;
    }

    public GlSummaryReportDto getSummary(Long companyId, LocalDate fromDate, LocalDate toDate) {
        if (fromDate == null || toDate == null) {
            throw new IllegalArgumentException("fromDate and toDate are required");
        }
        if (toDate.isBefore(fromDate)) {
            throw new IllegalArgumentException("toDate must be >= fromDate");
        }

        GlSummaryReportDto dto = new GlSummaryReportDto();
        dto.setFromDate(fromDate);
        dto.setToDate(toDate);

        for (JournalLineRepository.GlSummaryRow row : journalLineRepository.summarizeByAccount(companyId, fromDate, toDate)) {
            GlSummaryRowDto r = new GlSummaryRowDto();
            r.setAccountCode(row.getAccountCode());

            BigDecimal debit = row.getDebitTotal() != null ? row.getDebitTotal() : BigDecimal.ZERO;
            BigDecimal credit = row.getCreditTotal() != null ? row.getCreditTotal() : BigDecimal.ZERO;

            r.setDebitTotal(debit);
            r.setCreditTotal(credit);
            r.setBalance(debit.subtract(credit));

            dto.getRows().add(r);

            dto.setTotalDebit(dto.getTotalDebit().add(debit));
            dto.setTotalCredit(dto.getTotalCredit().add(credit));
        }

        return dto;
    }
}
