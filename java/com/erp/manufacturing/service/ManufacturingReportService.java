package com.erp.manufacturing.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.erp.core.model.DocumentStatus;
import com.erp.manufacturing.dto.ProductionCostLineDto;
import com.erp.manufacturing.dto.ProductionCostReportDto;
import com.erp.manufacturing.dto.WipReportDto;
import com.erp.manufacturing.dto.WipWorkOrderRowDto;
import com.erp.manufacturing.entity.Bom;
import com.erp.manufacturing.entity.BomLine;
import com.erp.manufacturing.entity.WorkOrder;
import com.erp.manufacturing.repository.BomRepository;
import com.erp.manufacturing.repository.WorkOrderRepository;
import com.erp.masterdata.entity.ProductPrice;
import com.erp.masterdata.repository.ProductPriceRepository;

@Service
public class ManufacturingReportService {

    private final WorkOrderRepository workOrderRepository;
    private final BomRepository bomRepository;
    private final ProductPriceRepository productPriceRepository;

    public ManufacturingReportService(
            WorkOrderRepository workOrderRepository,
            BomRepository bomRepository,
            ProductPriceRepository productPriceRepository) {
        this.workOrderRepository = workOrderRepository;
        this.bomRepository = bomRepository;
        this.productPriceRepository = productPriceRepository;
    }

    public WipReportDto wip(Long companyId) {
        WipReportDto dto = new WipReportDto();

        for (WorkOrder wo : workOrderRepository.findByCompanyIdAndStatusNot(companyId, DocumentStatus.COMPLETED)) {
            WipWorkOrderRowDto row = new WipWorkOrderRowDto();
            row.setWorkOrderId(wo.getId());
            row.setDocumentNo(wo.getDocumentNo());
            row.setStatus(wo.getStatus());
            row.setWorkDate(wo.getWorkDate());
            row.setBomId(wo.getBom() != null ? wo.getBom().getId() : null);
            row.setProductId(wo.getProduct() != null ? wo.getProduct().getId() : null);
            row.setQty(wo.getQty());
            row.setFromLocatorId(wo.getFromLocator() != null ? wo.getFromLocator().getId() : null);
            row.setToLocatorId(wo.getToLocator() != null ? wo.getToLocator().getId() : null);
            row.setIssueMovementDocNo(wo.getIssueMovementDocNo());
            row.setReceiptMovementDocNo(wo.getReceiptMovementDocNo());
            dto.getRows().add(row);
        }

        return dto;
    }

    public ProductionCostReportDto productionCost(Long companyId, Long bomId, BigDecimal qty, Long priceListVersionId) {
        if (qty == null || qty.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("qty must be > 0");
        }
        if (priceListVersionId == null) {
            throw new IllegalArgumentException("priceListVersionId is required");
        }

        Bom bom = bomRepository.findById(bomId)
                .orElseThrow(() -> new IllegalArgumentException("BOM not found"));

        if (bom.getCompany() == null || bom.getCompany().getId() == null || !bom.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("BOM company mismatch");
        }

        ProductionCostReportDto dto = new ProductionCostReportDto();
        dto.setBomId(bom.getId());
        dto.setFinishedProductId(bom.getProduct() != null ? bom.getProduct().getId() : null);
        dto.setWorkOrderQty(qty);
        dto.setPriceListVersionId(priceListVersionId);

        BigDecimal total = BigDecimal.ZERO;

        for (BomLine line : bom.getLines()) {
            BigDecimal required = line.getQty().multiply(qty);

            BigDecimal unitPrice = BigDecimal.ZERO;
            ProductPrice pp = productPriceRepository.findByPriceListVersion_IdAndProduct_Id(priceListVersionId, line.getComponentProduct().getId())
                    .orElse(null);
            if (pp != null && pp.getPrice() != null) {
                unitPrice = pp.getPrice();
            }

            BigDecimal lineCost = unitPrice.multiply(required);

            ProductionCostLineDto l = new ProductionCostLineDto();
            l.setComponentProductId(line.getComponentProduct().getId());
            l.setRequiredQty(required);
            l.setUnitPrice(unitPrice);
            l.setLineCost(lineCost);

            dto.getLines().add(l);
            total = total.add(lineCost);
        }

        dto.setTotalCost(total);
        return dto;
    }
}
