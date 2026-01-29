package com.erp.sales.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.model.DocumentStatus;
import com.erp.finance.entity.Invoice;
import com.erp.finance.model.InvoiceType;
import com.erp.finance.repository.InvoiceRepository;
import com.erp.finance.request.CreateInvoiceRequest;
import com.erp.finance.service.InvoiceService;
import com.erp.sales.entity.SalesOrder;
import com.erp.sales.entity.SalesOrderLine;
import com.erp.sales.repository.SalesOrderRepository;
import com.erp.sales.request.CreateInvoiceFromSalesOrderRequest;

@Service
public class SalesInvoicingService {

    private final SalesOrderRepository salesOrderRepository;
    private final InvoiceService invoiceService;
    private final InvoiceRepository invoiceRepository;

    public SalesInvoicingService(
            SalesOrderRepository salesOrderRepository,
            InvoiceService invoiceService,
            InvoiceRepository invoiceRepository) {
        this.salesOrderRepository = salesOrderRepository;
        this.invoiceService = invoiceService;
        this.invoiceRepository = invoiceRepository;
    }

    @Transactional
    public Invoice createArInvoiceFromSalesOrder(Long companyId, Long salesOrderId, CreateInvoiceFromSalesOrderRequest request) {
        SalesOrder so = salesOrderRepository.findById(salesOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Sales Order not found"));
        if (so.getCompany() == null || so.getCompany().getId() == null || !so.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Sales Order company mismatch");
        }
        if (so.getStatus() == DocumentStatus.DRAFTED) {
            throw new IllegalArgumentException("Sales Order must be approved before invoicing");
        }
        if (so.getStatus() == DocumentStatus.VOIDED) {
            throw new IllegalArgumentException("Voided Sales Order cannot be invoiced");
        }

        if (!invoiceRepository.findByCompanyIdAndSalesOrderId(companyId, so.getId()).isEmpty()) {
            throw new IllegalArgumentException("Invoice already exists for this Sales Order");
        }

        List<CreateInvoiceRequest.CreateInvoiceLineRequest> lines = new ArrayList<>();
        if (so.getLines() != null) {
            for (SalesOrderLine l : so.getLines()) {
                BigDecimal shipped = l.getShippedQty() != null ? l.getShippedQty() : BigDecimal.ZERO;
                if (shipped.compareTo(BigDecimal.ZERO) <= 0) {
                    continue;
                }
                CreateInvoiceRequest.CreateInvoiceLineRequest il = new CreateInvoiceRequest.CreateInvoiceLineRequest();
                il.setProductId(l.getProduct().getId());
                il.setQty(shipped);
                il.setPrice(l.getPrice());
                lines.add(il);
            }
        }
        if (lines.isEmpty()) {
            throw new IllegalArgumentException("No shipped qty found to invoice");
        }

        CreateInvoiceRequest req = new CreateInvoiceRequest();
        req.setOrgId(so.getOrg() != null ? so.getOrg().getId() : null);
        req.setBusinessPartnerId(so.getBusinessPartner().getId());
        req.setInvoiceType(InvoiceType.AR);
        req.setTaxRateId(request.getTaxRateId());
        req.setInvoiceDate(request.getInvoiceDate());
        req.setSalesOrderId(so.getId());
        req.setLines(lines);

        return invoiceService.create(companyId, req);
    }
}
