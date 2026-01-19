package com.erp.manufacturing.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.entity.Company;
import com.erp.core.entity.Org;
import com.erp.core.repository.CompanyRepository;
import com.erp.core.repository.OrgRepository;
import com.erp.manufacturing.entity.Bom;
import com.erp.manufacturing.entity.BomLine;
import com.erp.manufacturing.repository.BomRepository;
import com.erp.manufacturing.repository.WorkOrderRepository;
import com.erp.manufacturing.request.CreateBomRequest;
import com.erp.manufacturing.request.UpdateBomRequest;
import com.erp.masterdata.entity.Product;
import com.erp.masterdata.repository.ProductRepository;

@Service
public class BomService {

    private final BomRepository bomRepository;
    private final CompanyRepository companyRepository;
    private final OrgRepository orgRepository;
    private final ProductRepository productRepository;
    private final WorkOrderRepository workOrderRepository;

    public BomService(
            BomRepository bomRepository,
            CompanyRepository companyRepository,
            OrgRepository orgRepository,
            ProductRepository productRepository,
            WorkOrderRepository workOrderRepository) {
        this.bomRepository = bomRepository;
        this.companyRepository = companyRepository;
        this.orgRepository = orgRepository;
        this.productRepository = productRepository;
        this.workOrderRepository = workOrderRepository;
    }

    public List<Bom> listByCompany(Long companyId) {
        return bomRepository.findByCompanyId(companyId);
    }

    public Bom get(Long companyId, Long bomId) {
        Bom bom = bomRepository.findById(bomId)
                .orElseThrow(() -> new IllegalArgumentException("BOM not found"));

        if (bom.getCompany() == null || bom.getCompany().getId() == null || !bom.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("BOM company mismatch");
        }

        return bom;
    }

    @Transactional
    public Bom create(Long companyId, CreateBomRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        Org org = null;
        if (request.getOrgId() != null) {
            org = orgRepository.findById(request.getOrgId())
                    .orElseThrow(() -> new IllegalArgumentException("Org not found"));
        }

        Product finishedProduct = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (finishedProduct.getCompany() == null || finishedProduct.getCompany().getId() == null
                || !finishedProduct.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Product company mismatch");
        }

        bomRepository.findByCompanyIdAndProductIdAndVersion(companyId, finishedProduct.getId(), request.getVersion())
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("BOM already exists for product/version");
                });

        Bom bom = new Bom();
        bom.setCompany(company);
        bom.setOrg(org);
        bom.setProduct(finishedProduct);
        bom.setVersion(request.getVersion());
        if (request.getActive() != null) {
            bom.setActive(request.getActive());
        }

        List<BomLine> lines = new ArrayList<>();
        for (CreateBomRequest.CreateBomLineRequest lineReq : request.getLines()) {
            Product component = productRepository.findById(lineReq.getComponentProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Component product not found"));

            if (component.getCompany() == null || component.getCompany().getId() == null
                    || !component.getCompany().getId().equals(companyId)) {
                throw new IllegalArgumentException("Component product company mismatch");
            }

            BomLine line = new BomLine();
            line.setBom(bom);
            line.setComponentProduct(component);
            line.setQty(lineReq.getQty());
            lines.add(line);
        }

        bom.setLines(lines);
        return bomRepository.save(bom);
    }

    @Transactional
    public Bom update(Long companyId, Long bomId, UpdateBomRequest request) {
        Bom existing = bomRepository.findById(bomId)
                .orElseThrow(() -> new IllegalArgumentException("BOM not found"));

        if (existing.getCompany() == null || existing.getCompany().getId() == null || !existing.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("BOM company mismatch");
        }

        Org org = null;
        if (request.getOrgId() != null) {
            org = orgRepository.findById(request.getOrgId())
                    .orElseThrow(() -> new IllegalArgumentException("Org not found"));
        }

        Product finishedProduct = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (finishedProduct.getCompany() == null || finishedProduct.getCompany().getId() == null
                || !finishedProduct.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Product company mismatch");
        }

        bomRepository.findByCompanyIdAndProductIdAndVersion(companyId, finishedProduct.getId(), request.getVersion())
                .ifPresent(other -> {
                    if (!other.getId().equals(existing.getId())) {
                        throw new IllegalArgumentException("BOM already exists for product/version");
                    }
                });

        existing.setOrg(org);
        existing.setProduct(finishedProduct);
        existing.setVersion(request.getVersion());
        if (request.getActive() != null) {
            existing.setActive(request.getActive());
        }

        existing.getLines().clear();
        for (UpdateBomRequest.UpdateBomLineRequest lineReq : request.getLines()) {
            Product component = productRepository.findById(lineReq.getComponentProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Component product not found"));

            if (component.getCompany() == null || component.getCompany().getId() == null
                    || !component.getCompany().getId().equals(companyId)) {
                throw new IllegalArgumentException("Component product company mismatch");
            }

            BomLine line = new BomLine();
            line.setBom(existing);
            line.setComponentProduct(component);
            line.setQty(lineReq.getQty());
            existing.getLines().add(line);
        }

        return bomRepository.save(existing);
    }

    @Transactional
    public void delete(Long companyId, Long bomId) {
        Bom existing = bomRepository.findById(bomId)
                .orElseThrow(() -> new IllegalArgumentException("BOM not found"));

        if (existing.getCompany() == null || existing.getCompany().getId() == null || !existing.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("BOM company mismatch");
        }

        if (workOrderRepository.existsByBom_Id(existing.getId())) {
            throw new IllegalArgumentException("Cannot delete BOM: Work Orders exist for this BOM");
        }

        bomRepository.delete(existing);
    }
}
