package com.erp.finance.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.erp.finance.dto.BankAccountDto;
import com.erp.finance.dto.BankStatementDto;
import com.erp.finance.dto.BankStatementLineDto;
import com.erp.finance.dto.PaymentMatchDto;
import com.erp.finance.request.CreateBankAccountRequest;
import com.erp.finance.request.CreateBankStatementRequest;
import com.erp.finance.request.ReconcileBankStatementLineRequest;
import com.erp.finance.service.BankAccountService;
import com.erp.finance.service.BankStatementService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/finance/companies/{companyId}/banks")
public class BankController {

    private final BankAccountService bankAccountService;
    private final BankStatementService bankStatementService;

    public BankController(BankAccountService bankAccountService, BankStatementService bankStatementService) {
        this.bankAccountService = bankAccountService;
        this.bankStatementService = bankStatementService;
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<BankAccountDto>> listBankAccounts(@PathVariable Long companyId) {
        return ResponseEntity.ok(bankAccountService.list(companyId));
    }

    @PostMapping("/accounts")
    public ResponseEntity<BankAccountDto> createBankAccount(
            @PathVariable Long companyId,
            @Valid @RequestBody CreateBankAccountRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bankAccountService.create(companyId, request));
    }

    @GetMapping("/statements")
    public ResponseEntity<List<BankStatementDto>> listStatements(@PathVariable Long companyId) {
        return ResponseEntity.ok(bankStatementService.list(companyId));
    }

    @GetMapping("/statements/{statementId}")
    public ResponseEntity<BankStatementDto> getStatement(
            @PathVariable Long companyId,
            @PathVariable Long statementId) {
        return ResponseEntity.ok(bankStatementService.get(companyId, statementId));
    }

    @PostMapping("/statements")
    public ResponseEntity<BankStatementDto> createStatement(
            @PathVariable Long companyId,
            @Valid @RequestBody CreateBankStatementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bankStatementService.create(companyId, request));
    }

    @PostMapping("/statements/{statementId}/lines/{lineId}/reconcile")
    public ResponseEntity<BankStatementLineDto> reconcileLine(
            @PathVariable Long companyId,
            @PathVariable Long statementId,
            @PathVariable Long lineId,
            @RequestBody(required = false) ReconcileBankStatementLineRequest request) {
        return ResponseEntity.ok(bankStatementService.reconcileLine(companyId, statementId, lineId, request));
    }

    @GetMapping("/statements/{statementId}/lines/{lineId}/suggest-payments")
    public ResponseEntity<List<PaymentMatchDto>> suggestPayments(
            @PathVariable Long companyId,
            @PathVariable Long statementId,
            @PathVariable Long lineId,
            @RequestParam(defaultValue = "3") int days) {
        return ResponseEntity.ok(bankStatementService.suggestPayments(companyId, statementId, lineId, days));
    }
}
