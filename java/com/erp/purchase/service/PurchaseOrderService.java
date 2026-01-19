package com.erp.purchase.service;

import java.math.BigDecimal;
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
import com.erp.masterdata.entity.BusinessPartner;
import com.erp.masterdata.entity.PriceListVersion;
import com.erp.masterdata.entity.Product;
import com.erp.masterdata.entity.ProductPrice;
import com.erp.masterdata.repository.BusinessPartnerRepository;
import com.erp.masterdata.repository.PriceListVersionRepository;
import com.erp.masterdata.repository.ProductPriceRepository;
import com.erp.masterdata.repository.ProductRepository;
import com.erp.purchase.entity.PurchaseOrder;
import com.erp.purchase.entity.PurchaseOrderLine;
import com.erp.purchase.repository.PurchaseOrderRepository;
import com.erp.purchase.request.CreatePurchaseOrderRequest;
import com.erp.purchase.request.UpdatePurchaseOrderRequest;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final CompanyRepository companyRepository;
    private final OrgRepository orgRepository;
    private final BusinessPartnerRepository businessPartnerRepository;
    private final PriceListVersionRepository priceListVersionRepository;
    private final ProductRepository productRepository;
    private final ProductPriceRepository productPriceRepository;
    private final DocumentNoService documentNoService;

    public PurchaseOrderService(
            PurchaseOrderRepository purchaseOrderRepository,
            CompanyRepository companyRepository,
            OrgRepository orgRepository,
            BusinessPartnerRepository businessPartnerRepository,
            PriceListVersionRepository priceListVersionRepository,
            ProductRepository productRepository,
            ProductPriceRepository productPriceRepository,
            DocumentNoService documentNoService) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.companyRepository = companyRepository;
        this.orgRepository = orgRepository;
        this.businessPartnerRepository = businessPartnerRepository;
        this.priceListVersionRepository = priceListVersionRepository;
        this.productRepository = productRepository;
        this.productPriceRepository = productPriceRepository;
        this.documentNoService = documentNoService;
    }

    public List<PurchaseOrder> listByCompany(Long companyId) {
        return purchaseOrderRepository.findByCompanyId(companyId);
    }

    public PurchaseOrder get(Long companyId, Long purchaseOrderId) {
        PurchaseOrder po = purchaseOrderRepository.findById(purchaseOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Purchase Order not found"));
        if (po.getCompany() == null || po.getCompany().getId() == null || !po.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Purchase Order company mismatch");
        }
        return po;
    }

    @Transactional
    public PurchaseOrder create(Long companyId, CreatePurchaseOrderRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        Org org = null;
        if (request.getOrgId() != null) {
            org = orgRepository.findById(request.getOrgId())
                    .orElseThrow(() -> new IllegalArgumentException("Org not found"));
        }

        BusinessPartner vendor = businessPartnerRepository.findById(request.getVendorId())
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found"));

        PriceListVersion plv = priceListVersionRepository.findById(request.getPriceListVersionId())
                .orElseThrow(() -> new IllegalArgumentException("PriceListVersion not found"));

        PurchaseOrder po = new PurchaseOrder();
        po.setCompany(company);
        po.setOrg(org);
        po.setVendor(vendor);
        po.setPriceListVersion(plv);
        po.setOrderDate(request.getOrderDate());
        po.setDocumentNo(documentNoService.nextDocumentNo(companyId, DocumentType.PURCHASE_ORDER));

        List<PurchaseOrderLine> lines = new ArrayList<>();
        BigDecimal totalNet = BigDecimal.ZERO;

        for (CreatePurchaseOrderRequest.CreatePurchaseOrderLineRequest lineReq : request.getLines()) {
            Product product = productRepository.findById(lineReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            ProductPrice productPrice = productPriceRepository
                    .findByPriceListVersion_IdAndProduct_Id(plv.getId(), product.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Product price not found for productId=" + product.getId()));

            BigDecimal qty = lineReq.getQty();
            BigDecimal price = productPrice.getPrice();
            BigDecimal lineNet = price.multiply(qty);

            PurchaseOrderLine pol = new PurchaseOrderLine();
            pol.setPurchaseOrder(po);
            pol.setProduct(product);
            pol.setUom(product.getUom());
            pol.setQty(qty);
            pol.setPrice(price);
            pol.setLineNet(lineNet);

            lines.add(pol);
            totalNet = totalNet.add(lineNet);
        }

        po.setLines(lines);
        po.setTotalNet(totalNet);
        po.setTotalTax(BigDecimal.ZERO);
        po.setGrandTotal(totalNet);

        return purchaseOrderRepository.save(po);
    }

    @Transactional
    public PurchaseOrder update(Long companyId, Long purchaseOrderId, UpdatePurchaseOrderRequest request) {
        PurchaseOrder po = get(companyId, purchaseOrderId);
        if (po.getStatus() != DocumentStatus.DRAFTED) {
            throw new IllegalArgumentException("Only DRAFTED Purchase Order can be updated");
        }

        Org org = null;
        if (request.getOrgId() != null) {
            org = orgRepository.findById(request.getOrgId())
                    .orElseThrow(() -> new IllegalArgumentException("Org not found"));
        }

        BusinessPartner vendor = businessPartnerRepository.findById(request.getVendorId())
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found"));

        PriceListVersion plv = priceListVersionRepository.findById(request.getPriceListVersionId())
                .orElseThrow(() -> new IllegalArgumentException("PriceListVersion not found"));

        po.setOrg(org);
        po.setVendor(vendor);
        po.setPriceListVersion(plv);
        po.setOrderDate(request.getOrderDate());

        po.getLines().clear();
        BigDecimal totalNet = BigDecimal.ZERO;

        for (UpdatePurchaseOrderRequest.UpdatePurchaseOrderLineRequest lineReq : request.getLines()) {
            Product product = productRepository.findById(lineReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            ProductPrice productPrice = productPriceRepository
                    .findByPriceListVersion_IdAndProduct_Id(plv.getId(), product.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Product price not found for productId=" + product.getId()));

            BigDecimal qty = lineReq.getQty();
            BigDecimal price = productPrice.getPrice();
            BigDecimal lineNet = price.multiply(qty);

            PurchaseOrderLine pol = new PurchaseOrderLine();
            pol.setPurchaseOrder(po);
            pol.setProduct(product);
            pol.setUom(product.getUom());
            pol.setQty(qty);
            pol.setPrice(price);
            pol.setLineNet(lineNet);

            po.getLines().add(pol);
            totalNet = totalNet.add(lineNet);
        }

        po.setTotalNet(totalNet);
        po.setTotalTax(BigDecimal.ZERO);
        po.setGrandTotal(totalNet);

        return purchaseOrderRepository.save(po);
    }

    @Transactional
    public void delete(Long companyId, Long purchaseOrderId) {
        PurchaseOrder po = get(companyId, purchaseOrderId);
        if (po.getStatus() != DocumentStatus.DRAFTED) {
            throw new IllegalArgumentException("Only DRAFTED Purchase Order can be deleted");
        }
        purchaseOrderRepository.delete(po);
    }

    @Transactional
    public PurchaseOrder approve(Long companyId, Long purchaseOrderId) {
        PurchaseOrder po = get(companyId, purchaseOrderId);

        if (po.getStatus() != DocumentStatus.DRAFTED) {
            throw new IllegalArgumentException("Only DRAFTED Purchase Order can be approved");
        }

        po.setStatus(DocumentStatus.APPROVED);
        return purchaseOrderRepository.save(po);
    }
}
