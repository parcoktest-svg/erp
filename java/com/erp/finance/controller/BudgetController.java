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

import com.erp.finance.dto.BudgetDto;
import com.erp.finance.dto.BudgetVsActualDto;
import com.erp.finance.entity.Budget;
import com.erp.finance.request.CreateBudgetRequest;
import com.erp.finance.service.BudgetService;
import com.erp.finance.service.BudgetVsActualService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/finance/companies/{companyId}/budgets")
public class BudgetController {

    private final BudgetService budgetService;
    private final BudgetVsActualService budgetVsActualService;

    public BudgetController(BudgetService budgetService, BudgetVsActualService budgetVsActualService) {
        this.budgetService = budgetService;
        this.budgetVsActualService = budgetVsActualService;
    }

    @GetMapping
    public ResponseEntity<List<BudgetDto>> list(@PathVariable Long companyId) {
        List<BudgetDto> result = budgetService.listByCompany(companyId).stream().map(this::toDto).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/fiscal-year/{fiscalYearId}")
    public ResponseEntity<List<BudgetDto>> listByFiscalYear(@PathVariable Long companyId, @PathVariable Long fiscalYearId) {
        List<BudgetDto> result = budgetService.listByCompanyAndFiscalYear(companyId, fiscalYearId).stream().map(this::toDto).toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<BudgetDto> create(@PathVariable Long companyId, @Valid @RequestBody CreateBudgetRequest request) {
        Budget saved = budgetService.create(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    @PostMapping("/{budgetId}/complete")
    public ResponseEntity<BudgetDto> complete(@PathVariable Long companyId, @PathVariable Long budgetId) {
        Budget updated = budgetService.complete(companyId, budgetId);
        return ResponseEntity.ok(toDto(updated));
    }

    @PostMapping("/{budgetId}/void")
    public ResponseEntity<BudgetDto> voidBudget(@PathVariable Long companyId, @PathVariable Long budgetId) {
        Budget updated = budgetService.voidBudget(companyId, budgetId);
        return ResponseEntity.ok(toDto(updated));
    }

    @GetMapping("/{budgetId}/budget-vs-actual")
    public ResponseEntity<List<BudgetVsActualDto>> budgetVsActual(@PathVariable Long companyId, @PathVariable Long budgetId) {
        List<BudgetVsActualDto> result = budgetVsActualService.generate(budgetId);
        return ResponseEntity.ok(result);
    }

    private BudgetDto toDto(Budget budget) {
        BudgetDto dto = new BudgetDto();
        dto.setId(budget.getId());
        dto.setCompanyId(budget.getCompany() != null ? budget.getCompany().getId() : null);
        dto.setOrgId(budget.getOrg() != null ? budget.getOrg().getId() : null);
        dto.setFiscalYearId(budget.getFiscalYear() != null ? budget.getFiscalYear().getId() : null);
        dto.setName(budget.getName());
        dto.setDescription(budget.getDescription());
        dto.setStatus(budget.getStatus());
        dto.setLines(budget.getLines() != null ? budget.getLines().stream().map(this::toLineDto).toList() : List.of());
        return dto;
    }

    private com.erp.finance.dto.BudgetLineDto toLineDto(com.erp.finance.entity.BudgetLine line) {
        com.erp.finance.dto.BudgetLineDto dto = new com.erp.finance.dto.BudgetLineDto();
        dto.setId(line.getId());
        dto.setGlAccountId(line.getGlAccount() != null ? line.getGlAccount().getId() : null);
        dto.setAccountingPeriodId(line.getAccountingPeriod() != null ? line.getAccountingPeriod().getId() : null);
        dto.setBudgetAmount(line.getBudgetAmount());
        dto.setNotes(line.getNotes());
        return dto;
    }
}
