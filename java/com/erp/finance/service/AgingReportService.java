package com.erp.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.erp.core.model.DocumentStatus;
import com.erp.finance.dto.AgingPartnerRowDto;
import com.erp.finance.dto.AgingReportDto;
import com.erp.finance.entity.Invoice;
import com.erp.finance.model.InvoiceType;
import com.erp.finance.repository.InvoiceRepository;

@Service
public class AgingReportService {

    private final InvoiceRepository invoiceRepository;

    public AgingReportService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public AgingReportDto getAging(Long companyId, InvoiceType invoiceType, LocalDate asOfDate) {
        LocalDate asOf = asOfDate != null ? asOfDate : LocalDate.now();

        List<Invoice> openInvoices = invoiceRepository.findByCompanyIdAndInvoiceTypeAndStatusNotAndOpenAmountGreaterThan(
                companyId,
                invoiceType,
                DocumentStatus.VOIDED,
                BigDecimal.ZERO);

        Map<Long, AgingPartnerRowDto> rows = new LinkedHashMap<>();

        AgingReportDto report = new AgingReportDto();
        report.setInvoiceType(invoiceType);

        for (Invoice inv : openInvoices) {
            if (inv.getBusinessPartner() == null || inv.getBusinessPartner().getId() == null) {
                continue;
            }

            Long bpId = inv.getBusinessPartner().getId();
            AgingPartnerRowDto row = rows.computeIfAbsent(bpId, k -> {
                AgingPartnerRowDto r = new AgingPartnerRowDto();
                r.setBusinessPartnerId(bpId);
                r.setBusinessPartnerName(inv.getBusinessPartner().getName());
                return r;
            });

            BigDecimal open = inv.getOpenAmount() != null ? inv.getOpenAmount() : BigDecimal.ZERO;

            long days = 0;
            if (inv.getInvoiceDate() != null) {
                days = ChronoUnit.DAYS.between(inv.getInvoiceDate(), asOf);
                if (days < 0) {
                    days = 0;
                }
            }

            if (days <= 30) {
                row.setBucket0To30(row.getBucket0To30().add(open));
                report.setTotal0To30(report.getTotal0To30().add(open));
            } else if (days <= 60) {
                row.setBucket31To60(row.getBucket31To60().add(open));
                report.setTotal31To60(report.getTotal31To60().add(open));
            } else if (days <= 90) {
                row.setBucket61To90(row.getBucket61To90().add(open));
                report.setTotal61To90(report.getTotal61To90().add(open));
            } else {
                row.setBucketOver90(row.getBucketOver90().add(open));
                report.setTotalOver90(report.getTotalOver90().add(open));
            }

            row.setTotalOpen(row.getTotalOpen().add(open));
            report.setTotalOpen(report.getTotalOpen().add(open));
        }

        report.setPartners(rows.values().stream().toList());
        return report;
    }
}
