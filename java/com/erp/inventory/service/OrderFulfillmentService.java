package com.erp.inventory.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.model.DocumentType;
import com.erp.core.model.DocumentStatus;
import com.erp.core.service.DocumentNoService;
import com.erp.finance.entity.AccountingPeriod;
import com.erp.finance.entity.JournalEntry;
import com.erp.finance.entity.JournalLine;
import com.erp.finance.model.GlAccountCode;
import com.erp.finance.repository.AccountingPeriodRepository;
import com.erp.finance.repository.JournalEntryRepository;
import com.erp.finance.service.GlAccountMappingService;
import com.erp.inventory.model.InventoryMovementType;
import com.erp.inventory.request.CreateGoodsReceiptRequest;
import com.erp.inventory.request.CreateGoodsShipmentRequest;
import com.erp.inventory.request.CreateInventoryMovementRequest;
import com.erp.purchase.entity.PurchaseOrder;
import com.erp.purchase.entity.PurchaseOrderLine;
import com.erp.purchase.repository.PurchaseOrderRepository;
import com.erp.sales.entity.SalesOrder;
import com.erp.sales.entity.SalesOrderLine;
import com.erp.sales.repository.SalesOrderRepository;

@Service
public class OrderFulfillmentService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final InventoryService inventoryService;
    private final JournalEntryRepository journalEntryRepository;
    private final AccountingPeriodRepository accountingPeriodRepository;
    private final GlAccountMappingService glAccountMappingService;
    private final DocumentNoService documentNoService;

    public OrderFulfillmentService(
            PurchaseOrderRepository purchaseOrderRepository,
            SalesOrderRepository salesOrderRepository,
            InventoryService inventoryService,
            JournalEntryRepository journalEntryRepository,
            AccountingPeriodRepository accountingPeriodRepository,
            GlAccountMappingService glAccountMappingService,
            DocumentNoService documentNoService) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.salesOrderRepository = salesOrderRepository;
        this.inventoryService = inventoryService;
        this.journalEntryRepository = journalEntryRepository;
        this.accountingPeriodRepository = accountingPeriodRepository;
        this.glAccountMappingService = glAccountMappingService;
        this.documentNoService = documentNoService;
    }

    @Transactional
    public com.erp.inventory.entity.InventoryMovement goodsReceiptFromPurchaseOrder(Long companyId, Long purchaseOrderId, CreateGoodsReceiptRequest request) {
        PurchaseOrder po = purchaseOrderRepository.findById(purchaseOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Purchase order not found"));

        if (po.getCompany() == null || po.getCompany().getId() == null || !po.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Purchase order company mismatch");
        }

        if (po.getStatus() != DocumentStatus.APPROVED && po.getStatus() != DocumentStatus.PARTIALLY_COMPLETED) {
            throw new IllegalArgumentException("Purchase Order must be APPROVED before Goods Receipt");
        }

        CreateInventoryMovementRequest moveReq = new CreateInventoryMovementRequest();
        moveReq.setMovementType(InventoryMovementType.IN);
        moveReq.setMovementDate(request.getMovementDate());
        moveReq.setDescription(request.getDescription() != null ? request.getDescription() : ("Goods Receipt for PO " + po.getDocumentNo()));

        if (request.getLines() == null || request.getLines().isEmpty()) {
            throw new IllegalArgumentException("Receipt lines must not be empty");
        }

        Map<Long, PurchaseOrderLine> lineById = po.getLines().stream()
                .collect(java.util.stream.Collectors.toMap(PurchaseOrderLine::getId, Function.identity()));

        List<CreateInventoryMovementRequest.CreateInventoryMovementLineRequest> lines = request.getLines().stream()
                .map(lr -> {
                    PurchaseOrderLine pol = lineById.get(lr.getPurchaseOrderLineId());
                    if (pol == null) {
                        throw new IllegalArgumentException("Purchase order line not found: " + lr.getPurchaseOrderLineId());
                    }
                    BigDecimal qty = lr.getQty();
                    if (qty == null || qty.compareTo(BigDecimal.ZERO) <= 0) {
                        throw new IllegalArgumentException("Qty must be > 0");
                    }
                    BigDecimal received = pol.getReceivedQty() != null ? pol.getReceivedQty() : BigDecimal.ZERO;
                    BigDecimal remaining = pol.getQty().subtract(received);
                    if (qty.compareTo(remaining) > 0) {
                        throw new IllegalArgumentException("Receipt qty exceeds remaining qty for purchaseOrderLineId=" + pol.getId());
                    }

                    pol.setReceivedQty(received.add(qty));
                    return toInLine(pol, qty, request.getToLocatorId());
                })
                .toList();
        moveReq.setLines(lines);

        com.erp.inventory.entity.InventoryMovement movement = inventoryService.createMovement(companyId, moveReq);

        // Post finance journal entry (minimal): Debit INVENTORY, Credit AP for received value
        BigDecimal receiptValue = BigDecimal.ZERO;
        for (CreateGoodsReceiptRequest.ReceiptLine lr : request.getLines()) {
            PurchaseOrderLine pol = lineById.get(lr.getPurchaseOrderLineId());
            BigDecimal qty = lr.getQty() != null ? lr.getQty() : BigDecimal.ZERO;
            BigDecimal price = pol != null && pol.getPrice() != null ? pol.getPrice() : BigDecimal.ZERO;
            receiptValue = receiptValue.add(price.multiply(qty));
        }

        if (receiptValue.compareTo(BigDecimal.ZERO) > 0) {
            JournalEntry je = new JournalEntry();
            je.setCompany(po.getCompany());
            je.setOrg(po.getOrg());
            je.setAccountingDate(request.getMovementDate());
            je.setDescription("Goods Receipt for PO " + po.getDocumentNo());
            je.setSourceDocumentType(DocumentType.INVENTORY_MOVEMENT);
            je.setSourceDocumentNo(movement.getDocumentNo());
            je.setDocumentNo(documentNoService.nextDocumentNo(companyId, DocumentType.JOURNAL_ENTRY));
            je.setStatus(DocumentStatus.COMPLETED);

            AccountingPeriod period = accountingPeriodRepository.findByCompanyIdAndDate(companyId, request.getMovementDate())
                    .orElseThrow(() -> new IllegalArgumentException("No accounting period for date"));
            je.setAccountingPeriod(period);

            List<JournalLine> jeLines = new ArrayList<>();
            // Debit Inventory
            JournalLine inv = new JournalLine();
            inv.setJournalEntry(je);
            inv.setAccountCode(GlAccountCode.INVENTORY);
            inv.setGlAccount(glAccountMappingService.resolve(companyId, GlAccountCode.INVENTORY));
            inv.setDebit(receiptValue);
            inv.setCredit(BigDecimal.ZERO);
            jeLines.add(inv);

            // Credit AP
            JournalLine ap = new JournalLine();
            ap.setJournalEntry(je);
            ap.setAccountCode(GlAccountCode.AP);
            ap.setGlAccount(glAccountMappingService.resolve(companyId, GlAccountCode.AP));
            ap.setDebit(BigDecimal.ZERO);
            ap.setCredit(receiptValue);
            jeLines.add(ap);

            je.setLines(jeLines);
            journalEntryRepository.save(je);
        }

        updatePurchaseOrderStatus(po);
        purchaseOrderRepository.save(po);
        return movement;
    }

    @Transactional
    public com.erp.inventory.entity.InventoryMovement goodsShipmentFromSalesOrder(Long companyId, Long salesOrderId, CreateGoodsShipmentRequest request) {
        SalesOrder so = salesOrderRepository.findById(salesOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Sales order not found"));

        if (so.getCompany() == null || so.getCompany().getId() == null || !so.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Sales order company mismatch");
        }

        CreateInventoryMovementRequest moveReq = new CreateInventoryMovementRequest();
        moveReq.setMovementType(InventoryMovementType.OUT);
        moveReq.setMovementDate(request.getMovementDate());
        moveReq.setDescription(request.getDescription() != null ? request.getDescription() : ("Goods Shipment for SO " + so.getDocumentNo()));

        if (request.getLines() == null || request.getLines().isEmpty()) {
            throw new IllegalArgumentException("Shipment lines must not be empty");
        }

        Map<Long, SalesOrderLine> lineById = so.getLines().stream()
                .collect(java.util.stream.Collectors.toMap(SalesOrderLine::getId, Function.identity()));

        List<CreateInventoryMovementRequest.CreateInventoryMovementLineRequest> lines = request.getLines().stream()
                .map(lr -> {
                    SalesOrderLine sol = lineById.get(lr.getSalesOrderLineId());
                    if (sol == null) {
                        throw new IllegalArgumentException("Sales order line not found: " + lr.getSalesOrderLineId());
                    }
                    BigDecimal qty = lr.getQty();
                    if (qty == null || qty.compareTo(BigDecimal.ZERO) <= 0) {
                        throw new IllegalArgumentException("Qty must be > 0");
                    }
                    BigDecimal shipped = sol.getShippedQty() != null ? sol.getShippedQty() : BigDecimal.ZERO;
                    BigDecimal remaining = sol.getQty().subtract(shipped);
                    if (qty.compareTo(remaining) > 0) {
                        throw new IllegalArgumentException("Shipment qty exceeds remaining qty for salesOrderLineId=" + sol.getId());
                    }

                    sol.setShippedQty(shipped.add(qty));
                    return toOutLine(sol, qty, request.getFromLocatorId());
                })
                .toList();
        moveReq.setLines(lines);

        com.erp.inventory.entity.InventoryMovement movement = inventoryService.createMovement(companyId, moveReq);
        updateSalesOrderStatus(so);
        salesOrderRepository.save(so);
        return movement;
    }

    private CreateInventoryMovementRequest.CreateInventoryMovementLineRequest toInLine(PurchaseOrderLine pol, BigDecimal qty, Long toLocatorId) {
        CreateInventoryMovementRequest.CreateInventoryMovementLineRequest line = new CreateInventoryMovementRequest.CreateInventoryMovementLineRequest();
        line.setProductId(pol.getProduct().getId());
        line.setQty(qty);
        line.setToLocatorId(toLocatorId);
        return line;
    }

    private CreateInventoryMovementRequest.CreateInventoryMovementLineRequest toOutLine(SalesOrderLine sol, BigDecimal qty, Long fromLocatorId) {
        CreateInventoryMovementRequest.CreateInventoryMovementLineRequest line = new CreateInventoryMovementRequest.CreateInventoryMovementLineRequest();
        line.setProductId(sol.getProduct().getId());
        line.setQty(qty);
        line.setFromLocatorId(fromLocatorId);
        return line;
    }

    private void updateSalesOrderStatus(SalesOrder so) {
        boolean anyShipped = false;
        boolean allShipped = true;
        if (so.getLines() != null) {
            for (SalesOrderLine l : so.getLines()) {
                BigDecimal shipped = l.getShippedQty() != null ? l.getShippedQty() : BigDecimal.ZERO;
                if (shipped.compareTo(BigDecimal.ZERO) > 0) {
                    anyShipped = true;
                }
                if (shipped.compareTo(l.getQty()) < 0) {
                    allShipped = false;
                }
            }
        } else {
            allShipped = false;
        }

        if (allShipped) {
            so.setStatus(DocumentStatus.COMPLETED);
        } else if (anyShipped) {
            so.setStatus(DocumentStatus.PARTIALLY_COMPLETED);
        }
    }

    private void updatePurchaseOrderStatus(PurchaseOrder po) {
        boolean anyReceived = false;
        boolean allReceived = true;
        if (po.getLines() != null) {
            for (PurchaseOrderLine l : po.getLines()) {
                BigDecimal received = l.getReceivedQty() != null ? l.getReceivedQty() : BigDecimal.ZERO;
                if (received.compareTo(BigDecimal.ZERO) > 0) {
                    anyReceived = true;
                }
                if (received.compareTo(l.getQty()) < 0) {
                    allReceived = false;
                }
            }
        } else {
            allReceived = false;
        }

        if (allReceived) {
            po.setStatus(DocumentStatus.COMPLETED);
        } else if (anyReceived) {
            po.setStatus(DocumentStatus.PARTIALLY_COMPLETED);
        }
    }
}
