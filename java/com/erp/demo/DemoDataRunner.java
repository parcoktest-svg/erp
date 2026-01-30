package com.erp.demo;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.erp.core.entity.Company;
import com.erp.core.entity.Org;
import com.erp.core.repository.CompanyRepository;
import com.erp.core.repository.OrgRepository;
import com.erp.masterdata.entity.BusinessPartner;
import com.erp.masterdata.entity.Currency;
import com.erp.masterdata.entity.PriceList;
import com.erp.masterdata.entity.PriceListVersion;
import com.erp.masterdata.entity.Product;
import com.erp.masterdata.entity.ProductPrice;
import com.erp.masterdata.entity.Uom;
import com.erp.masterdata.entity.Warehouse;
import com.erp.masterdata.model.BusinessPartnerType;
import com.erp.masterdata.repository.BusinessPartnerRepository;
import com.erp.masterdata.repository.CurrencyRepository;
import com.erp.masterdata.repository.PriceListRepository;
import com.erp.masterdata.repository.PriceListVersionRepository;
import com.erp.masterdata.repository.ProductPriceRepository;
import com.erp.masterdata.repository.ProductRepository;
import com.erp.masterdata.repository.UomRepository;
import com.erp.masterdata.repository.WarehouseRepository;
import com.erp.sales.entity.SalesOrder;
import com.erp.sales.request.CreateSalesOrderRequest;
import com.erp.sales.request.SetSalesOrderLineBomRequest;
import com.erp.sales.service.SalesOrderBomService;
import com.erp.sales.service.SalesOrderService;

@Component
public class DemoDataRunner implements CommandLineRunner {

    @Value("${app.demo.seed:false}")
    private boolean seedEnabled;

    private final CompanyRepository companyRepository;
    private final OrgRepository orgRepository;

    private final UomRepository uomRepository;
    private final CurrencyRepository currencyRepository;
    private final WarehouseRepository warehouseRepository;
    private final BusinessPartnerRepository businessPartnerRepository;
    private final ProductRepository productRepository;
    private final PriceListRepository priceListRepository;
    private final PriceListVersionRepository priceListVersionRepository;
    private final ProductPriceRepository productPriceRepository;

    private final SalesOrderService salesOrderService;
    private final SalesOrderBomService salesOrderBomService;

    public DemoDataRunner(
            CompanyRepository companyRepository,
            OrgRepository orgRepository,
            UomRepository uomRepository,
            CurrencyRepository currencyRepository,
            WarehouseRepository warehouseRepository,
            BusinessPartnerRepository businessPartnerRepository,
            ProductRepository productRepository,
            PriceListRepository priceListRepository,
            PriceListVersionRepository priceListVersionRepository,
            ProductPriceRepository productPriceRepository,
            SalesOrderService salesOrderService,
            SalesOrderBomService salesOrderBomService) {
        this.companyRepository = companyRepository;
        this.orgRepository = orgRepository;
        this.uomRepository = uomRepository;
        this.currencyRepository = currencyRepository;
        this.warehouseRepository = warehouseRepository;
        this.businessPartnerRepository = businessPartnerRepository;
        this.productRepository = productRepository;
        this.priceListRepository = priceListRepository;
        this.priceListVersionRepository = priceListVersionRepository;
        this.productPriceRepository = productPriceRepository;
        this.salesOrderService = salesOrderService;
        this.salesOrderBomService = salesOrderBomService;
    }

