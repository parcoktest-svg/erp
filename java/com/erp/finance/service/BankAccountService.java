package com.erp.finance.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.entity.Company;
import com.erp.core.entity.Org;
import com.erp.core.repository.CompanyRepository;
import com.erp.core.repository.OrgRepository;
import com.erp.finance.dto.BankAccountDto;
import com.erp.finance.entity.BankAccount;
import com.erp.finance.entity.GlAccount;
import com.erp.finance.repository.BankAccountRepository;
import com.erp.finance.repository.GlAccountRepository;
import com.erp.finance.request.CreateBankAccountRequest;

@Service
public class BankAccountService {

    private final BankAccountRepository bankAccountRepository;
    private final CompanyRepository companyRepository;
    private final OrgRepository orgRepository;
    private final GlAccountRepository glAccountRepository;

    public BankAccountService(
            BankAccountRepository bankAccountRepository,
            CompanyRepository companyRepository,
            OrgRepository orgRepository,
            GlAccountRepository glAccountRepository) {
        this.bankAccountRepository = bankAccountRepository;
        this.companyRepository = companyRepository;
        this.orgRepository = orgRepository;
        this.glAccountRepository = glAccountRepository;
    }

    public List<BankAccountDto> list(Long companyId) {
        return bankAccountRepository.findByCompanyId(companyId).stream().map(this::toDto).toList();
    }

    @Transactional
    public BankAccountDto create(Long companyId, CreateBankAccountRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        Org org = null;
        if (request.getOrgId() != null) {
            org = orgRepository.findById(request.getOrgId())
                    .orElseThrow(() -> new IllegalArgumentException("Org not found"));
        }

        GlAccount glAccount = glAccountRepository.findById(request.getGlAccountId())
                .orElseThrow(() -> new IllegalArgumentException("GL account not found"));

        BankAccount ba = new BankAccount();
        ba.setCompany(company);
        ba.setOrg(org);
        ba.setName(request.getName());
        ba.setBankName(request.getBankName());
        ba.setAccountNo(request.getAccountNo());
        ba.setCurrencyCode(request.getCurrencyCode());
        ba.setGlAccount(glAccount);
        if (request.getActive() != null) {
            ba.setActive(request.getActive());
        }

        return toDto(bankAccountRepository.save(ba));
    }

    private BankAccountDto toDto(BankAccount ba) {
        BankAccountDto dto = new BankAccountDto();
        dto.setId(ba.getId());
        dto.setCompanyId(ba.getCompany() != null ? ba.getCompany().getId() : null);
        dto.setOrgId(ba.getOrg() != null ? ba.getOrg().getId() : null);
        dto.setName(ba.getName());
        dto.setBankName(ba.getBankName());
        dto.setAccountNo(ba.getAccountNo());
        dto.setCurrencyCode(ba.getCurrencyCode());
        dto.setGlAccountId(ba.getGlAccount() != null ? ba.getGlAccount().getId() : null);
        dto.setActive(ba.isActive());
        return dto;
    }
}
