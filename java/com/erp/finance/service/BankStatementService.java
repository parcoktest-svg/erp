package com.erp.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
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
import com.erp.finance.dto.BankStatementDto;
import com.erp.finance.dto.BankStatementLineDto;
import com.erp.finance.dto.PaymentMatchDto;
import com.erp.finance.entity.BankAccount;
import com.erp.finance.entity.BankStatement;
import com.erp.finance.entity.BankStatementLine;
import com.erp.finance.entity.GlAccount;
import com.erp.finance.entity.JournalEntry;
import com.erp.finance.entity.JournalLine;
import com.erp.finance.entity.Payment;
import com.erp.finance.model.GlAccountCode;
import com.erp.finance.repository.BankAccountRepository;
import com.erp.finance.repository.BankStatementLineRepository;
import com.erp.finance.repository.BankStatementRepository;
import com.erp.finance.repository.JournalEntryRepository;
import com.erp.finance.repository.PaymentRepository;
import com.erp.finance.request.CreateBankStatementLineRequest;
import com.erp.finance.request.CreateBankStatementRequest;
import com.erp.finance.request.ReconcileBankStatementLineRequest;

@Service
public class BankStatementService {

    private final BankStatementRepository bankStatementRepository;
    private final BankStatementLineRepository bankStatementLineRepository;
    private final BankAccountRepository bankAccountRepository;
    private final PaymentRepository paymentRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final CompanyRepository companyRepository;
    private final OrgRepository orgRepository;
    private final DocumentNoService documentNoService;
    private final GlAccountMappingService glAccountMappingService;
    private final AccountingPeriodService accountingPeriodService;

    public BankStatementService(
            BankStatementRepository bankStatementRepository,
            BankStatementLineRepository bankStatementLineRepository,
            BankAccountRepository bankAccountRepository,
            PaymentRepository paymentRepository,
            JournalEntryRepository journalEntryRepository,
            CompanyRepository companyRepository,
            OrgRepository orgRepository,
            DocumentNoService documentNoService,
            GlAccountMappingService glAccountMappingService,
            AccountingPeriodService accountingPeriodService) {
        this.bankStatementRepository = bankStatementRepository;
        this.bankStatementLineRepository = bankStatementLineRepository;
        this.bankAccountRepository = bankAccountRepository;
        this.paymentRepository = paymentRepository;
        this.journalEntryRepository = journalEntryRepository;
        this.companyRepository = companyRepository;
        this.orgRepository = orgRepository;
        this.documentNoService = documentNoService;
        this.glAccountMappingService = glAccountMappingService;
        this.accountingPeriodService = accountingPeriodService;
    }

    public List<BankStatementDto> list(Long companyId) {
        return bankStatementRepository.findByCompanyId(companyId).stream()
                .map(this::toHeaderDto)
                .toList();
    }

    public BankStatementDto get(Long companyId, Long statementId) {
        BankStatement bs = bankStatementRepository.findById(statementId)
                .orElseThrow(() -> new IllegalArgumentException("Bank statement not found"));

        if (bs.getCompany() == null || bs.getCompany().getId() == null || !bs.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Company mismatch");
        }

        List<BankStatementLine> lines = bankStatementLineRepository.findByBankStatementId(statementId);
        BankStatementDto dto = toHeaderDto(bs);
        dto.setLines(lines.stream().map(this::toLineDto).toList());
        return dto;
    }

    @Transactional
    public BankStatementDto create(Long companyId, CreateBankStatementRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        Org org = null;
        if (request.getOrgId() != null) {
            org = orgRepository.findById(request.getOrgId())
                    .orElseThrow(() -> new IllegalArgumentException("Org not found"));
        }

        BankAccount bankAccount = bankAccountRepository.findById(request.getBankAccountId())
                .orElseThrow(() -> new IllegalArgumentException("Bank account not found"));

        String docNo = documentNoService.nextDocumentNo(companyId, DocumentType.BANK_STATEMENT);

        BankStatement bs = new BankStatement();
        bs.setCompany(company);
        bs.setOrg(org);
        bs.setBankAccount(bankAccount);
        bs.setDocumentNo(docNo);
        bs.setStatementDate(request.getStatementDate());
        bs.setDescription(request.getDescription());

        if (request.getLines() != null) {
            for (CreateBankStatementLineRequest lr : request.getLines()) {
                BankStatementLine line = new BankStatementLine();
                line.setBankStatement(bs);
                line.setTrxDate(lr.getTrxDate());
                line.setDescription(lr.getDescription());
                line.setAmount(lr.getAmount());
                bs.getLines().add(line);
            }
        }

        BankStatement saved = bankStatementRepository.save(bs);
        return get(companyId, saved.getId());
    }

