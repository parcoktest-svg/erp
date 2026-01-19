package com.erp.finance.controller;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.erp.finance.dto.AgingReportDto;
import com.erp.finance.dto.BalanceSheetReportDto;
import com.erp.finance.dto.GlSummaryReportDto;
import com.erp.finance.dto.ProfitLossReportDto;
import com.erp.finance.dto.TrialBalanceReportDto;
import com.erp.finance.model.InvoiceType;
import com.erp.finance.service.AgingReportService;
import com.erp.finance.service.FinancialStatementService;
import com.erp.finance.service.GlSummaryReportService;

@RestController
@RequestMapping("/api/finance/companies/{companyId}/reports")
public class FinanceReportController {

    private final AgingReportService agingReportService;
    private final GlSummaryReportService glSummaryReportService;
    private final FinancialStatementService financialStatementService;

    public FinanceReportController(
            AgingReportService agingReportService,
            GlSummaryReportService glSummaryReportService,
            FinancialStatementService financialStatementService) {
        this.agingReportService = agingReportService;
        this.glSummaryReportService = glSummaryReportService;
        this.financialStatementService = financialStatementService;
    }

    @GetMapping("/aging")
    public ResponseEntity<AgingReportDto> aging(
            @PathVariable Long companyId,
            @RequestParam InvoiceType invoiceType,
            @RequestParam(required = false) LocalDate asOfDate) {

        return ResponseEntity.ok(agingReportService.getAging(companyId, invoiceType, asOfDate));
    }

    @GetMapping("/gl-summary")
    public ResponseEntity<GlSummaryReportDto> glSummary(
            @PathVariable Long companyId,
            @RequestParam LocalDate fromDate,
            @RequestParam LocalDate toDate) {
        return ResponseEntity.ok(glSummaryReportService.getSummary(companyId, fromDate, toDate));
    }

    @GetMapping("/trial-balance")
    public ResponseEntity<TrialBalanceReportDto> trialBalance(
            @PathVariable Long companyId,
            @RequestParam LocalDate fromDate,
            @RequestParam LocalDate toDate) {
        return ResponseEntity.ok(financialStatementService.trialBalance(companyId, fromDate, toDate));
    }

    @GetMapping("/profit-loss")
    public ResponseEntity<ProfitLossReportDto> profitLoss(
            @PathVariable Long companyId,
            @RequestParam LocalDate fromDate,
            @RequestParam LocalDate toDate) {
        return ResponseEntity.ok(financialStatementService.profitLoss(companyId, fromDate, toDate));
    }

    @GetMapping("/balance-sheet")
    public ResponseEntity<BalanceSheetReportDto> balanceSheet(
            @PathVariable Long companyId,
            @RequestParam(required = false) LocalDate asOfDate) {
        return ResponseEntity.ok(financialStatementService.balanceSheet(companyId, asOfDate));
    }
}
