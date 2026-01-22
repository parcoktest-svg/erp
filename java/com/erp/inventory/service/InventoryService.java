package com.erp.inventory.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Locale;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.entity.Company;
import com.erp.core.entity.Org;
import com.erp.core.model.DocumentStatus;
import com.erp.core.model.DocumentType;
import com.erp.core.repository.CompanyRepository;
import com.erp.core.repository.OrgRepository;
import com.erp.core.service.DocumentNoService;
import com.erp.inventory.entity.InventoryMovement;
import com.erp.inventory.entity.InventoryMovementLine;
import com.erp.inventory.entity.Locator;
import com.erp.inventory.entity.StockTransaction;
import com.erp.inventory.model.InventoryMovementType;
import com.erp.inventory.repository.InventoryMovementRepository;
import com.erp.inventory.repository.LocatorRepository;
import com.erp.inventory.repository.StockTransactionRepository;
import com.erp.inventory.request.CreateInventoryMovementRequest;
import com.erp.inventory.request.CreateLocatorRequest;
import com.erp.inventory.dto.OnHandByProductRow;
import com.erp.masterdata.entity.Product;
import com.erp.masterdata.entity.Warehouse;
import com.erp.masterdata.repository.ProductRepository;
import com.erp.masterdata.repository.WarehouseRepository;

@Service
public class InventoryService {

    private final CompanyRepository companyRepository;
    private final OrgRepository orgRepository;
    private final WarehouseRepository warehouseRepository;
    private final LocatorRepository locatorRepository;
    private final ProductRepository productRepository;
    private final InventoryMovementRepository inventoryMovementRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final DocumentNoService documentNoService;

    public InventoryService(
            CompanyRepository companyRepository,
            OrgRepository orgRepository,
            WarehouseRepository warehouseRepository,
            LocatorRepository locatorRepository,
            ProductRepository productRepository,
            InventoryMovementRepository inventoryMovementRepository,
            StockTransactionRepository stockTransactionRepository,
            DocumentNoService documentNoService) {
        this.companyRepository = companyRepository;
        this.orgRepository = orgRepository;
        this.warehouseRepository = warehouseRepository;
        this.locatorRepository = locatorRepository;
        this.productRepository = productRepository;
        this.inventoryMovementRepository = inventoryMovementRepository;
        this.stockTransactionRepository = stockTransactionRepository;
        this.documentNoService = documentNoService;
    }

    public List<Locator> listLocatorsByCompany(Long companyId) {
        return locatorRepository.findByCompanyId(companyId);
    }

    public List<Locator> listLocatorsByWarehouse(Long warehouseId) {
        return locatorRepository.findByWarehouseId(warehouseId);
    }

    @Transactional
    public Locator createLocator(Long companyId, CreateLocatorRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found"));

        Org org = null;
        if (request.getOrgId() != null) {
            org = orgRepository.findById(request.getOrgId())
                    .orElseThrow(() -> new IllegalArgumentException("Org not found"));
        }

        Locator locator = new Locator();
        locator.setCompany(company);
        locator.setWarehouse(warehouse);
        locator.setOrg(org);
        locator.setCode(request.getCode());
        locator.setName(request.getName());
        locator.setActive(true);

        return locatorRepository.save(locator);
    }

    public List<InventoryMovement> listMovementsByCompany(Long companyId) {
        return inventoryMovementRepository.findByCompanyId(companyId);
    }

    public List<InventoryMovement> listMovements(Long companyId, InventoryMovementType movementType, String q, Long salesOrderId) {
        List<InventoryMovement> base = inventoryMovementRepository.findByCompanyId(companyId);
        if ((movementType == null) && (salesOrderId == null) && (q == null || q.isBlank())) {
            return base;
        }

        final String qq = (q == null) ? null : q.trim().toLowerCase(Locale.ROOT);
        List<InventoryMovement> out = new ArrayList<>();
        for (InventoryMovement m : base) {
            if (movementType != null) {
                if (m == null || m.getMovementType() == null || !m.getMovementType().equals(movementType)) {
                    continue;
                }
            }
            if (salesOrderId != null) {
                if (m == null || m.getSalesOrderId() == null || !m.getSalesOrderId().equals(salesOrderId)) {
                    continue;
                }
            }
            if (qq != null && !qq.isBlank()) {
                String dn = m != null && m.getDocumentNo() != null ? m.getDocumentNo() : "";
                String desc = m != null && m.getDescription() != null ? m.getDescription() : "";
                String dt = m != null && m.getMovementDate() != null ? String.valueOf(m.getMovementDate()) : "";
                String hay = (dn + " " + desc + " " + dt).toLowerCase(Locale.ROOT);
                if (!hay.contains(qq)) {
                    continue;
                }
            }
            out.add(m);
        }
        return out;
    }

    public BigDecimal getOnHandQty(Long locatorId, Long productId) {
        return stockTransactionRepository.sumQtyByLocatorAndProduct(locatorId, productId);
    }

