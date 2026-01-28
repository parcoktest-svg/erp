package com.erp.sales.service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.erp.sales.dto.SalesOrderLineLookupsDto;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
public class SalesOrderLineLookupService {

    @PersistenceContext
    private EntityManager entityManager;

    public SalesOrderLineLookupsDto getLookups(Long companyId) {
        SalesOrderLineLookupsDto dto = new SalesOrderLineLookupsDto();
        dto.setUnits(listMerged(companyId, "unit"));
        dto.setSizes(listMerged(companyId, "size"));
        dto.setNationalSizes(listMerged(companyId, "nationalSize"));
        dto.setStyles(listMerged(companyId, "style"));
        dto.setCuttingNos(listMerged(companyId, "cuttingNo"));
        dto.setColors(listMerged(companyId, "color"));
        dto.setDestinations(listMerged(companyId, "destination"));
        return dto;
    }

    private List<String> listMerged(Long companyId, String field) {
        Set<String> s = new LinkedHashSet<>();
        s.addAll(listFromLookupTable(companyId, field));
        s.addAll(listDistinct(companyId, field));
        return s.stream().toList();
    }

    private List<String> listDistinct(Long companyId, String field) {
        String q = "select distinct l." + field + " from SalesOrderLine l "
                + " join l.salesOrder so "
                + " where so.company.id = :companyId "
                + " and l." + field + " is not null "
                + " and l." + field + " <> '' "
                + " order by l." + field;
        return entityManager.createQuery(q, String.class)
                .setParameter("companyId", companyId)
                .getResultList();
    }

    private List<String> listFromLookupTable(Long companyId, String field) {
        String q = "select distinct l.fieldValue from SalesOrderLineLookup l "
                + " where l.companyId = :companyId and l.fieldName = :fieldName "
                + " and l.fieldValue is not null and l.fieldValue <> '' "
                + " order by l.fieldValue";
        return entityManager.createQuery(q, String.class)
                .setParameter("companyId", companyId)
                .setParameter("fieldName", field)
                .getResultList();
    }
}
