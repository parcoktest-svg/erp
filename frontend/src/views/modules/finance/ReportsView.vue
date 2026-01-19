<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 600">Finance Reports</div>
            <div style="color: #606266">Aging, GL Summary, Trial Balance, Profit/Loss, Balance Sheet.</div>
          </div>
          <el-button :disabled="!ctx.companyId" @click="runActive">Run</el-button>
        </div>

        <CompanyOrgBar :show-org="false" />
      </div>
    </el-card>

    <el-card>
      <el-alert v-if="!ctx.companyId" title="Pilih company dulu." type="warning" show-icon style="margin-bottom: 12px" />

      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 12px">
        <el-radio-group v-model="active" size="small">
          <el-radio-button label="aging">Aging</el-radio-button>
          <el-radio-button label="gl">GL Summary</el-radio-button>
          <el-radio-button label="tb">Trial Balance</el-radio-button>
          <el-radio-button label="pl">Profit/Loss</el-radio-button>
          <el-radio-button label="bs">Balance Sheet</el-radio-button>
        </el-radio-group>
      </div>

      <div v-if="active === 'aging'" style="display: flex; flex-direction: column; gap: 12px">
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: end">
          <div style="min-width: 220px">
            <div style="color: #606266; font-size: 12px; margin-bottom: 6px">Invoice Type</div>
            <el-select v-model="agingForm.invoiceType" style="width: 220px">
              <el-option label="AR (Receivable)" value="AR" />
              <el-option label="AP (Payable)" value="AP" />
            </el-select>
          </div>
          <div style="min-width: 220px">
            <div style="color: #606266; font-size: 12px; margin-bottom: 6px">As Of Date (optional)</div>
            <el-date-picker v-model="agingForm.asOfDate" type="date" value-format="YYYY-MM-DD" style="width: 220px" clearable />
          </div>
          <el-button type="primary" :disabled="!ctx.companyId" :loading="loading" @click="runAging">Run Aging</el-button>
        </div>

        <div v-if="agingResult" style="display: flex; gap: 8px; flex-wrap: wrap">
          <el-tag type="info">0-30: {{ agingResult.total0To30 }}</el-tag>
          <el-tag type="info">31-60: {{ agingResult.total31To60 }}</el-tag>
          <el-tag type="info">61-90: {{ agingResult.total61To90 }}</el-tag>
          <el-tag type="info">>90: {{ agingResult.totalOver90 }}</el-tag>
          <el-tag type="success">Total Open: {{ agingResult.totalOpen }}</el-tag>
        </div>

        <el-table v-if="agingResult" :data="agingResult.partners || []" style="width: 100%" size="small">
          <el-table-column prop="businessPartnerName" label="Business Partner" min-width="220" />
          <el-table-column prop="bucket0To30" label="0-30" width="140" />
          <el-table-column prop="bucket31To60" label="31-60" width="140" />
          <el-table-column prop="bucket61To90" label="61-90" width="140" />
          <el-table-column prop="bucketOver90" label=">90" width="140" />
          <el-table-column prop="totalOpen" label="Total" width="140" />
        </el-table>

        <el-empty v-else description="Run Aging untuk melihat data." />
      </div>

      <div v-else-if="active === 'gl'" style="display: flex; flex-direction: column; gap: 12px">
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: end">
          <div>
            <div style="color: #606266; font-size: 12px; margin-bottom: 6px">From</div>
            <el-date-picker v-model="range.fromDate" type="date" value-format="YYYY-MM-DD" style="width: 220px" />
          </div>
          <div>
            <div style="color: #606266; font-size: 12px; margin-bottom: 6px">To</div>
            <el-date-picker v-model="range.toDate" type="date" value-format="YYYY-MM-DD" style="width: 220px" />
          </div>
          <el-button type="primary" :disabled="!canRunRange" :loading="loading" @click="runGl">Run GL Summary</el-button>
        </div>

        <div v-if="glResult" style="display: flex; gap: 8px; flex-wrap: wrap">
          <el-tag type="info">Total Debit: {{ glResult.totalDebit }}</el-tag>
          <el-tag type="info">Total Credit: {{ glResult.totalCredit }}</el-tag>
        </div>

        <el-table v-if="glResult" :data="glResult.rows || []" style="width: 100%" size="small">
          <el-table-column prop="accountCode" label="Account" width="180" />
          <el-table-column prop="debitTotal" label="Debit" width="160" />
          <el-table-column prop="creditTotal" label="Credit" width="160" />
          <el-table-column prop="balance" label="Balance" width="160" />
        </el-table>

        <el-empty v-else description="Run GL Summary untuk melihat data." />
      </div>

      <div v-else-if="active === 'tb'" style="display: flex; flex-direction: column; gap: 12px">
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: end">
          <div>
            <div style="color: #606266; font-size: 12px; margin-bottom: 6px">From</div>
            <el-date-picker v-model="range.fromDate" type="date" value-format="YYYY-MM-DD" style="width: 220px" />
          </div>
          <div>
            <div style="color: #606266; font-size: 12px; margin-bottom: 6px">To</div>
            <el-date-picker v-model="range.toDate" type="date" value-format="YYYY-MM-DD" style="width: 220px" />
          </div>
          <el-button type="primary" :disabled="!canRunRange" :loading="loading" @click="runTb">Run Trial Balance</el-button>
        </div>

        <div v-if="tbResult" style="display: flex; gap: 8px; flex-wrap: wrap">
          <el-tag type="info">Total Debit: {{ tbResult.totalDebit }}</el-tag>
          <el-tag type="info">Total Credit: {{ tbResult.totalCredit }}</el-tag>
        </div>

        <el-table v-if="tbResult" :data="tbResult.rows || []" style="width: 100%" size="small">
          <el-table-column prop="accountCode" label="Code" width="160" />
          <el-table-column prop="accountName" label="Name" min-width="220" />
          <el-table-column prop="accountType" label="Type" width="120" />
          <el-table-column prop="debitTotal" label="Debit" width="160" />
          <el-table-column prop="creditTotal" label="Credit" width="160" />
          <el-table-column prop="balance" label="Balance" width="160" />
        </el-table>

        <el-empty v-else description="Run Trial Balance untuk melihat data." />
      </div>

      <div v-else-if="active === 'pl'" style="display: flex; flex-direction: column; gap: 12px">
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: end">
          <div>
            <div style="color: #606266; font-size: 12px; margin-bottom: 6px">From</div>
            <el-date-picker v-model="range.fromDate" type="date" value-format="YYYY-MM-DD" style="width: 220px" />
          </div>
          <div>
            <div style="color: #606266; font-size: 12px; margin-bottom: 6px">To</div>
            <el-date-picker v-model="range.toDate" type="date" value-format="YYYY-MM-DD" style="width: 220px" />
          </div>
          <el-button type="primary" :disabled="!canRunRange" :loading="loading" @click="runPl">Run Profit/Loss</el-button>
        </div>

        <div v-if="plResult" style="display: flex; gap: 8px; flex-wrap: wrap">
          <el-tag type="success">Total Revenue: {{ plResult.totalRevenue }}</el-tag>
          <el-tag type="warning">Total Expense: {{ plResult.totalExpense }}</el-tag>
          <el-tag type="info">Net Income: {{ plResult.netIncome }}</el-tag>
        </div>

        <el-table v-if="plResult" :data="plResult.rows || []" style="width: 100%" size="small">
          <el-table-column prop="accountCode" label="Code" width="160" />
          <el-table-column prop="accountName" label="Name" min-width="220" />
          <el-table-column prop="accountType" label="Type" width="120" />
          <el-table-column prop="amount" label="Amount" width="160" />
        </el-table>

        <el-empty v-else description="Run Profit/Loss untuk melihat data." />
      </div>

      <div v-else style="display: flex; flex-direction: column; gap: 12px">
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: end">
          <div>
            <div style="color: #606266; font-size: 12px; margin-bottom: 6px">As Of Date (optional)</div>
            <el-date-picker v-model="bsForm.asOfDate" type="date" value-format="YYYY-MM-DD" style="width: 220px" clearable />
          </div>
          <el-button type="primary" :disabled="!ctx.companyId" :loading="loading" @click="runBs">Run Balance Sheet</el-button>
        </div>

        <div v-if="bsResult" style="display: flex; gap: 8px; flex-wrap: wrap">
          <el-tag type="success">Assets: {{ bsResult.totalAssets }}</el-tag>
          <el-tag type="warning">Liabilities: {{ bsResult.totalLiabilities }}</el-tag>
          <el-tag type="info">Equity: {{ bsResult.totalEquity }}</el-tag>
        </div>

        <el-table v-if="bsResult" :data="bsResult.rows || []" style="width: 100%" size="small">
          <el-table-column prop="accountCode" label="Code" width="160" />
          <el-table-column prop="accountName" label="Name" min-width="220" />
          <el-table-column prop="accountType" label="Type" width="120" />
          <el-table-column prop="amount" label="Amount" width="160" />
        </el-table>

        <el-empty v-else description="Run Balance Sheet untuk melihat data." />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { financeApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import CompanyOrgBar from '@/views/modules/common/CompanyOrgBar.vue'

const ctx = useContextStore()

const active = ref('aging')
const loading = ref(false)

const range = reactive({
  fromDate: new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10),
  toDate: new Date().toISOString().slice(0, 10)
})