    @Transactional
    public BankStatementLineDto reconcileLine(Long companyId, Long statementId, Long lineId, ReconcileBankStatementLineRequest request) {
        BankStatement bs = bankStatementRepository.findById(statementId)
                .orElseThrow(() -> new IllegalArgumentException("Bank statement not found"));

        if (bs.getCompany() == null || bs.getCompany().getId() == null || !bs.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Company mismatch");
        }

        BankStatementLine line = bankStatementLineRepository.findById(lineId)
                .orElseThrow(() -> new IllegalArgumentException("Statement line not found"));

        if (line.getBankStatement() == null || line.getBankStatement().getId() == null || !line.getBankStatement().getId().equals(statementId)) {
            throw new IllegalArgumentException("Statement line mismatch");
        }

        if (line.isReconciled()) {
            return toLineDto(line);
        }

        Payment matchedPayment = null;

        if (request != null && request.getPaymentId() != null) {
            Payment payment = paymentRepository.findById(request.getPaymentId())
                    .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
            if (payment.getCompany() == null || payment.getCompany().getId() == null || !payment.getCompany().getId().equals(companyId)) {
                throw new IllegalArgumentException("Payment company mismatch");
            }
            line.setPayment(payment);
            matchedPayment = payment;
        }

        if (matchedPayment != null) {
            BigDecimal expectedAdj = line.getAmount().subtract(matchedPayment.getAmount());
            if (expectedAdj.compareTo(BigDecimal.ZERO) != 0) {
                if (request == null || request.getAdjustmentAmount() == null) {
                    throw new IllegalArgumentException("Payment amount mismatch: adjustmentAmount is required");
                }
                if (request.getAdjustmentAmount().compareTo(expectedAdj) != 0) {
                    throw new IllegalArgumentException("adjustmentAmount must equal statementAmount - paymentAmount (" + expectedAdj + ")");
                }
            }
        }

        if (request != null && request.getAdjustmentAmount() != null
                && request.getAdjustmentAmount().compareTo(BigDecimal.ZERO) != 0) {

            if (request.getAdjustmentAccountCode() == null) {
                throw new IllegalArgumentException("adjustmentAccountCode is required when adjustmentAmount is provided");
            }

            accountingPeriodService.assertPostingAllowed(companyId, line.getTrxDate());

            String sourceNo = bs.getDocumentNo() + ":L" + line.getId();
            JournalEntry je = journalEntryRepository
                    .findByCompanyIdAndSourceDocumentTypeAndSourceDocumentNo(companyId, DocumentType.BANK_STATEMENT, sourceNo)
                    .orElseGet(() -> {
                        JournalEntry created = createAdjustmentJournal(
                                sourceNo,
                                bs.getBankAccount(),
                                bs.getCompany(),
                                bs.getOrg(),
                                line.getTrxDate(),
                                request.getAdjustmentAmount(),
                                request.getAdjustmentAccountCode(),
                                request.getDescription());
                        validateBalanced(created);
                        return journalEntryRepository.save(created);
                    });
            line.setJournalEntry(je);
        }

        line.setReconciled(true);
        return toLineDto(bankStatementLineRepository.save(line));
    }

    public List<PaymentMatchDto> suggestPayments(Long companyId, Long statementId, Long lineId, int days) {
        BankStatement bs = bankStatementRepository.findById(statementId)
                .orElseThrow(() -> new IllegalArgumentException("Bank statement not found"));
        if (bs.getCompany() == null || bs.getCompany().getId() == null || !bs.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Company mismatch");
        }

        BankStatementLine line = bankStatementLineRepository.findById(lineId)
                .orElseThrow(() -> new IllegalArgumentException("Statement line not found"));
        if (line.getBankStatement() == null || line.getBankStatement().getId() == null || !line.getBankStatement().getId().equals(statementId)) {
            throw new IllegalArgumentException("Statement line mismatch");
        }

        int d = Math.max(days, 0);
        LocalDate from = line.getTrxDate().minusDays(d);
        LocalDate to = line.getTrxDate().plusDays(d);

        return paymentRepository.findMatchesByDateAndAmount(companyId, from, to, line.getAmount()).stream()
                .map(this::toPaymentMatchDto)
                .toList();
    }

