package com.erp.inventory.service;

import java.math.BigDecimal;
import java.time.LocalDate;
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
import com.erp.finance.entity.AccountingPeriod;
import com.erp.finance.entity.GlAccount;
import com.erp.finance.entity.JournalEntry;
import com.erp.finance.entity.JournalLine;
import com.erp.finance.model.GlAccountCode;
import com.erp.finance.repository.AccountingPeriodRepository;
import com.erp.finance.repository.GlAccountRepository;
import com.erp.finance.repository.JournalEntryRepository;
import com.erp.inventory.entity.InventoryAdjustment;
import com.erp.inventory.entity.InventoryAdjustmentLine;
import com.erp.inventory.entity.InventoryOnHand;
import com.erp.inventory.entity.Locator;
import com.erp.inventory.repository.InventoryAdjustmentLineRepository;
import com.erp.inventory.repository.InventoryAdjustmentRepository;
import com.erp.inventory.repository.InventoryOnHandRepository;
import com.erp.inventory.repository.LocatorRepository;
import com.erp.inventory.request.CreateInventoryAdjustmentRequest;
import com.erp.inventory.request.UpdateInventoryAdjustmentRequest;
import com.erp.masterdata.entity.Product;
import com.erp.masterdata.repository.ProductRepository;

@Service
public class InventoryAdjustmentService {

    private final InventoryAdjustmentRepository inventoryAdjustmentRepository;
    private final InventoryAdjustmentLineRepository inventoryAdjustmentLineRepository;
    private final CompanyRepository companyRepository;
    private final OrgRepository orgRepository;
    private final ProductRepository productRepository;
    private final LocatorRepository locatorRepository;
    private final InventoryOnHandRepository inventoryOnHandRepository;
    private final DocumentNoService documentNoService;
    private final JournalEntryRepository journalEntryRepository;
    private final GlAccountRepository glAccountRepository;
    private final AccountingPeriodRepository accountingPeriodRepository;

    public InventoryAdjustmentService(
            InventoryAdjustmentRepository inventoryAdjustmentRepository,
            InventoryAdjustmentLineRepository inventoryAdjustmentLineRepository,
            CompanyRepository companyRepository,
            OrgRepository orgRepository,
            ProductRepository productRepository,
            LocatorRepository locatorRepository,
            InventoryOnHandRepository inventoryOnHandRepository,
            DocumentNoService documentNoService,
            JournalEntryRepository journalEntryRepository,
            GlAccountRepository glAccountRepository,
            AccountingPeriodRepository accountingPeriodRepository) {
        this.inventoryAdjustmentRepository = inventoryAdjustmentRepository;
        this.inventoryAdjustmentLineRepository = inventoryAdjustmentLineRepository;
        this.companyRepository = companyRepository;
        this.orgRepository = orgRepository;
        this.productRepository = productRepository;
        this.locatorRepository = locatorRepository;
        this.inventoryOnHandRepository = inventoryOnHandRepository;
        this.documentNoService = documentNoService;
        this.journalEntryRepository = journalEntryRepository;
        this.glAccountRepository = glAccountRepository;
        this.accountingPeriodRepository = accountingPeriodRepository;
    }

    public List<InventoryAdjustment> listByCompany(Long companyId) {
        return inventoryAdjustmentRepository.findByCompanyId(companyId);
    }

    public InventoryAdjustment get(Long companyId, Long adjustmentId) {
        InventoryAdjustment adj = inventoryAdjustmentRepository.findById(adjustmentId)
                .orElseThrow(() -> new IllegalArgumentException("InventoryAdjustment not found"));

        if (adj.getCompany() == null || adj.getCompany().getId() == null || !adj.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Company mismatch");
        }

        return adj;
    }

    private InventoryOnHand getOrCreateOnHand(Long companyId, Company company, Product product, Locator locator) {
        return inventoryOnHandRepository
                .findByCompanyIdAndProductIdAndLocatorId(companyId, product.getId(), locator.getId())
                .orElseGet(() -> {
                    InventoryOnHand created = new InventoryOnHand();
                    created.setCompany(company);
                    created.setProduct(product);
                    created.setLocator(locator);
                    created.setQuantityOnHand(BigDecimal.ZERO);
                    return inventoryOnHandRepository.save(created);
                });
    }

