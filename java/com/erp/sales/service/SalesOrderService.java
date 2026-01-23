package com.erp.sales.service;

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
import com.erp.entity.Department;
import com.erp.entity.Employee;
import com.erp.masterdata.entity.BusinessPartner;
import com.erp.masterdata.entity.Currency;
import com.erp.masterdata.entity.PriceListVersion;
import com.erp.masterdata.entity.Product;
import com.erp.masterdata.entity.ProductPrice;
import com.erp.masterdata.entity.Warehouse;
import com.erp.masterdata.repository.BusinessPartnerRepository;
import com.erp.masterdata.repository.CurrencyRepository;
import com.erp.masterdata.repository.PriceListVersionRepository;
import com.erp.masterdata.repository.ProductPriceRepository;
import com.erp.masterdata.repository.ProductRepository;
import com.erp.masterdata.repository.WarehouseRepository;
import com.erp.repository.DepartmentRepository;
import com.erp.repository.EmployeeRepository;
import com.erp.sales.entity.SalesOrder;
import com.erp.sales.entity.SalesOrderDeliverySchedule;
import com.erp.sales.entity.SalesOrderLine;
import com.erp.sales.entity.SalesOrderLineBom;
import com.erp.sales.model.SalesOrderType;
import com.erp.sales.repository.SalesOrderLineBomRepository;
import com.erp.sales.repository.SalesOrderRepository;
import com.erp.sales.request.CreateSalesOrderRequest;
import com.erp.sales.request.UpdateSalesOrderRequest;
import com.erp.sales.request.VoidSalesOrderRequest;

@Service
public class SalesOrderService {

    private final SalesOrderRepository salesOrderRepository;
    private final CompanyRepository companyRepository;
    private final OrgRepository orgRepository;
    private final BusinessPartnerRepository businessPartnerRepository;
    private final PriceListVersionRepository priceListVersionRepository;
    private final ProductRepository productRepository;
    private final ProductPriceRepository productPriceRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final WarehouseRepository warehouseRepository;
    private final CurrencyRepository currencyRepository;
    private final DocumentNoService documentNoService;
    private final SalesOrderLineBomRepository salesOrderLineBomRepository;

    public SalesOrderService(
            SalesOrderRepository salesOrderRepository,
            CompanyRepository companyRepository,
            OrgRepository orgRepository,
            BusinessPartnerRepository businessPartnerRepository,
            PriceListVersionRepository priceListVersionRepository,
            ProductRepository productRepository,
            ProductPriceRepository productPriceRepository,
            DepartmentRepository departmentRepository,
            EmployeeRepository employeeRepository,
            WarehouseRepository warehouseRepository,
            CurrencyRepository currencyRepository,
            DocumentNoService documentNoService,
            SalesOrderLineBomRepository salesOrderLineBomRepository) {
        this.salesOrderRepository = salesOrderRepository;
        this.companyRepository = companyRepository;
        this.orgRepository = orgRepository;
        this.businessPartnerRepository = businessPartnerRepository;
        this.priceListVersionRepository = priceListVersionRepository;
        this.productRepository = productRepository;
        this.productPriceRepository = productPriceRepository;
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
        this.warehouseRepository = warehouseRepository;
        this.currencyRepository = currencyRepository;
        this.documentNoService = documentNoService;
        this.salesOrderLineBomRepository = salesOrderLineBomRepository;
    }

    public List<SalesOrder> listByCompany(Long companyId) {
        return salesOrderRepository.findByCompanyId(companyId);
    }