    private JournalEntry createAdjustmentJournal(
            String bankStatementDocNo,
            BankAccount bankAccount,
            Company company,
            Org org,
            LocalDate accountingDate,
            BigDecimal amount,
            GlAccountCode adjustmentAccountCode,
            String description) {

        BigDecimal abs = amount.abs();

        JournalEntry je = new JournalEntry();
        je.setCompany(company);
        je.setOrg(org);
        je.setAccountingDate(accountingDate);
        je.setDescription(description != null ? description : "Bank statement adjustment");
        je.setSourceDocumentType(DocumentType.BANK_STATEMENT);
        je.setSourceDocumentNo(bankStatementDocNo);
        je.setDocumentNo(documentNoService.nextDocumentNo(company.getId(), DocumentType.JOURNAL_ENTRY));
        je.setStatus(DocumentStatus.COMPLETED);

        JournalLine bankLine = new JournalLine();
        bankLine.setJournalEntry(je);
        bankLine.setAccountCode(GlAccountCode.CASH);
        bankLine.setGlAccount(bankAccount.getGlAccount());

        JournalLine adjLine = new JournalLine();
        adjLine.setJournalEntry(je);
        adjLine.setAccountCode(adjustmentAccountCode);
        GlAccount adjGl = glAccountMappingService.resolve(company.getId(), adjustmentAccountCode);
        adjLine.setGlAccount(adjGl);

        if (amount.compareTo(BigDecimal.ZERO) > 0) {
            bankLine.setDebit(abs);
            bankLine.setCredit(BigDecimal.ZERO);
            adjLine.setDebit(BigDecimal.ZERO);
            adjLine.setCredit(abs);
        } else {
            bankLine.setDebit(BigDecimal.ZERO);
            bankLine.setCredit(abs);
            adjLine.setDebit(abs);
            adjLine.setCredit(BigDecimal.ZERO);
        }

        je.setLines(List.of(bankLine, adjLine));
        return je;
    }

    private void validateBalanced(JournalEntry je) {
        if (je.getSourceDocumentType() != null) {
            if (je.getSourceDocumentNo() == null || je.getSourceDocumentNo().isBlank()) {
                throw new IllegalArgumentException("sourceDocumentNo is required when sourceDocumentType is set");
            }
        }

        BigDecimal debit = BigDecimal.ZERO;
        BigDecimal credit = BigDecimal.ZERO;
        if (je.getLines() != null) {
            for (JournalLine l : je.getLines()) {
                debit = debit.add(l.getDebit() != null ? l.getDebit() : BigDecimal.ZERO);
                credit = credit.add(l.getCredit() != null ? l.getCredit() : BigDecimal.ZERO);
            }
        }
        if (debit.compareTo(credit) != 0) {
            throw new IllegalArgumentException("Journal not balanced (debit=" + debit + ", credit=" + credit + ")");
        }
    }

    private BankStatementDto toHeaderDto(BankStatement bs) {
        BankStatementDto dto = new BankStatementDto();
        dto.setId(bs.getId());
        dto.setCompanyId(bs.getCompany() != null ? bs.getCompany().getId() : null);
        dto.setOrgId(bs.getOrg() != null ? bs.getOrg().getId() : null);
        dto.setBankAccountId(bs.getBankAccount() != null ? bs.getBankAccount().getId() : null);
        dto.setDocumentNo(bs.getDocumentNo());
        dto.setStatementDate(bs.getStatementDate());
        dto.setDescription(bs.getDescription());
        return dto;
    }

    private BankStatementLineDto toLineDto(BankStatementLine line) {
        BankStatementLineDto dto = new BankStatementLineDto();
        dto.setId(line.getId());
        dto.setBankStatementId(line.getBankStatement() != null ? line.getBankStatement().getId() : null);
        dto.setTrxDate(line.getTrxDate());
        dto.setDescription(line.getDescription());
        dto.setAmount(line.getAmount());
        dto.setReconciled(line.isReconciled());
        dto.setPaymentId(line.getPayment() != null ? line.getPayment().getId() : null);
        dto.setJournalEntryId(line.getJournalEntry() != null ? line.getJournalEntry().getId() : null);
        return dto;
    }

    private PaymentMatchDto toPaymentMatchDto(Payment payment) {
        PaymentMatchDto dto = new PaymentMatchDto();
        dto.setId(payment.getId());
        dto.setDocumentNo(payment.getDocumentNo());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setAmount(payment.getAmount());
        dto.setBusinessPartnerId(payment.getBusinessPartner() != null ? payment.getBusinessPartner().getId() : null);
        dto.setInvoiceId(payment.getInvoice() != null ? payment.getInvoice().getId() : null);
        return dto;
    }
}
