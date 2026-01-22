package com.erp.purchase.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Map;
import java.util.function.Function;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.model.DocumentStatus;
import com.erp.finance.entity.Invoice;
import com.erp.finance.model.InvoiceType;
import com.erp.finance.request.CreateInvoiceRequest;
import com.erp.finance.service.InvoiceService;
import com.erp.purchase.entity.PurchaseOrder;
import com.erp.purchase.entity.PurchaseOrderLine;
import com.erp.purchase.repository.PurchaseOrderRepository;
import com.erp.purchase.request.CreateInvoiceFromPurchaseOrderRequest;

@Service
public class PurchaseInvoicingService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final InvoiceService invoiceService;

    public PurchaseInvoicingService(PurchaseOrderRepository purchaseOrderRepository, InvoiceService invoiceService) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.invoiceService = invoiceService;
    }

    @Transactional
    public Invoice createApInvoiceFromPurchaseOrder(Long companyId, Long purchaseOrderId, CreateInvoiceFromPurchaseOrderRequest request) {
        PurchaseOrder po = purchaseOrderRepository.findById(purchaseOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Purchase order not found"));

        if (po.getCompany() == null || po.getCompany().getId() == null || !po.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Purchase order company mismatch");
        }
        if (po.getStatus() == DocumentStatus.DRAFTED) {
            throw new IllegalArgumentException("Purchase Order must be approved before invoicing");
        }
        if (po.getStatus() == DocumentStatus.VOIDED) {
            throw new IllegalArgumentException("Voided Purchase Order cannot be invoiced");
        }

        if (request.getLines() == null || request.getLines().isEmpty()) {
            throw new IllegalArgumentException("Invoice lines must not be empty");
        }

        if (po.getLines() == null || po.getLines().isEmpty()) {
            throw new IllegalArgumentException("Purchase order has no lines");
        }

        Map<Long, PurchaseOrderLine> poLineById = po.getLines().stream()
                .collect(java.util.stream.Collectors.toMap(PurchaseOrderLine::getId, Function.identity()));

        ArrayList<CreateInvoiceRequest.CreateInvoiceLineRequest> invoiceLines = new ArrayList<>();

        for (CreateInvoiceFromPurchaseOrderRequest.Line lr : request.getLines()) {
            PurchaseOrderLine pol = poLineById.get(lr.getPurchaseOrderLineId());
            if (pol == null) {
                throw new IllegalArgumentException("Purchase order line not found: " + lr.getPurchaseOrderLineId());
            }

            BigDecimal qty = lr.getQty();
            if (qty == null || qty.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Qty must be > 0");
            }

            BigDecimal received = pol.getReceivedQty() != null ? pol.getReceivedQty() : BigDecimal.ZERO;
            BigDecimal invoiced = pol.getInvoicedQty() != null ? pol.getInvoicedQty() : BigDecimal.ZERO;
            BigDecimal remainingToInvoice = received.subtract(invoiced);

            if (qty.compareTo(remainingToInvoice) > 0) {
                throw new IllegalArgumentException(
                        "Invoice qty exceeds received not yet invoiced for purchaseOrderLineId=" + pol.getId()
                                + " (received=" + received + ", invoiced=" + invoiced + ", requested=" + qty + ")");
            }

            CreateInvoiceRequest.CreateInvoiceLineRequest il = new CreateInvoiceRequest.CreateInvoiceLineRequest();
            il.setProductId(pol.getProduct().getId());
            il.setPurchaseOrderLineId(pol.getId());
            il.setQty(qty);
            il.setPrice(pol.getPrice());
            invoiceLines.add(il);

            pol.setInvoicedQty(invoiced.add(qty));
        }

        CreateInvoiceRequest invReq = new CreateInvoiceRequest();
        invReq.setOrgId(po.getOrg() != null ? po.getOrg().getId() : null);
        invReq.setBusinessPartnerId(po.getVendor().getId());
        invReq.setInvoiceType(InvoiceType.AP);
        invReq.setTaxRateId(request.getTaxRateId());
        invReq.setInvoiceDate(request.getInvoiceDate());
        invReq.setPurchaseOrderId(po.getId());
        invReq.setLines(invoiceLines);

        Invoice created = invoiceService.create(companyId, invReq);
        purchaseOrderRepository.save(po);
        return created;
    }
}