    public List<OnHandByProductRow> getOnHandByLocator(Long companyId, Long locatorId) {
        List<Object[]> rows = stockTransactionRepository.sumQtyByLocatorGroupedByProduct(companyId, locatorId);
        List<OnHandByProductRow> out = new ArrayList<>();
        for (Object[] r : rows) {
            Long productId = (Long) r[0];
            BigDecimal qty = (BigDecimal) r[1];
            out.add(new OnHandByProductRow(locatorId, productId, qty));
        }
        return out;
    }

    @Transactional
    public InventoryMovement createMovement(Long companyId, CreateInventoryMovementRequest request) {
        return createMovement(companyId, request, null);
    }

    @Transactional
    public InventoryMovement createMovement(Long companyId, CreateInventoryMovementRequest request, Long salesOrderId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        InventoryMovement movement = new InventoryMovement();
        movement.setCompany(company);
        movement.setMovementType(request.getMovementType());
        movement.setMovementDate(request.getMovementDate());
        movement.setDescription(request.getDescription());
        movement.setSalesOrderId(salesOrderId);
        movement.setDocumentNo(documentNoService.nextDocumentNo(companyId, DocumentType.INVENTORY_MOVEMENT));

        List<InventoryMovementLine> lines = new ArrayList<>();
        for (CreateInventoryMovementRequest.CreateInventoryMovementLineRequest lineReq : request.getLines()) {
            validateMovementLine(request.getMovementType(), lineReq);

            Product product = productRepository.findById(lineReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            Locator fromLocator = null;
            Locator toLocator = null;
            if (lineReq.getFromLocatorId() != null) {
                fromLocator = locatorRepository.findById(lineReq.getFromLocatorId())
                        .orElseThrow(() -> new IllegalArgumentException("From locator not found"));
                assertValidLocator(companyId, fromLocator, "From locator");
            }
            if (lineReq.getToLocatorId() != null) {
                toLocator = locatorRepository.findById(lineReq.getToLocatorId())
                        .orElseThrow(() -> new IllegalArgumentException("To locator not found"));
                assertValidLocator(companyId, toLocator, "To locator");
            }

            InventoryMovementLine line = new InventoryMovementLine();
            line.setMovement(movement);
            line.setProduct(product);
            line.setQty(lineReq.getQty());
            line.setFromLocator(fromLocator);
            line.setToLocator(toLocator);

            lines.add(line);

            // Prevent negative stock
            if (request.getMovementType() == InventoryMovementType.OUT) {
                assertSufficientOnHand(fromLocator, product, lineReq.getQty());
            }
            if (request.getMovementType() == InventoryMovementType.TRANSFER) {
                assertSufficientOnHand(fromLocator, product, lineReq.getQty());
            }
        }

        movement.setLines(lines);
        return inventoryMovementRepository.save(movement);
    }

    private InventoryMovement getMovement(Long companyId, Long movementId) {
        InventoryMovement m = inventoryMovementRepository.findById(movementId)
                .orElseThrow(() -> new IllegalArgumentException("InventoryMovement not found"));
        if (m.getCompany() == null || m.getCompany().getId() == null || !m.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Company mismatch");
        }
        return m;
    }

    @Transactional
    public InventoryMovement completeMovement(Long companyId, Long movementId) {
        InventoryMovement m = getMovement(companyId, movementId);
        if (m.getStatus() != DocumentStatus.DRAFTED) {
            throw new IllegalArgumentException("Only DRAFTED movement can be completed");
        }

        // Option A: stock is posted on COMPLETE (not on CREATE).
        // Protect against double posting for legacy data created before this rule.
        List<StockTransaction> existing = stockTransactionRepository.findByCompanyIdAndReferenceDocNo(companyId, m.getDocumentNo());
        if (existing == null || existing.isEmpty()) {
            if (m.getLines() == null || m.getLines().isEmpty()) {
                throw new IllegalArgumentException("Movement has no lines");
            }

            for (InventoryMovementLine ln : m.getLines()) {
                if (ln.getProduct() == null || ln.getProduct().getId() == null) {
                    throw new IllegalArgumentException("Movement line product is required");
                }
                if (ln.getQty() == null || ln.getQty().compareTo(BigDecimal.ZERO) <= 0) {
                    throw new IllegalArgumentException("Movement line qty must be > 0");
                }

                // Re-check negative stock at completion time
                if (m.getMovementType() == InventoryMovementType.OUT || m.getMovementType() == InventoryMovementType.TRANSFER) {
                    assertSufficientOnHand(ln.getFromLocator(), ln.getProduct(), ln.getQty());
                }

                createStockTransactions(m.getCompany(), m.getDocumentNo(), ln.getProduct(), ln.getQty(), ln.getFromLocator(), ln.getToLocator(), m.getMovementType());
            }
        }

        m.setStatus(DocumentStatus.COMPLETED);
        return inventoryMovementRepository.save(m);
    }

    @Transactional
    public InventoryMovement voidMovement(Long companyId, Long movementId) {
        InventoryMovement m = getMovement(companyId, movementId);
        if (m.getStatus() != DocumentStatus.DRAFTED) {
            throw new IllegalArgumentException("Only DRAFTED movement can be voided");
        }

        // Option A: DRAFT should not have stock impact. If legacy data has already posted stock,
        // do not allow void here (it would require reversal logic, which is Option B).
        List<StockTransaction> existing = stockTransactionRepository.findByCompanyIdAndReferenceDocNo(companyId, m.getDocumentNo());
        if (existing != null && !existing.isEmpty()) {
            throw new IllegalArgumentException("Cannot void movement because stock transactions already exist (legacy data)");
        }

        m.setStatus(DocumentStatus.VOIDED);
        return inventoryMovementRepository.save(m);
    }

    private void validateMovementLine(InventoryMovementType type, CreateInventoryMovementRequest.CreateInventoryMovementLineRequest lineReq) {
        if (lineReq.getQty() == null || lineReq.getQty().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Qty must be > 0");
        }

        switch (type) {
            case IN -> {
                if (lineReq.getToLocatorId() == null) {
                    throw new IllegalArgumentException("IN movement requires toLocatorId");
                }
            }
            case OUT -> {
                if (lineReq.getFromLocatorId() == null) {
                    throw new IllegalArgumentException("OUT movement requires fromLocatorId");
                }
            }
            case TRANSFER -> {
                if (lineReq.getFromLocatorId() == null || lineReq.getToLocatorId() == null) {
                    throw new IllegalArgumentException("TRANSFER movement requires fromLocatorId and toLocatorId");
                }
                if (lineReq.getFromLocatorId().equals(lineReq.getToLocatorId())) {
                    throw new IllegalArgumentException("TRANSFER fromLocatorId and toLocatorId must differ");
                }
            }
        }
    }

    private void createStockTransactions(
            Company company,
            String referenceDocNo,
            Product product,
            BigDecimal qty,
            Locator fromLocator,
            Locator toLocator,
            InventoryMovementType movementType) {

        Instant now = Instant.now();

        if (movementType == InventoryMovementType.IN) {
            StockTransaction txn = new StockTransaction();
            txn.setCompany(company);
            txn.setLocator(toLocator);
            txn.setProduct(product);
            txn.setQty(qty);
            txn.setMovementTime(now);
            txn.setReferenceDocNo(referenceDocNo);
            stockTransactionRepository.save(txn);
            return;
        }

        if (movementType == InventoryMovementType.OUT) {
            StockTransaction txn = new StockTransaction();
            txn.setCompany(company);
            txn.setLocator(fromLocator);
            txn.setProduct(product);
            txn.setQty(qty.negate());
            txn.setMovementTime(now);
            txn.setReferenceDocNo(referenceDocNo);
            stockTransactionRepository.save(txn);
            return;
        }

        // TRANSFER
        StockTransaction outTxn = new StockTransaction();
        outTxn.setCompany(company);
        outTxn.setLocator(fromLocator);
        outTxn.setProduct(product);
        outTxn.setQty(qty.negate());
        outTxn.setMovementTime(now);
        outTxn.setReferenceDocNo(referenceDocNo);
        stockTransactionRepository.save(outTxn);

        StockTransaction inTxn = new StockTransaction();
        inTxn.setCompany(company);
        inTxn.setLocator(toLocator);
        inTxn.setProduct(product);
        inTxn.setQty(qty);
        inTxn.setMovementTime(now);
        inTxn.setReferenceDocNo(referenceDocNo);
        stockTransactionRepository.save(inTxn);
    }

    private void assertValidLocator(Long companyId, Locator locator, String label) {
        if (locator == null || locator.getId() == null) {
            throw new IllegalArgumentException(label + " is required");
        }
        if (locator.getCompany() == null || locator.getCompany().getId() == null || !locator.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException(label + " company mismatch");
        }
        if (!locator.isActive()) {
            throw new IllegalArgumentException(label + " is inactive");
        }
    }

    private void assertSufficientOnHand(Locator fromLocator, Product product, BigDecimal qtyOut) {
        if (fromLocator == null || fromLocator.getId() == null) {
            throw new IllegalArgumentException("From locator is required");
        }
        if (product == null || product.getId() == null) {
            throw new IllegalArgumentException("Product is required");
        }
        BigDecimal onHand = stockTransactionRepository.sumQtyByLocatorAndProduct(fromLocator.getId(), product.getId());
        if (onHand == null) {
            onHand = BigDecimal.ZERO;
        }
        if (qtyOut == null) {
            qtyOut = BigDecimal.ZERO;
        }
        if (onHand.compareTo(qtyOut) < 0) {
            throw new IllegalArgumentException(
                    "Insufficient stock for productId=" + product.getId()
                            + " at locatorId=" + fromLocator.getId()
                            + " (onHand=" + onHand + ", qty=" + qtyOut + ")");
        }
    }
}