    public SalesOrder getById(Long companyId, Long salesOrderId) {
        SalesOrder so = salesOrderRepository.findById(salesOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Sales Order not found"));
        if (so.getCompany() == null || so.getCompany().getId() == null || !so.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Sales Order company mismatch");
        }
        return so;
    }

    @Transactional
    public SalesOrder create(Long companyId, CreateSalesOrderRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        Org org = null;
        if (request.getOrgId() != null) {
            org = orgRepository.findById(request.getOrgId())
                    .orElseThrow(() -> new IllegalArgumentException("Org not found"));
        }

        BusinessPartner bp = businessPartnerRepository.findById(request.getBusinessPartnerId())
                .orElseThrow(() -> new IllegalArgumentException("BusinessPartner not found"));

        PriceListVersion plv = priceListVersionRepository.findById(request.getPriceListVersionId())
                .orElseThrow(() -> new IllegalArgumentException("PriceListVersion not found"));

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Department not found"));
        }

        Employee employee = null;
        if (request.getEmployeeId() != null) {
            employee = employeeRepository.findById(request.getEmployeeId())
                    .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        }

        Warehouse forwardingWarehouse = null;
        if (request.getForwardingWarehouseId() != null) {
            forwardingWarehouse = warehouseRepository.findById(request.getForwardingWarehouseId())
                    .orElseThrow(() -> new IllegalArgumentException("Warehouse not found"));
        }

        Currency currency = null;
        if (request.getCurrencyId() != null) {
            currency = currencyRepository.findById(request.getCurrencyId())
                    .orElseThrow(() -> new IllegalArgumentException("Currency not found"));
        }

        SalesOrder so = new SalesOrder();
        so.setCompany(company);
        so.setOrg(org);
        so.setBusinessPartner(bp);
        so.setPriceListVersion(plv);
        so.setOrderType(request.getOrderType() != null ? request.getOrderType() : SalesOrderType.DOMESTIC);
        so.setBuyerPo(request.getBuyerPo());
        so.setDepartment(department);
        so.setEmployee(employee);
        so.setInCharge(request.getInCharge());
        so.setPaymentCondition(request.getPaymentCondition());
        so.setDeliveryPlace(request.getDeliveryPlace());
        so.setForwardingWarehouse(forwardingWarehouse);
        so.setCurrency(currency);
        so.setExchangeRate(request.getExchangeRate());
        so.setForeignAmount(request.getForeignAmount());
        so.setMemo(request.getMemo());
        so.setOrderDate(request.getOrderDate());
        so.setDocumentNo(documentNoService.nextDocumentNo(companyId, DocumentType.SALES_ORDER));

        List<SalesOrderLine> lines = new ArrayList<>();
        BigDecimal totalNet = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;

        for (CreateSalesOrderRequest.CreateSalesOrderLineRequest lineReq : request.getLines()) {
            Product product = productRepository.findById(lineReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            ProductPrice productPrice = productPriceRepository
                    .findByPriceListVersion_IdAndProduct_Id(plv.getId(), product.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Product price not found for productId=" + product.getId()));

            BigDecimal qty = lineReq.getQty();
            BigDecimal price = lineReq.getUnitPrice() != null ? lineReq.getUnitPrice() : productPrice.getPrice();
            BigDecimal lineNet = price.multiply(qty);
            if (so.getOrderType() == SalesOrderType.EXPORT && lineReq.getDpPrice() != null) {
                lineNet = lineReq.getDpPrice();
            }

            SalesOrderLine sol = new SalesOrderLine();
            sol.setSalesOrder(so);
            sol.setProduct(product);
            sol.setUom(product.getUom());
            sol.setQty(qty);
            sol.setPrice(price);
            sol.setLineNet(lineNet);

            sol.setDescription(lineReq.getDescription());
            sol.setUnit(lineReq.getUnit());
            sol.setSize(lineReq.getSize());
            sol.setNationalSize(lineReq.getNationalSize());
            sol.setStyle(lineReq.getStyle());
            sol.setCuttingNo(lineReq.getCuttingNo());
            sol.setColor(lineReq.getColor());
            sol.setDestination(lineReq.getDestination());
            sol.setSupplyAmount(lineReq.getSupplyAmount());
            sol.setVatAmount(lineReq.getVatAmount());
            sol.setFobPrice(lineReq.getFobPrice());
            sol.setLdpPrice(lineReq.getLdpPrice());
            sol.setDpPrice(lineReq.getDpPrice());
            sol.setCmtCost(lineReq.getCmtCost());
            sol.setCmCost(lineReq.getCmCost());
            sol.setFabricEta(lineReq.getFabricEta());
            sol.setFabricEtd(lineReq.getFabricEtd());
            sol.setDeliveryDate(lineReq.getDeliveryDate());
            sol.setShipMode(lineReq.getShipMode());
            sol.setFactory(lineReq.getFactory());
            sol.setRemark(lineReq.getRemark());
            sol.setFilePath(lineReq.getFilePath());

            lines.add(sol);
            totalNet = totalNet.add(lineNet);
            if (lineReq.getVatAmount() != null) {
                totalTax = totalTax.add(lineReq.getVatAmount());
            }
        }

        so.getDeliverySchedules().clear();
        if (so.getOrderType() == SalesOrderType.DOMESTIC && request.getDeliverySchedules() != null) {
            for (CreateSalesOrderRequest.CreateSalesOrderDeliveryScheduleRequest s : request.getDeliverySchedules()) {
                SalesOrderDeliverySchedule sched = new SalesOrderDeliverySchedule();
                sched.setSalesOrder(so);
                sched.setDeliveryDate(s.getDeliveryDate());
                sched.setShipMode(s.getShipMode());
                sched.setFactory(s.getFactory());
                sched.setRemark(s.getRemark());
                sched.setFilePath(s.getFilePath());
                so.getDeliverySchedules().add(sched);
            }
        }

        so.setLines(lines);
        so.setTotalNet(totalNet);
        so.setTotalTax(totalTax);
        so.setGrandTotal(totalNet.add(totalTax));

        return salesOrderRepository.save(so);
    }

    @Transactional
    public SalesOrder update(Long companyId, Long salesOrderId, UpdateSalesOrderRequest request) {
        SalesOrder so = salesOrderRepository.findById(salesOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Sales Order not found"));
        if (so.getCompany() == null || so.getCompany().getId() == null || !so.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Sales Order company mismatch");
        }
        if (so.getStatus() != DocumentStatus.DRAFTED) {
            throw new IllegalArgumentException("Only DRAFTED Sales Order can be updated");
        }

        Org org = null;
        if (request.getOrgId() != null) {
            org = orgRepository.findById(request.getOrgId())
                    .orElseThrow(() -> new IllegalArgumentException("Org not found"));
        }

        BusinessPartner bp = businessPartnerRepository.findById(request.getBusinessPartnerId())
                .orElseThrow(() -> new IllegalArgumentException("BusinessPartner not found"));

        PriceListVersion plv = priceListVersionRepository.findById(request.getPriceListVersionId())
                .orElseThrow(() -> new IllegalArgumentException("PriceListVersion not found"));

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Department not found"));
        }

        Employee employee = null;
        if (request.getEmployeeId() != null) {
            employee = employeeRepository.findById(request.getEmployeeId())
                    .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        }

        Warehouse forwardingWarehouse = null;
        if (request.getForwardingWarehouseId() != null) {
            forwardingWarehouse = warehouseRepository.findById(request.getForwardingWarehouseId())
                    .orElseThrow(() -> new IllegalArgumentException("Warehouse not found"));
        }

        Currency currency = null;
        if (request.getCurrencyId() != null) {
            currency = currencyRepository.findById(request.getCurrencyId())
                    .orElseThrow(() -> new IllegalArgumentException("Currency not found"));
        }

        so.setOrg(org);
        so.setBusinessPartner(bp);
        so.setPriceListVersion(plv);
        if (request.getOrderType() != null) {
            so.setOrderType(request.getOrderType());
        }
        so.setBuyerPo(request.getBuyerPo());
        so.setDepartment(department);
        so.setEmployee(employee);
        so.setInCharge(request.getInCharge());
        so.setPaymentCondition(request.getPaymentCondition());
        so.setDeliveryPlace(request.getDeliveryPlace());
        so.setForwardingWarehouse(forwardingWarehouse);
        so.setCurrency(currency);
        so.setExchangeRate(request.getExchangeRate());
        so.setForeignAmount(request.getForeignAmount());
        so.setMemo(request.getMemo());
        so.setOrderDate(request.getOrderDate());

        so.getLines().clear();
        BigDecimal totalNet = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;

        for (UpdateSalesOrderRequest.UpdateSalesOrderLineRequest lineReq : request.getLines()) {
            Product product = productRepository.findById(lineReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            ProductPrice productPrice = productPriceRepository
                    .findByPriceListVersion_IdAndProduct_Id(plv.getId(), product.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Product price not found for productId=" + product.getId()));

            BigDecimal qty = lineReq.getQty();
            BigDecimal price = lineReq.getUnitPrice() != null ? lineReq.getUnitPrice() : productPrice.getPrice();
            BigDecimal lineNet = price.multiply(qty);
            if (so.getOrderType() == SalesOrderType.EXPORT && lineReq.getDpPrice() != null) {
                lineNet = lineReq.getDpPrice();
            }

            SalesOrderLine sol = new SalesOrderLine();
            sol.setSalesOrder(so);
            sol.setProduct(product);
            sol.setUom(product.getUom());
            sol.setQty(qty);
            sol.setPrice(price);
            sol.setLineNet(lineNet);

            sol.setDescription(lineReq.getDescription());
            sol.setUnit(lineReq.getUnit());
            sol.setSize(lineReq.getSize());
            sol.setNationalSize(lineReq.getNationalSize());
            sol.setStyle(lineReq.getStyle());
            sol.setCuttingNo(lineReq.getCuttingNo());
            sol.setColor(lineReq.getColor());
            sol.setDestination(lineReq.getDestination());
            sol.setSupplyAmount(lineReq.getSupplyAmount());
            sol.setVatAmount(lineReq.getVatAmount());
            sol.setFobPrice(lineReq.getFobPrice());
            sol.setLdpPrice(lineReq.getLdpPrice());
            sol.setDpPrice(lineReq.getDpPrice());
            sol.setCmtCost(lineReq.getCmtCost());
            sol.setCmCost(lineReq.getCmCost());
            sol.setFabricEta(lineReq.getFabricEta());
            sol.setFabricEtd(lineReq.getFabricEtd());
            sol.setDeliveryDate(lineReq.getDeliveryDate());
            sol.setShipMode(lineReq.getShipMode());
            sol.setFactory(lineReq.getFactory());
            sol.setRemark(lineReq.getRemark());
            sol.setFilePath(lineReq.getFilePath());

            so.getLines().add(sol);
            totalNet = totalNet.add(lineNet);
            if (lineReq.getVatAmount() != null) {
                totalTax = totalTax.add(lineReq.getVatAmount());
            }
        }

        so.getDeliverySchedules().clear();
        if (so.getOrderType() == SalesOrderType.DOMESTIC && request.getDeliverySchedules() != null) {
            for (UpdateSalesOrderRequest.UpdateSalesOrderDeliveryScheduleRequest s : request.getDeliverySchedules()) {
                SalesOrderDeliverySchedule sched = new SalesOrderDeliverySchedule();
                sched.setSalesOrder(so);
                sched.setDeliveryDate(s.getDeliveryDate());
                sched.setShipMode(s.getShipMode());
                sched.setFactory(s.getFactory());
                sched.setRemark(s.getRemark());
                sched.setFilePath(s.getFilePath());
                so.getDeliverySchedules().add(sched);
            }
        }

        so.setTotalNet(totalNet);
        so.setTotalTax(totalTax);
        so.setGrandTotal(totalNet.add(totalTax));
        return salesOrderRepository.save(so);
    }

    @Transactional
    public void delete(Long companyId, Long salesOrderId) {
        SalesOrder so = salesOrderRepository.findById(salesOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Sales Order not found"));
        if (so.getCompany() == null || so.getCompany().getId() == null || !so.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Sales Order company mismatch");
        }
        if (so.getStatus() != DocumentStatus.DRAFTED) {
            throw new IllegalArgumentException("Only DRAFTED Sales Order can be deleted");
        }
        salesOrderRepository.delete(so);
    }

    @Transactional
    public SalesOrder approve(Long companyId, Long salesOrderId) {
        SalesOrder so = salesOrderRepository.findById(salesOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Sales Order not found"));
        if (so.getCompany() == null || so.getCompany().getId() == null || !so.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Sales Order company mismatch");
        }
        if (so.getStatus() != DocumentStatus.DRAFTED) {
            throw new IllegalArgumentException("Only DRAFTED Sales Order can be approved");
        }
        if (so.getLines() == null || so.getLines().isEmpty()) {
            throw new IllegalArgumentException("Sales Order lines must not be empty");
        }

        // Require BOM snapshot per line before approval (BOM is maintained in Sales Order)
        for (SalesOrderLine l : so.getLines()) {
            if (l.getId() == null) {
                throw new IllegalArgumentException("Sales Order line id is missing");
            }
            SalesOrderLineBom bom = salesOrderLineBomRepository.findBySalesOrderLine_Id(l.getId()).orElse(null);
            if (bom == null || bom.getLines() == null || bom.getLines().isEmpty()) {
                throw new IllegalArgumentException("BOM snapshot is required for sales order line productId="
                        + (l.getProduct() != null ? l.getProduct().getId() : null));
            }
        }

        so.setStatus(DocumentStatus.APPROVED);
        return salesOrderRepository.save(so);
    }

    @Transactional
    public SalesOrder voidOrder(Long companyId, Long salesOrderId, VoidSalesOrderRequest request) {
        SalesOrder so = salesOrderRepository.findById(salesOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Sales Order not found"));
        if (so.getCompany() == null || so.getCompany().getId() == null || !so.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Sales Order company mismatch");
        }
        if (so.getStatus() == DocumentStatus.VOIDED) {
            throw new IllegalArgumentException("Sales Order is already voided");
        }
        if (so.getStatus() == DocumentStatus.COMPLETED || so.getStatus() == DocumentStatus.PARTIALLY_COMPLETED) {
            throw new IllegalArgumentException("Completed Sales Order cannot be voided");
        }
        boolean anyShipped = false;
        if (so.getLines() != null) {
            for (SalesOrderLine l : so.getLines()) {
                if (l.getShippedQty() != null && l.getShippedQty().compareTo(BigDecimal.ZERO) > 0) {
                    anyShipped = true;
                    break;
                }
            }
        }
        if (anyShipped) {
            throw new IllegalArgumentException("Sales Order with shipped qty cannot be voided");
        }

        // request fields (voidDate/reason) are accepted for future audit usage.
        so.setStatus(DocumentStatus.VOIDED);
        return salesOrderRepository.save(so);
    }
}