const agingForm = reactive({
  invoiceType: 'AR',
  asOfDate: ''
})

const bsForm = reactive({
  asOfDate: ''
})

const agingResult = ref(null)
const glResult = ref(null)
const tbResult = ref(null)
const plResult = ref(null)
const bsResult = ref(null)

const canRunRange = computed(() => {
  if (!ctx.companyId) return false
  return !!range.fromDate && !!range.toDate
})

async function runAging() {
  if (!ctx.companyId) return
  loading.value = true
  try {
    agingResult.value = await financeApi.agingReport(ctx.companyId, {
      invoiceType: agingForm.invoiceType,
      asOfDate: agingForm.asOfDate || undefined
    })
    glResult.value = null
    tbResult.value = null
    plResult.value = null
    bsResult.value = null
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    loading.value = false
  }
}

async function runGl() {
  if (!canRunRange.value) return
  loading.value = true
  try {
    glResult.value = await financeApi.glSummaryReport(ctx.companyId, {
      fromDate: range.fromDate,
      toDate: range.toDate
    })
    agingResult.value = null
    tbResult.value = null
    plResult.value = null
    bsResult.value = null
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    loading.value = false
  }
}

async function runTb() {
  if (!canRunRange.value) return
  loading.value = true
  try {
    tbResult.value = await financeApi.trialBalanceReport(ctx.companyId, {
      fromDate: range.fromDate,
      toDate: range.toDate
    })
    agingResult.value = null
    glResult.value = null
    plResult.value = null
    bsResult.value = null
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    loading.value = false
  }
}

async function runPl() {
  if (!canRunRange.value) return
  loading.value = true
  try {
    plResult.value = await financeApi.profitLossReport(ctx.companyId, {
      fromDate: range.fromDate,
      toDate: range.toDate
    })
    agingResult.value = null
    glResult.value = null
    tbResult.value = null
    bsResult.value = null
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    loading.value = false
  }
}

async function runBs() {
  if (!ctx.companyId) return
  loading.value = true
  try {
    bsResult.value = await financeApi.balanceSheetReport(ctx.companyId, {
      asOfDate: bsForm.asOfDate || undefined
    })
    agingResult.value = null
    glResult.value = null
    tbResult.value = null
    plResult.value = null
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    loading.value = false
  }
}

function runActive() {
  if (active.value === 'aging') return runAging()
  if (active.value === 'gl') return runGl()
  if (active.value === 'tb') return runTb()
  if (active.value === 'pl') return runPl()
  return runBs()
}
</script>
