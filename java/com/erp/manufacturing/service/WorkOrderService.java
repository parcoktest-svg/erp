package com.erp.manufacturing.service;

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
import com.erp.inventory.entity.InventoryMovement;
import com.erp.inventory.model.InventoryMovementType;
import com.erp.inventory.request.CreateInventoryMovementRequest;
import com.erp.inventory.service.InventoryService;
import com.erp.manufacturing.entity.Bom;
import com.erp.manufacturing.entity.BomLine;
import com.erp.manufacturing.entity.WorkOrder;
import com.erp.manufacturing.repository.BomRepository;
import com.erp.manufacturing.repository.WorkOrderRepository;
import com.erp.manufacturing.request.CompleteWorkOrderRequest;
import com.erp.manufacturing.request.CreateWorkOrderRequest;
import com.erp.manufacturing.request.UpdateWorkOrderRequest;
import com.erp.manufacturing.request.VoidWorkOrderRequest;

@Service
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final BomRepository bomRepository;
    private final CompanyRepository companyRepository;
    private final OrgRepository orgRepository;
    private final DocumentNoService documentNoService;
    private final InventoryService inventoryService;

    public WorkOrderService(
            WorkOrderRepository workOrderRepository,
            BomRepository bomRepository,
            CompanyRepository companyRepository,
            OrgRepository orgRepository,
            DocumentNoService documentNoService,
            InventoryService inventoryService) {
        this.workOrderRepository = workOrderRepository;
        this.bomRepository = bomRepository;
        this.companyRepository = companyRepository;
        this.orgRepository = orgRepository;
        this.documentNoService = documentNoService;
        this.inventoryService = inventoryService;
    }

    public List<WorkOrder> listByCompany(Long companyId) {
        return workOrderRepository.findByCompanyId(companyId);
    }

    public WorkOrder get(Long companyId, Long workOrderId) {
        WorkOrder wo = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Work order not found"));

        if (wo.getCompany() == null || wo.getCompany().getId() == null || !wo.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Work order company mismatch");
        }

        return wo;
    }

    @Transactional
    public WorkOrder create(Long companyId, CreateWorkOrderRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        Org org = null;
        if (request.getOrgId() != null) {
            org = orgRepository.findById(request.getOrgId())
                    .orElseThrow(() -> new IllegalArgumentException("Org not found"));
        }

        if (request.getQty() == null || request.getQty().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Qty must be > 0");
        }

        Bom bom = bomRepository.findById(request.getBomId())
                .orElseThrow(() -> new IllegalArgumentException("BOM not found"));

        if (bom.getCompany() == null || bom.getCompany().getId() == null || !bom.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("BOM company mismatch");
        }

        if (!bom.isActive()) {
            throw new IllegalArgumentException("BOM is not active");
        }

        WorkOrder wo = new WorkOrder();
        wo.setCompany(company);
        wo.setOrg(org);
        wo.setWorkDate(request.getWorkDate());
        wo.setBom(bom);
        wo.setProduct(bom.getProduct());
        wo.setQty(request.getQty());
        wo.setFromLocator(findLocator(companyId, request.getFromLocatorId(), "From locator not found"));
        wo.setToLocator(findLocator(companyId, request.getToLocatorId(), "To locator not found"));
        wo.setDocumentNo(documentNoService.nextDocumentNo(companyId, DocumentType.WORK_ORDER));
        wo.setDescription(request.getDescription());
        wo.setStatus(DocumentStatus.DRAFTED);

        return workOrderRepository.save(wo);
    }

    @Transactional
    public WorkOrder update(Long companyId, Long workOrderId, UpdateWorkOrderRequest request) {
        WorkOrder wo = get(companyId, workOrderId);

        if (wo.getStatus() != DocumentStatus.DRAFTED) {
            throw new IllegalArgumentException("Only DRAFTED Work Order can be updated");
        }

        Org org = null;
        if (request.getOrgId() != null) {
            org = orgRepository.findById(request.getOrgId())
                    .orElseThrow(() -> new IllegalArgumentException("Org not found"));
        }

        if (request.getQty() == null || request.getQty().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Qty must be > 0");
        }

        Bom bom = bomRepository.findById(request.getBomId())
                .orElseThrow(() -> new IllegalArgumentException("BOM not found"));

        if (bom.getCompany() == null || bom.getCompany().getId() == null || !bom.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("BOM company mismatch");
        }

        if (!bom.isActive()) {
            throw new IllegalArgumentException("BOM is not active");
        }

        wo.setOrg(org);
        wo.setWorkDate(request.getWorkDate());
        wo.setBom(bom);
        wo.setProduct(bom.getProduct());
        wo.setQty(request.getQty());
        wo.setFromLocator(findLocator(companyId, request.getFromLocatorId(), "From locator not found"));
        wo.setToLocator(findLocator(companyId, request.getToLocatorId(), "To locator not found"));
        wo.setDescription(request.getDescription());

        return workOrderRepository.save(wo);
    }

    @Transactional
    public void delete(Long companyId, Long workOrderId) {
        WorkOrder wo = get(companyId, workOrderId);

        if (wo.getStatus() != DocumentStatus.DRAFTED) {
            throw new IllegalArgumentException("Only DRAFTED Work Order can be deleted");
        }

        workOrderRepository.delete(wo);
    }

    @Transactional
    public WorkOrder complete(Long companyId, Long workOrderId, CompleteWorkOrderRequest request) {
        WorkOrder wo = get(companyId, workOrderId);

        if (wo.getStatus() == DocumentStatus.VOIDED) {
            throw new IllegalArgumentException("Cannot complete voided work order");
        }
        if (wo.getStatus() == DocumentStatus.COMPLETED) {
            return wo;
        }

        LocalDate completionDate = request.getCompletionDate();

        // 1) Validate on-hand for each component
        for (BomLine line : wo.getBom().getLines()) {
            BigDecimal required = line.getQty().multiply(wo.getQty());
            BigDecimal onHand = inventoryService.getOnHandQty(wo.getFromLocator().getId(), line.getComponentProduct().getId());
            if (onHand.compareTo(required) < 0) {
                throw new IllegalArgumentException("Insufficient on-hand for component productId=" + line.getComponentProduct().getId());
            }
        }

        // 2) Issue components (OUT)
        CreateInventoryMovementRequest issueReq = new CreateInventoryMovementRequest();
        issueReq.setMovementType(InventoryMovementType.OUT);
        issueReq.setMovementDate(completionDate);
        issueReq.setDescription("WO " + wo.getDocumentNo() + " issue components");

        List<CreateInventoryMovementRequest.CreateInventoryMovementLineRequest> issueLines = new ArrayList<>();
        for (BomLine line : wo.getBom().getLines()) {
            CreateInventoryMovementRequest.CreateInventoryMovementLineRequest l = new CreateInventoryMovementRequest.CreateInventoryMovementLineRequest();
            l.setProductId(line.getComponentProduct().getId());
            l.setQty(line.getQty().multiply(wo.getQty()));
            l.setFromLocatorId(wo.getFromLocator().getId());
            l.setToLocatorId(null);
            issueLines.add(l);
        }
        issueReq.setLines(issueLines);

        InventoryMovement issueMovement = inventoryService.createMovement(companyId, issueReq);

        // 3) Receive finished goods (IN)
        CreateInventoryMovementRequest receiptReq = new CreateInventoryMovementRequest();
        receiptReq.setMovementType(InventoryMovementType.IN);
        receiptReq.setMovementDate(completionDate);
        receiptReq.setDescription("WO " + wo.getDocumentNo() + " receipt finished goods");

        CreateInventoryMovementRequest.CreateInventoryMovementLineRequest receiptLine = new CreateInventoryMovementRequest.CreateInventoryMovementLineRequest();
        receiptLine.setProductId(wo.getProduct().getId());
        receiptLine.setQty(wo.getQty());
        receiptLine.setFromLocatorId(null);
        receiptLine.setToLocatorId(wo.getToLocator().getId());
        receiptReq.setLines(List.of(receiptLine));

        InventoryMovement receiptMovement = inventoryService.createMovement(companyId, receiptReq);

        wo.setIssueMovementDocNo(issueMovement.getDocumentNo());
        wo.setReceiptMovementDocNo(receiptMovement.getDocumentNo());
        wo.setStatus(DocumentStatus.COMPLETED);

        return workOrderRepository.save(wo);
    }

	@Transactional
	public WorkOrder voidWorkOrder(Long companyId, Long workOrderId, VoidWorkOrderRequest request) {
		WorkOrder wo = get(companyId, workOrderId);

		if (wo.getStatus() == DocumentStatus.VOIDED) {
			return wo;
		}

		// If already completed, create reversal movements to restore stock
		if (wo.getStatus() == DocumentStatus.COMPLETED) {
			// Reverse issue (OUT) by doing IN to fromLocator
			CreateInventoryMovementRequest issueRevReq = new CreateInventoryMovementRequest();
			issueRevReq.setMovementType(InventoryMovementType.IN);
			issueRevReq.setMovementDate(request.getVoidDate());
			issueRevReq.setDescription("WO " + wo.getDocumentNo() + " reversal issue");

			List<CreateInventoryMovementRequest.CreateInventoryMovementLineRequest> issueRevLines = new ArrayList<>();
			for (BomLine line : wo.getBom().getLines()) {
				CreateInventoryMovementRequest.CreateInventoryMovementLineRequest l = new CreateInventoryMovementRequest.CreateInventoryMovementLineRequest();
				l.setProductId(line.getComponentProduct().getId());
				l.setQty(line.getQty().multiply(wo.getQty()));
				l.setToLocatorId(wo.getFromLocator().getId());
				l.setFromLocatorId(null);
				issueRevLines.add(l);
			}
			issueRevReq.setLines(issueRevLines);
			InventoryMovement issueRevMovement = inventoryService.createMovement(companyId, issueRevReq);
			wo.setIssueReversalMovementDocNo(issueRevMovement.getDocumentNo());

			// Reverse receipt (IN) by doing OUT from toLocator
			CreateInventoryMovementRequest receiptRevReq = new CreateInventoryMovementRequest();
			receiptRevReq.setMovementType(InventoryMovementType.OUT);
			receiptRevReq.setMovementDate(request.getVoidDate());
			receiptRevReq.setDescription("WO " + wo.getDocumentNo() + " reversal receipt");

			CreateInventoryMovementRequest.CreateInventoryMovementLineRequest receiptRevLine = new CreateInventoryMovementRequest.CreateInventoryMovementLineRequest();
			receiptRevLine.setProductId(wo.getProduct().getId());
			receiptRevLine.setQty(wo.getQty());
			receiptRevLine.setFromLocatorId(wo.getToLocator().getId());
			receiptRevLine.setToLocatorId(null);
			receiptRevReq.setLines(List.of(receiptRevLine));
			InventoryMovement receiptRevMovement = inventoryService.createMovement(companyId, receiptRevReq);
			wo.setReceiptReversalMovementDocNo(receiptRevMovement.getDocumentNo());
		}

		wo.setStatus(DocumentStatus.VOIDED);
		return workOrderRepository.save(wo);
	}

	private com.erp.inventory.entity.Locator findLocator(Long companyId, Long locatorId, String notFoundMessage) {
		return inventoryService.listLocatorsByCompany(companyId).stream()
				.filter(l -> l.getId().equals(locatorId))
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException(notFoundMessage));
	}
}