    @Override
    public void run(String... args) {
        if (!seedEnabled) {
            return;
        }
        Company company = ensureCompany("DCBJ", "DCBJ GARMENT");
        Org org = ensureOrg(company, "DCBJ", "DCBJ");

        Uom uomPce = ensureUom(company, "PCE", "Piece");
        Uom uomYard = ensureUom(company, "YARD", "Yard");
        Uom uomCones = ensureUom(company, "CONES", "Cones");

        Currency usd = ensureCurrency(company, "USD", "US Dollar", 2);

        Warehouse wh = ensureWarehouse(company, org, "DCBJ-GARMENT", "DCBJ GARMENT");

        BusinessPartner customer = ensureCustomer(company, "LC WAIKIKI MAGAZACILIK HIZ TIC");

        Product kimono = ensureProduct(company, uomPce, "KIMONO", "KIMONO", "FG");

        Product viscose = ensureProduct(company, uomYard, "1112498", "100% VISCOSE", "RM");
        Product mainSizeLabel = ensureProduct(company, uomPce, "MAINSIZELABEL", "MAIN SIZE LABEL", "RM");
        Product cl = ensureProduct(company, uomPce, "CL", "SATUAN PCE", "RM");
        Product idLabel = ensureProduct(company, uomPce, "IDLABEL", "ID LABEL", "RM");
        Product sewingThread = ensureProduct(company, uomCones, "SEWINGTHREAD", "Sewing Thread", "RM");
        Product interLining = ensureProduct(company, uomYard, "INTERLINING", "INTERLINING", "RM");
        Product polyBag = ensureProduct(company, uomPce, "PBAG", "POLYBAG", "RM");

        PriceList priceList = ensurePriceList(company, usd, "Default Sales USD");
        PriceListVersion plv = ensurePriceListVersion(priceList, LocalDate.now().minusDays(30));

        ensureProductPrice(plv, kimono, new BigDecimal("2.8800"));

        if (hasDemoSalesOrder(company.getId())) {
            return;
        }

        CreateSalesOrderRequest req = new CreateSalesOrderRequest();
        req.setOrgId(org.getId());
        req.setOrderType(com.erp.sales.model.SalesOrderType.EXPORT);
        req.setBusinessPartnerId(customer.getId());
        req.setPriceListVersionId(plv.getId());
        req.setOrderDate(LocalDate.of(2025, 12, 10));

        req.setBuyerPo("1209734 TEST");
        req.setCurrencyId(usd.getId());
        req.setExchangeRate(new BigDecimal("16705.00"));
        req.setForeignAmount(new BigDecimal("16467.84"));
        req.setForwardingWarehouseId(wh.getId());
        req.setMemo("DEMO_GARMENT_SO");

        req.setLines(List.of(
                line(kimono.getId(), new BigDecimal("240"), new BigDecimal("2.8800"), "KEY WOVEN KIM", "PCE", "L", "", "KNM KIMOS BAG", null, null, "TURKEY", new BigDecimal("2.88"), new BigDecimal("0.00"), new BigDecimal("691.2000")),
                line(kimono.getId(), new BigDecimal("690"), new BigDecimal("2.8800"), "KEY WOVEN KIM", "PCE", "S", "", "KNM KIMOS BAG", null, null, "TURKEY", new BigDecimal("2.88"), new BigDecimal("0.00"), new BigDecimal("1987.2000")),
                line(kimono.getId(), new BigDecimal("902"), new BigDecimal("2.8800"), "KEY WOVEN KIM", "PCE", "M", "", "KNM KIMOS BAG", null, null, "TURKEY", new BigDecimal("2.88"), new BigDecimal("0.00"), new BigDecimal("2597.7600"))
        ));

        SalesOrder so = salesOrderService.create(company.getId(), req);

        Long firstLineId = so.getLines() != null && !so.getLines().isEmpty() ? so.getLines().get(0).getId() : null;
        if (firstLineId == null) {
            return;
        }

        SetSalesOrderLineBomRequest bomReq = new SetSalesOrderLineBomRequest();
        bomReq.setSalesOrderLineId(firstLineId);
        bomReq.setLines(List.of(
                bomLine(viscose.getId(), new BigDecimal("1.00"), "1112498", "100% VISCOSE", "", "YARD", new BigDecimal("0.9200"), new BigDecimal("15.3690"), new BigDecimal("1.6400"), new BigDecimal("16705.00"), new BigDecimal("1.5088"), new BigDecimal("25205.00"), usd.getId()),
                bomLine(mainSizeLabel.getId(), new BigDecimal("1.00"), "MAINSIZELABEL", "", "S", "PCE", new BigDecimal("0.0200"), new BigDecimal("0.3340"), new BigDecimal("1.0200"), new BigDecimal("16705.00"), new BigDecimal("0.0204"), new BigDecimal("341.00"), usd.getId()),
                bomLine(cl.getId(), new BigDecimal("1.00"), "CL", "SATUAN PCE", "", "PCE", new BigDecimal("0.0350"), new BigDecimal("0.5850"), new BigDecimal("1.0200"), new BigDecimal("16705.00"), new BigDecimal("0.0357"), new BigDecimal("597.00"), usd.getId()),
                bomLine(idLabel.getId(), new BigDecimal("1.00"), "IDLABEL", "", "", "PCE", new BigDecimal("0.0090"), new BigDecimal("0.1500"), new BigDecimal("1.0200"), new BigDecimal("16705.00"), new BigDecimal("0.0092"), new BigDecimal("153.00"), usd.getId()),
                bomLine(sewingThread.getId(), new BigDecimal("1.00"), "SewingThread", "", "", "CONES", new BigDecimal("0.7000"), new BigDecimal("11.6940"), new BigDecimal("0.0350"), new BigDecimal("16705.00"), new BigDecimal("0.0245"), new BigDecimal("409.00"), usd.getId()),
                bomLine(interLining.getId(), new BigDecimal("1.00"), "INTERLINING", "", "", "YRD", new BigDecimal("0.3200"), new BigDecimal("5.3460"), new BigDecimal("0.1730"), new BigDecimal("16705.00"), new BigDecimal("0.0554"), new BigDecimal("925.00"), usd.getId()),
                bomLine(polyBag.getId(), new BigDecimal("1.00"), "PBAG", "POLYBAG SATU.", "", "PCE", new BigDecimal("0.0350"), new BigDecimal("0.5850"), new BigDecimal("1.0200"), new BigDecimal("16705.00"), new BigDecimal("0.0357"), new BigDecimal("597.00"), usd.getId())
        ));

        salesOrderBomService.setLineBom(company.getId(), so.getId(), bomReq);
    }

