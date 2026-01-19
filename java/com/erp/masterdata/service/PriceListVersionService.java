package com.erp.masterdata.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.masterdata.entity.PriceList;
import com.erp.masterdata.entity.PriceListVersion;
import com.erp.masterdata.repository.PriceListRepository;
import com.erp.masterdata.repository.PriceListVersionRepository;

@Service
public class PriceListVersionService {

    private final PriceListVersionRepository priceListVersionRepository;
    private final PriceListRepository priceListRepository;

    public PriceListVersionService(PriceListVersionRepository priceListVersionRepository, PriceListRepository priceListRepository) {
        this.priceListVersionRepository = priceListVersionRepository;
        this.priceListRepository = priceListRepository;
    }

    public List<PriceListVersion> listByPriceList(Long priceListId) {
        return priceListVersionRepository.findByPriceListId(priceListId);
    }

    @Transactional
    public PriceListVersion create(Long priceListId, LocalDate validFrom) {
        PriceList priceList = priceListRepository.findById(priceListId)
                .orElseThrow(() -> new IllegalArgumentException("PriceList not found"));

        PriceListVersion plv = new PriceListVersion();
        plv.setPriceList(priceList);
        plv.setValidFrom(validFrom);
        plv.setActive(true);

        return priceListVersionRepository.save(plv);
    }
}
