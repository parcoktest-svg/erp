package com.erp.sales.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.model.DocumentStatus;
import com.erp.manufacturing.entity.Bom;
import com.erp.manufacturing.entity.BomLine;
import com.erp.manufacturing.repository.BomRepository;
import com.erp.masterdata.entity.Product;
import com.erp.masterdata.repository.ProductRepository;
import com.erp.sales.entity.SalesOrder;
import com.erp.sales.entity.SalesOrderLine;
import com.erp.sales.entity.SalesOrderLineBom;
import com.erp.sales.entity.SalesOrderLineBomLine;
import com.erp.sales.repository.SalesOrderLineBomRepository;
import com.erp.sales.repository.SalesOrderRepository;
import com.erp.sales.request.SetSalesOrderLineBomRequest;

@Service
public class SalesOrderBomService {

    private final SalesOrderRepository salesOrderRepository;
    private final SalesOrderLineBomRepository salesOrderLineBomRepository;
    private final BomRepository bomRepository;
    private final ProductRepository productRepository;

    public SalesOrderBomService(
            SalesOrderRepository salesOrderRepository,
            SalesOrderLineBomRepository salesOrderLineBomRepository,
            BomRepository bomRepository,
            ProductRepository productRepository) {
        this.salesOrderRepository = salesOrderRepository;
        this.salesOrderLineBomRepository = salesOrderLineBomRepository;
        this.bomRepository = bomRepository;
        this.productRepository = productRepository;
    }