    private boolean hasDemoSalesOrder(Long companyId) {
        return salesOrderService.listByCompany(companyId).stream().anyMatch(so -> "DEMO_GARMENT_SO".equals(so.getMemo()));
    }

    private Company ensureCompany(String code, String name) {
        Optional<Company> existing = companyRepository.findByCode(code);
        if (existing.isPresent()) return existing.get();
        Company c = new Company();
        c.setCode(code);
        c.setName(name);
        c.setActive(true);
        return companyRepository.save(c);
    }

    private Org ensureOrg(Company company, String code, String name) {
        List<Org> existing = orgRepository.findByCompanyId(company.getId());
        for (Org o : existing) {
            if (o != null && o.getCode() != null && o.getCode().equalsIgnoreCase(code)) return o;
        }
        Org o = new Org();
        o.setCompany(company);
        o.setCode(code);
        o.setName(name);
        o.setActive(true);
        return orgRepository.save(o);
    }

    private Uom ensureUom(Company company, String code, String name) {
        List<Uom> uoms = uomRepository.findByCompanyId(company.getId());
        for (Uom u : uoms) {
            if (u != null && u.getCode() != null && u.getCode().equalsIgnoreCase(code)) return u;
        }
        Uom u = new Uom();
        u.setCompany(company);
        u.setCode(code);
        u.setName(name);
        u.setActive(true);
        return uomRepository.save(u);
    }

    private Currency ensureCurrency(Company company, String code, String name, int precision) {
        List<Currency> cur = currencyRepository.findByCompanyId(company.getId());
        for (Currency c : cur) {
            if (c != null && c.getCode() != null && c.getCode().equalsIgnoreCase(code)) return c;
        }
        Currency c = new Currency();
        c.setCompany(company);
        c.setCode(code);
        c.setName(name);
        c.setPrecisionValue(precision);
        c.setActive(true);
        return currencyRepository.save(c);
    }

    private Warehouse ensureWarehouse(Company company, Org org, String code, String name) {
        List<Warehouse> existing = warehouseRepository.findByCompanyId(company.getId());
        for (Warehouse w : existing) {
            if (w != null && w.getCode() != null && w.getCode().equalsIgnoreCase(code)) return w;
        }
        Warehouse w = new Warehouse();
        w.setCompany(company);
        w.setOrg(org);
        w.setCode(code);
        w.setName(name);
        w.setActive(true);
        return warehouseRepository.save(w);
    }

    private BusinessPartner ensureCustomer(Company company, String name) {
        List<BusinessPartner> bps = businessPartnerRepository.findByCompanyId(company.getId());
        for (BusinessPartner bp : bps) {
            if (bp != null && bp.getName() != null && bp.getName().equalsIgnoreCase(name)) return bp;
        }
        BusinessPartner bp = new BusinessPartner();
        bp.setCompany(company);
        bp.setName(name);
        bp.setType(BusinessPartnerType.CUSTOMER);
        bp.setActive(true);
        return businessPartnerRepository.save(bp);
    }

