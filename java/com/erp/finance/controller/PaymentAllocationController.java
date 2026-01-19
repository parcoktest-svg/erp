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
import com.erp.finance.entity.PaymentAllocation;
import com.erp.finance.repository.PaymentAllocationRepository;
import com.erp.finance.request.CreateAllocationPaymentRequest;
import com.erp.finance.service.AllocationPaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/finance/companies/{companyId}/payment-allocations")
public class PaymentAllocationController {

    private final AllocationPaymentService allocationPaymentService;
    private final PaymentAllocationRepository paymentAllocationRepository;

    public PaymentAllocationController(
            AllocationPaymentService allocationPaymentService,
            PaymentAllocationRepository paymentAllocationRepository) {
        this.allocationPaymentService = allocationPaymentService;
        this.paymentAllocationRepository = paymentAllocationRepository;
    }

    @PostMapping
    public ResponseEntity<Payment> create(@PathVariable Long companyId, @Valid @RequestBody CreateAllocationPaymentRequest request) {
        Payment payment = allocationPaymentService.createAllocatedPayment(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }

    @GetMapping
    public ResponseEntity<List<PaymentAllocation>> list(
            @PathVariable Long companyId,
            @RequestParam(required = false) Long paymentId,
            @RequestParam(required = false) Long invoiceId) {

        if (paymentId != null) {
            return ResponseEntity.ok(paymentAllocationRepository.findByPaymentId(paymentId));
        }
        if (invoiceId != null) {
            return ResponseEntity.ok(paymentAllocationRepository.findByInvoiceId(invoiceId));
        }

        return ResponseEntity.ok(List.of());
    }
}