    @Transactional
    public InventoryAdjustment create(Long companyId, CreateInventoryAdjustmentRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        Org org = null;
        if (request.getOrgId() != null) {
            org = orgRepository.findById(request.getOrgId())
                    .orElseThrow(() -> new IllegalArgumentException("Org not found"));
        }

        InventoryAdjustment adj = new InventoryAdjustment();
        adj.setCompany(company);
        adj.setOrg(org);
        adj.setDocumentNo(documentNoService.nextDocumentNo(companyId, DocumentType.INVENTORY_ADJUSTMENT));
        adj.setAdjustmentDate(request.getAdjustmentDate());
        adj.setDescription(request.getDescription());
        adj.setStatus(DocumentStatus.DRAFTED);

        List<InventoryAdjustmentLine> lines = new ArrayList<>();
        for (CreateInventoryAdjustmentRequest.CreateInventoryAdjustmentLineRequest lineReq : request.getLines()) {
            Product product = productRepository.findById(lineReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            if (product.getCompany() == null || product.getCompany().getId() == null || !product.getCompany().getId().equals(companyId)) {
                throw new IllegalArgumentException("Product company mismatch");
            }

            Locator locator = locatorRepository.findById(lineReq.getLocatorId())
                    .orElseThrow(() -> new IllegalArgumentException("Locator not found"));

            if (locator.getCompany() == null || locator.getCompany().getId() == null || !locator.getCompany().getId().equals(companyId)) {
                throw new IllegalArgumentException("Locator company mismatch");
            }

            InventoryOnHand onHand = getOrCreateOnHand(companyId, company, product, locator);

            BigDecimal qtyBefore = onHand.getQuantityOnHand();
            BigDecimal qtyAdjusted = lineReq.getQuantityAdjusted();
            BigDecimal qtyAfter = qtyBefore.add(qtyAdjusted);

            InventoryAdjustmentLine line = new InventoryAdjustmentLine();
            line.setAdjustment(adj);
            line.setProduct(product);
            line.setLocator(locator);
            line.setQuantityOnHandBefore(qtyBefore);
            line.setQuantityAdjusted(qtyAdjusted);
            line.setQuantityOnHandAfter(qtyAfter);
            line.setAdjustmentAmount(lineReq.getAdjustmentAmount());
            line.setNotes(lineReq.getNotes());

            lines.add(line);
        }

        adj.setLines(lines);
        return inventoryAdjustmentRepository.save(adj);
    }

    @Transactional
    public InventoryAdjustment update(Long companyId, Long adjustmentId, UpdateInventoryAdjustmentRequest request) {
        InventoryAdjustment adj = get(companyId, adjustmentId);

        if (adj.getStatus() != DocumentStatus.DRAFTED) {
            throw new IllegalArgumentException("Only DRAFTED adjustments can be updated");
        }

        Org org = null;
        if (request.getOrgId() != null) {
            org = orgRepository.findById(request.getOrgId())
                    .orElseThrow(() -> new IllegalArgumentException("Org not found"));
        }

        adj.setOrg(org);
        adj.setAdjustmentDate(request.getAdjustmentDate());
        adj.setDescription(request.getDescription());

        // orphanRemoval safe update
        adj.getLines().clear();

        for (UpdateInventoryAdjustmentRequest.UpdateInventoryAdjustmentLineRequest lineReq : request.getLines()) {
            Product product = productRepository.findById(lineReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            if (product.getCompany() == null || product.getCompany().getId() == null || !product.getCompany().getId().equals(companyId)) {
                throw new IllegalArgumentException("Product company mismatch");
            }

            Locator locator = locatorRepository.findById(lineReq.getLocatorId())
                    .orElseThrow(() -> new IllegalArgumentException("Locator not found"));

            if (locator.getCompany() == null || locator.getCompany().getId() == null || !locator.getCompany().getId().equals(companyId)) {
                throw new IllegalArgumentException("Locator company mismatch");
            }

            InventoryOnHand onHand = getOrCreateOnHand(companyId, adj.getCompany(), product, locator);
            BigDecimal qtyBefore = onHand.getQuantityOnHand();
            BigDecimal qtyAdjusted = lineReq.getQuantityAdjusted();
            BigDecimal qtyAfter = qtyBefore.add(qtyAdjusted);

            InventoryAdjustmentLine line = new InventoryAdjustmentLine();
            line.setAdjustment(adj);
            line.setProduct(product);
            line.setLocator(locator);
            line.setQuantityOnHandBefore(qtyBefore);
            line.setQuantityAdjusted(qtyAdjusted);
            line.setQuantityOnHandAfter(qtyAfter);
            line.setAdjustmentAmount(lineReq.getAdjustmentAmount());
            line.setNotes(lineReq.getNotes());
            adj.getLines().add(line);
        }

        return inventoryAdjustmentRepository.save(adj);
    }

    @Transactional
    public void delete(Long companyId, Long adjustmentId) {
        InventoryAdjustment adj = get(companyId, adjustmentId);

        if (adj.getStatus() != DocumentStatus.DRAFTED) {
            throw new IllegalArgumentException("Only DRAFTED adjustments can be deleted");
        }

        inventoryAdjustmentRepository.delete(adj);
    }

    @Transactional
    public InventoryAdjustment complete(Long companyId, Long adjustmentId) {
        InventoryAdjustment adj = inventoryAdjustmentRepository.findById(adjustmentId)
                .orElseThrow(() -> new IllegalArgumentException("InventoryAdjustment not found"));

        if (!adj.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Company mismatch");
        }

        if (adj.getStatus() != DocumentStatus.DRAFTED) {
            throw new IllegalArgumentException("Only DRAFTED adjustments can be completed");
        }

        // Update on-hand stock
        for (InventoryAdjustmentLine line : adj.getLines()) {
            InventoryOnHand onHand = getOrCreateOnHand(companyId, adj.getCompany(), line.getProduct(), line.getLocator());
            onHand.setQuantityOnHand(line.getQuantityOnHandAfter());
            inventoryOnHandRepository.save(onHand);
        }

        // Post journal entry
        JournalEntry je = new JournalEntry();
        je.setCompany(adj.getCompany());
        je.setOrg(adj.getOrg());
        je.setDocumentNo(documentNoService.nextDocumentNo(companyId, DocumentType.JOURNAL_ENTRY));
        je.setAccountingDate(adj.getAdjustmentDate());
        je.setSourceDocumentType(DocumentType.INVENTORY_ADJUSTMENT);
        je.setSourceDocumentNo(adj.getDocumentNo());
        je.setDescription("Inventory Adjustment: " + adj.getDescription());

        // Determine accounting period
        AccountingPeriod period = accountingPeriodRepository.findByCompanyIdAndDate(companyId, adj.getAdjustmentDate())
                .orElseThrow(() -> new IllegalArgumentException("No accounting period for date"));
        je.setAccountingPeriod(period);
        je.setStatus(DocumentStatus.COMPLETED);

        List<JournalLine> jeLines = new ArrayList<>();
        for (InventoryAdjustmentLine line : adj.getLines()) {
            // Inventory account (debit if increase, credit if decrease)
            GlAccount inventoryAccount = glAccountRepository.findByCompanyIdAndCode(companyId, "14000")
                    .orElseThrow(() -> new IllegalArgumentException("Inventory GL account not found"));

            JournalLine invLine = new JournalLine();
            invLine.setJournalEntry(je);
            invLine.setGlAccount(inventoryAccount);
            invLine.setAccountCode(GlAccountCode.INVENTORY);
            if (line.getQuantityAdjusted().compareTo(BigDecimal.ZERO) > 0) {
                invLine.setDebit(line.getAdjustmentAmount());
                invLine.setCredit(BigDecimal.ZERO);
            } else {
                invLine.setDebit(BigDecimal.ZERO);
                invLine.setCredit(line.getAdjustmentAmount().abs());
            }
            jeLines.add(invLine);

            // Adjustment/Expense account (credit if increase, debit if decrease)
            GlAccount adjAccount = glAccountRepository.findByCompanyIdAndCode(companyId, "51000")
                    .orElseThrow(() -> new IllegalArgumentException("Adjustment GL account not found"));

            JournalLine adjLine = new JournalLine();
            adjLine.setJournalEntry(je);
            adjLine.setGlAccount(adjAccount);
            adjLine.setAccountCode(GlAccountCode.ADJUSTMENT);
            if (line.getQuantityAdjusted().compareTo(BigDecimal.ZERO) > 0) {
                adjLine.setDebit(BigDecimal.ZERO);
                adjLine.setCredit(line.getAdjustmentAmount());
            } else {
                adjLine.setDebit(line.getAdjustmentAmount().abs());
                adjLine.setCredit(BigDecimal.ZERO);
            }
            jeLines.add(adjLine);
        }

        je.setLines(jeLines);
        JournalEntry savedJe = journalEntryRepository.save(je);

        adj.setJournalEntry(savedJe);
        adj.setStatus(DocumentStatus.COMPLETED);
        return inventoryAdjustmentRepository.save(adj);
    }

    @Transactional
    public InventoryAdjustment voidAdjustment(Long companyId, Long adjustmentId) {
        InventoryAdjustment adj = inventoryAdjustmentRepository.findById(adjustmentId)
                .orElseThrow(() -> new IllegalArgumentException("InventoryAdjustment not found"));

        if (!adj.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Company mismatch");
        }

        if (adj.getStatus() == DocumentStatus.VOIDED) {
            throw new IllegalArgumentException("Already voided");
        }

        // If already completed, reverse stock and journal
        if (adj.getStatus() == DocumentStatus.COMPLETED) {
            // Reverse on-hand
            for (InventoryAdjustmentLine line : adj.getLines()) {
                InventoryOnHand onHand = getOrCreateOnHand(companyId, adj.getCompany(), line.getProduct(), line.getLocator());
                onHand.setQuantityOnHand(line.getQuantityOnHandBefore());
                inventoryOnHandRepository.save(onHand);
            }

            // Reverse journal entry
            if (adj.getJournalEntry() != null) {
                // TODO: Implement reversal journal entry using existing JournalVoidService pattern
            }
        }

        adj.setStatus(DocumentStatus.VOIDED);
        return inventoryAdjustmentRepository.save(adj);
    }
}