    public List<SalesOrderLineBom> listBySalesOrder(Long companyId, Long salesOrderId) {
        SalesOrder so = salesOrderRepository.findById(salesOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Sales Order not found"));
        if (so.getCompany() == null || so.getCompany().getId() == null || !so.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Sales Order company mismatch");
        }
        return salesOrderLineBomRepository.findBySalesOrderLine_SalesOrder_Id(so.getId());
    }

    @Transactional
    public SalesOrderLineBom setLineBom(Long companyId, Long salesOrderId, SetSalesOrderLineBomRequest request) {
        SalesOrder so = salesOrderRepository.findById(salesOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Sales Order not found"));
        if (so.getCompany() == null || so.getCompany().getId() == null || !so.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Sales Order company mismatch");
        }
        if (so.getStatus() != DocumentStatus.DRAFTED) {
            throw new IllegalArgumentException("Only DRAFTED Sales Order can update BOM");
        }

        SalesOrderLine sol = (so.getLines() == null ? List.<SalesOrderLine>of() : so.getLines()).stream()
                .filter(l -> l.getId() != null && l.getId().equals(request.getSalesOrderLineId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Sales Order line not found"));

        SalesOrderLineBom bomSnap = salesOrderLineBomRepository.findBySalesOrderLine_Id(sol.getId())
                .orElseGet(SalesOrderLineBom::new);

        bomSnap.setSalesOrderLine(sol);
        bomSnap.setSourceBomId(request.getSourceBomId());
        bomSnap.setSourceBomVersion(request.getSourceBomVersion());

        bomSnap.getLines().clear();

        if (request.getSourceBomId() != null) {
            Bom master = bomRepository.findById(request.getSourceBomId())
                    .orElseThrow(() -> new IllegalArgumentException("BOM not found"));
            if (master.getCompany() == null || master.getCompany().getId() == null || !master.getCompany().getId().equals(companyId)) {
                throw new IllegalArgumentException("BOM company mismatch");
            }
            if (!master.isActive()) {
                throw new IllegalArgumentException("BOM is not active");
            }
            if (master.getProduct() == null || sol.getProduct() == null || master.getProduct().getId() == null
                    || sol.getProduct().getId() == null || !master.getProduct().getId().equals(sol.getProduct().getId())) {
                throw new IllegalArgumentException("BOM product must match Sales Order line product");
            }

            for (BomLine l : master.getLines()) {
                SalesOrderLineBomLine snapLine = new SalesOrderLineBomLine();
                snapLine.setSalesOrderLineBom(bomSnap);
                snapLine.setComponentProduct(l.getComponentProduct());
                snapLine.setQty(l.getQty());
                bomSnap.getLines().add(snapLine);
            }
            bomSnap.setSourceBomVersion(master.getVersion());
        } else if (request.getLines() != null) {
            for (SetSalesOrderLineBomRequest.SetSalesOrderLineBomLineRequest lineReq : request.getLines()) {
                Product component = productRepository.findById(lineReq.getComponentProductId())
                        .orElseThrow(() -> new IllegalArgumentException("Component product not found"));
                if (component.getCompany() == null || component.getCompany().getId() == null
                        || !component.getCompany().getId().equals(companyId)) {
                    throw new IllegalArgumentException("Component product company mismatch");
                }
                SalesOrderLineBomLine snapLine = new SalesOrderLineBomLine();
                snapLine.setSalesOrderLineBom(bomSnap);
                snapLine.setComponentProduct(component);
                snapLine.setQty(lineReq.getQty());
                snapLine.setBomCode(lineReq.getBomCode());
                snapLine.setDescription1(lineReq.getDescription1());
                snapLine.setColorDescription2(lineReq.getColorDescription2());
                snapLine.setUnit(lineReq.getUnit());
                snapLine.setUnitPriceForeign(lineReq.getUnitPriceForeign());
                snapLine.setUnitPriceDomestic(lineReq.getUnitPriceDomestic());
                snapLine.setYy(lineReq.getYy());
                snapLine.setExchangeRate(lineReq.getExchangeRate());
                snapLine.setAmountForeign(lineReq.getAmountForeign());
                snapLine.setAmountDomestic(lineReq.getAmountDomestic());
                snapLine.setCurrencyId(lineReq.getCurrencyId());
                bomSnap.getLines().add(snapLine);
            }
        }

        return salesOrderLineBomRepository.save(bomSnap);
    }

    @Transactional
    public void copyFromSalesOrder(Long companyId, Long salesOrderId, Long fromSalesOrderId) {
        SalesOrder target = salesOrderRepository.findById(salesOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Sales Order not found"));
        if (target.getCompany() == null || target.getCompany().getId() == null || !target.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Sales Order company mismatch");
        }
        if (target.getStatus() != DocumentStatus.DRAFTED) {
            throw new IllegalArgumentException("Only DRAFTED Sales Order can copy BOM");
        }

        SalesOrder from = salesOrderRepository.findById(fromSalesOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Source Sales Order not found"));
        if (from.getCompany() == null || from.getCompany().getId() == null || !from.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Source Sales Order company mismatch");
        }

        List<SalesOrderLineBom> fromBoms = salesOrderLineBomRepository.findBySalesOrderLine_SalesOrder_Id(from.getId());

        for (SalesOrderLineBom src : fromBoms) {
            if (src.getSalesOrderLine() == null || src.getSalesOrderLine().getProduct() == null) continue;
            Long productId = src.getSalesOrderLine().getProduct().getId();
            if (productId == null) continue;

            String style = src.getSalesOrderLine().getStyle();
            String color = src.getSalesOrderLine().getColor();
            String size = src.getSalesOrderLine().getSize();
            String nationalSize = src.getSalesOrderLine().getNationalSize();

            SalesOrderLine targetLine = (target.getLines() == null ? List.<SalesOrderLine>of() : target.getLines()).stream()
                    .filter(l -> {
                        if (l.getProduct() == null || l.getProduct().getId() == null || !l.getProduct().getId().equals(productId)) return false;
                        if (style != null && (l.getStyle() == null || !l.getStyle().equals(style))) return false;
                        if (style == null && l.getStyle() != null) return false;
                        if (color != null && (l.getColor() == null || !l.getColor().equals(color))) return false;
                        if (color == null && l.getColor() != null) return false;
                        if (size != null && (l.getSize() == null || !l.getSize().equals(size))) return false;
                        if (size == null && l.getSize() != null) return false;
                        if (nationalSize != null && (l.getNationalSize() == null || !l.getNationalSize().equals(nationalSize))) return false;
                        if (nationalSize == null && l.getNationalSize() != null) return false;
                        return true;
                    })
                    .findFirst()
                    .orElse(null);

            if (targetLine == null) continue;

            SalesOrderLineBom tgt = salesOrderLineBomRepository.findBySalesOrderLine_Id(targetLine.getId())
                    .orElseGet(SalesOrderLineBom::new);
            tgt.setSalesOrderLine(targetLine);
            tgt.setSourceBomId(src.getSourceBomId());
            tgt.setSourceBomVersion(src.getSourceBomVersion());

            tgt.getLines().clear();
            if (src.getLines() != null) {
                for (SalesOrderLineBomLine srcLine : src.getLines()) {
                    SalesOrderLineBomLine l = new SalesOrderLineBomLine();
                    l.setSalesOrderLineBom(tgt);
                    l.setComponentProduct(srcLine.getComponentProduct());
                    l.setQty(srcLine.getQty());
                    l.setBomCode(srcLine.getBomCode());
                    l.setDescription1(srcLine.getDescription1());
                    l.setColorDescription2(srcLine.getColorDescription2());
                    l.setUnit(srcLine.getUnit());
                    l.setUnitPriceForeign(srcLine.getUnitPriceForeign());
                    l.setUnitPriceDomestic(srcLine.getUnitPriceDomestic());
                    l.setYy(srcLine.getYy());
                    l.setExchangeRate(srcLine.getExchangeRate());
                    l.setAmountForeign(srcLine.getAmountForeign());
                    l.setAmountDomestic(srcLine.getAmountDomestic());
                    l.setCurrencyId(srcLine.getCurrencyId());
                    tgt.getLines().add(l);
                }
            }
            salesOrderLineBomRepository.save(tgt);
        }
    }
}
