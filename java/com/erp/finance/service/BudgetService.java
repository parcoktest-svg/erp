package com.erp.finance.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.core.entity.Company;
import com.erp.core.entity.Org;
import com.erp.core.model.DocumentStatus;
import com.erp.core.repository.CompanyRepository;
import com.erp.core.repository.OrgRepository;
import com.erp.finance.entity.AccountingPeriod;
import com.erp.finance.entity.Budget;
import com.erp.finance.entity.BudgetLine;
import com.erp.finance.entity.FiscalYear;
import com.erp.finance.entity.GlAccount;
import com.erp.finance.repository.AccountingPeriodRepository;
import com.erp.finance.repository.BudgetLineRepository;
import com.erp.finance.repository.BudgetRepository;
import com.erp.finance.repository.FiscalYearRepository;
import com.erp.finance.repository.GlAccountRepository;
import com.erp.finance.request.CreateBudgetRequest;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final BudgetLineRepository budgetLineRepository;
    private final CompanyRepository companyRepository;
    private final OrgRepository orgRepository;
    private final FiscalYearRepository fiscalYearRepository;
    private final GlAccountRepository glAccountRepository;
    private final AccountingPeriodRepository accountingPeriodRepository;

    public BudgetService(
            BudgetRepository budgetRepository,
            BudgetLineRepository budgetLineRepository,
            CompanyRepository companyRepository,
            OrgRepository orgRepository,
            FiscalYearRepository fiscalYearRepository,
            GlAccountRepository glAccountRepository,
            AccountingPeriodRepository accountingPeriodRepository) {
        this.budgetRepository = budgetRepository;
        this.budgetLineRepository = budgetLineRepository;
        this.companyRepository = companyRepository;
        this.orgRepository = orgRepository;
        this.fiscalYearRepository = fiscalYearRepository;
        this.glAccountRepository = glAccountRepository;
        this.accountingPeriodRepository = accountingPeriodRepository;
    }

    public List<Budget> listByCompany(Long companyId) {
        return budgetRepository.findByCompanyId(companyId);
    }

    public List<Budget> listByCompanyAndFiscalYear(Long companyId, Long fiscalYearId) {
        return budgetRepository.findByCompanyIdAndFiscalYearId(companyId, fiscalYearId);
    }

    @Transactional
    public Budget create(Long companyId, CreateBudgetRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        FiscalYear fiscalYear = fiscalYearRepository.findById(request.getFiscalYearId())
                .orElseThrow(() -> new IllegalArgumentException("FiscalYear not found"));

        Org org = null;
        if (request.getOrgId() != null) {
            org = orgRepository.findById(request.getOrgId())
                    .orElseThrow(() -> new IllegalArgumentException("Org not found"));
        }

        Budget budget = new Budget();
        budget.setCompany(company);
        budget.setOrg(org);
        budget.setFiscalYear(fiscalYear);
        budget.setName(request.getName());
        budget.setDescription(request.getDescription());
        budget.setStatus(DocumentStatus.DRAFTED);

        List<BudgetLine> lines = new ArrayList<>();
        for (CreateBudgetRequest.CreateBudgetLineRequest lineReq : request.getLines()) {
            GlAccount glAccount = glAccountRepository.findById(lineReq.getGlAccountId())
                    .orElseThrow(() -> new IllegalArgumentException("GL Account not found"));

            AccountingPeriod period = accountingPeriodRepository.findById(lineReq.getAccountingPeriodId())
                    .orElseThrow(() -> new IllegalArgumentException("AccountingPeriod not found"));

            BudgetLine line = new BudgetLine();
            line.setBudget(budget);
            line.setGlAccount(glAccount);
            line.setAccountingPeriod(period);
            line.setBudgetAmount(lineReq.getBudgetAmount());
            line.setNotes(lineReq.getNotes());

            lines.add(line);
        }

        budget.setLines(lines);
        return budgetRepository.save(budget);
    }

    @Transactional
    public Budget complete(Long companyId, Long budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));

        if (budget.getCompany() == null || budget.getCompany().getId() == null || !budget.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Budget company mismatch");
        }

        if (budget.getStatus() != DocumentStatus.DRAFTED) {
            throw new IllegalArgumentException("Only DRAFTED budgets can be completed");
        }

        budget.setStatus(DocumentStatus.COMPLETED);
        return budgetRepository.save(budget);
    }

    @Transactional
    public Budget voidBudget(Long companyId, Long budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));

        if (budget.getCompany() == null || budget.getCompany().getId() == null || !budget.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Budget company mismatch");
        }

        if (budget.getStatus() == DocumentStatus.VOIDED) {
            throw new IllegalArgumentException("Budget already voided");
        }

        budget.setStatus(DocumentStatus.VOIDED);
        return budgetRepository.save(budget);
    }
}
