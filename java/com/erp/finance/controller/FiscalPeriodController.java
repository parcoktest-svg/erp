package com.erp.finance.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.finance.dto.AccountingPeriodDto;
import com.erp.finance.dto.FiscalYearDto;
import com.erp.finance.entity.AccountingPeriod;
import com.erp.finance.entity.FiscalYear;
import com.erp.finance.request.CreateFiscalYearRequest;
import com.erp.finance.service.AccountingPeriodService;
import com.erp.finance.service.FiscalYearService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/finance/companies/{companyId}/periods")
public class FiscalPeriodController {

    private final FiscalYearService fiscalYearService;
    private final AccountingPeriodService accountingPeriodService;

    public FiscalPeriodController(FiscalYearService fiscalYearService, AccountingPeriodService accountingPeriodService) {
        this.fiscalYearService = fiscalYearService;
        this.accountingPeriodService = accountingPeriodService;
    }

    @GetMapping("/fiscal-years")
    public ResponseEntity<List<FiscalYearDto>> listFiscalYears(@PathVariable Long companyId) {
        return ResponseEntity.ok(fiscalYearService.listByCompany(companyId).stream().map(this::toDto).toList());
    }

    @PostMapping("/fiscal-years")
    public ResponseEntity<FiscalYearDto> createFiscalYear(@PathVariable Long companyId, @Valid @RequestBody CreateFiscalYearRequest request) {
        FiscalYear saved = fiscalYearService.create(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    @PostMapping("/fiscal-years/{fiscalYearId}/close")
    public ResponseEntity<FiscalYearDto> closeFiscalYear(@PathVariable Long companyId, @PathVariable Long fiscalYearId) {
        return ResponseEntity.ok(toDto(fiscalYearService.close(companyId, fiscalYearId)));
    }

    @PostMapping("/fiscal-years/{fiscalYearId}/open")
    public ResponseEntity<FiscalYearDto> openFiscalYear(@PathVariable Long companyId, @PathVariable Long fiscalYearId) {
        return ResponseEntity.ok(toDto(fiscalYearService.open(companyId, fiscalYearId)));
    }

    @GetMapping("/fiscal-years/{fiscalYearId}")
    public ResponseEntity<List<AccountingPeriodDto>> listPeriods(@PathVariable Long companyId, @PathVariable Long fiscalYearId) {
        return ResponseEntity.ok(accountingPeriodService.listByFiscalYear(fiscalYearId).stream().map(this::toDto).toList());
    }

    @PostMapping("/{periodId}/close")
    public ResponseEntity<AccountingPeriodDto> closePeriod(@PathVariable Long companyId, @PathVariable Long periodId) {
        return ResponseEntity.ok(toDto(accountingPeriodService.closePeriod(companyId, periodId)));
    }

    @PostMapping("/{periodId}/open")
    public ResponseEntity<AccountingPeriodDto> openPeriod(@PathVariable Long companyId, @PathVariable Long periodId) {
        return ResponseEntity.ok(toDto(accountingPeriodService.openPeriod(companyId, periodId)));
    }

    private FiscalYearDto toDto(FiscalYear fy) {
        FiscalYearDto dto = new FiscalYearDto();
        dto.setId(fy.getId());
        dto.setCompanyId(fy.getCompany() != null ? fy.getCompany().getId() : null);
        dto.setYear(fy.getYear());
        dto.setStartDate(fy.getStartDate());
        dto.setEndDate(fy.getEndDate());
        dto.setStatus(fy.getStatus());
        return dto;
    }

    private AccountingPeriodDto toDto(AccountingPeriod p) {
        AccountingPeriodDto dto = new AccountingPeriodDto();
        dto.setId(p.getId());
        dto.setFiscalYearId(p.getFiscalYear() != null ? p.getFiscalYear().getId() : null);
        dto.setPeriodNo(p.getPeriodNo());
        dto.setStartDate(p.getStartDate());
        dto.setEndDate(p.getEndDate());
        dto.setStatus(p.getStatus());
        return dto;
    }
}
