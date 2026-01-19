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

import com.erp.finance.entity.Payment;
import com.erp.finance.request.CreatePaymentRequest;
import com.erp.finance.request.VoidPaymentRequest;
import com.erp.finance.service.PaymentService;
import com.erp.finance.service.PaymentVoidService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/finance/companies/{companyId}/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentVoidService paymentVoidService;

    public PaymentController(PaymentService paymentService, PaymentVoidService paymentVoidService) {
        this.paymentService = paymentService;
        this.paymentVoidService = paymentVoidService;
    }

    @GetMapping
    public ResponseEntity<List<Payment>> list(@PathVariable Long companyId, @RequestParam(required = false) Long invoiceId) {
        if (invoiceId != null) {
            return ResponseEntity.ok(paymentService.listByInvoice(invoiceId));
        }
        return ResponseEntity.ok(paymentService.listByCompany(companyId));
    }

    @PostMapping
    public ResponseEntity<Payment> create(@PathVariable Long companyId, @Valid @RequestBody CreatePaymentRequest request) {
        Payment saved = paymentService.create(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/{paymentId}/void")
    public ResponseEntity<Payment> voidPayment(
            @PathVariable Long companyId,
            @PathVariable Long paymentId,
            @Valid @RequestBody VoidPaymentRequest request) {
        Payment saved = paymentVoidService.voidPayment(companyId, paymentId, request);
        return ResponseEntity.ok(saved);
    }
}