    private Product ensureProduct(Company company, Uom uom, String code, String name, String itemType) {
        List<Product> products = productRepository.findByCompanyId(company.getId());
        for (Product p : products) {
            if (p != null && p.getCode() != null && p.getCode().equalsIgnoreCase(code)) return p;
        }
        Product p = new Product();
        p.setCompany(company);
        p.setUom(uom);
        p.setCode(code);
        p.setName(name);
        p.setItemType(itemType);
        p.setActive(true);
        return productRepository.save(p);
    }

    private PriceList ensurePriceList(Company company, Currency currency, String name) {
        List<PriceList> lists = priceListRepository.findByCompanyId(company.getId());
        for (PriceList pl : lists) {
            if (pl != null && pl.getName() != null && pl.getName().equalsIgnoreCase(name)) return pl;
        }
        PriceList pl = new PriceList();
        pl.setCompany(company);
        pl.setCurrency(currency);
        pl.setName(name);
        pl.setSalesPriceList(true);
        pl.setActive(true);
        return priceListRepository.save(pl);
    }

    private PriceListVersion ensurePriceListVersion(PriceList priceList, LocalDate validFrom) {
        List<PriceListVersion> vers = priceListVersionRepository.findByPriceListId(priceList.getId());
        for (PriceListVersion v : vers) {
            if (v != null && v.getValidFrom() != null && v.getValidFrom().equals(validFrom)) return v;
        }
        PriceListVersion v = new PriceListVersion();
        v.setPriceList(priceList);
        v.setValidFrom(validFrom);
        v.setActive(true);
        return priceListVersionRepository.save(v);
    }

    private ProductPrice ensureProductPrice(PriceListVersion plv, Product product, BigDecimal price) {
        Optional<ProductPrice> existing = productPriceRepository.findByPriceListVersion_IdAndProduct_Id(plv.getId(), product.getId());
        if (existing.isPresent()) return existing.get();
        ProductPrice pp = new ProductPrice();
        pp.setPriceListVersion(plv);
        pp.setProduct(product);
        pp.setPrice(price);
        pp.setActive(true);
        return productPriceRepository.save(pp);
    }

    private static CreateSalesOrderRequest.CreateSalesOrderLineRequest line(
            Long productId,
            BigDecimal qty,
            BigDecimal unitPrice,
            String description,
            String unit,
            String size,
            String nationalSize,
            String style,
            String cuttingNo,
            String color,
            String destination,
            BigDecimal fobPrice,
            BigDecimal ldpPrice,
            BigDecimal dpPrice) {
        CreateSalesOrderRequest.CreateSalesOrderLineRequest l = new CreateSalesOrderRequest.CreateSalesOrderLineRequest();
        l.setProductId(productId);
        l.setQty(qty);
        l.setUnitPrice(unitPrice);
        l.setDescription(description);
        l.setUnit(unit);
        l.setSize(size);
        l.setNationalSize(nationalSize);
        l.setStyle(style);
        l.setCuttingNo(cuttingNo);
        l.setColor(color);
        l.setDestination(destination);
        l.setFobPrice(fobPrice);
        l.setLdpPrice(ldpPrice);
        // For EXPORT, backend will use dpPrice as the line net override.
        l.setDpPrice(dpPrice);
        return l;
    }

    private static SetSalesOrderLineBomRequest.SetSalesOrderLineBomLineRequest bomLine(
            Long componentProductId,
            BigDecimal qty,
            String bomCode,
            String description1,
            String colorDescription2,
            String unit,
            BigDecimal unitPriceForeign,
            BigDecimal unitPriceDomestic,
            BigDecimal yy,
            BigDecimal exchangeRate,
            BigDecimal amountForeign,
            BigDecimal amountDomestic,
            Long currencyId) {
        SetSalesOrderLineBomRequest.SetSalesOrderLineBomLineRequest l = new SetSalesOrderLineBomRequest.SetSalesOrderLineBomLineRequest();
        l.setComponentProductId(componentProductId);
        l.setQty(qty);
        l.setBomCode(bomCode);
        l.setDescription1(description1);
        l.setColorDescription2(colorDescription2);
        l.setUnit(unit);
        l.setUnitPriceForeign(unitPriceForeign);
        l.setUnitPriceDomestic(unitPriceDomestic);
        l.setYy(yy);
        l.setExchangeRate(exchangeRate);
        l.setAmountForeign(amountForeign);
        l.setAmountDomestic(amountDomestic);
        l.setCurrencyId(currencyId);
        return l;
    }
}
