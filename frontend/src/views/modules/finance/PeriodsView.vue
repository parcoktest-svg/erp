<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 600">Fiscal Year & Periods</div>
            <div style="color: #606266">Setup periode akuntansi untuk laporan (open/close).</div>
          </div>
          <el-button type="primary" :disabled="!ctx.companyId" @click="openCreate">Create Fiscal Year</el-button>
        </div>

        <CompanyOrgBar :show-org="false" />
      </div>
    </el-card>

    <el-card>
      <el-alert v-if="!ctx.companyId" title="Pilih company dulu." type="warning" show-icon style="margin-bottom: 12px" />

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
        <div>
          <div style="font-weight: 600; margin-bottom: 8px">Fiscal Years</div>
          <el-table :data="fiscalYears" size="small" style="width: 100%" v-loading="fyLoading" @row-click="onSelectFy">
            <el-table-column prop="year" label="Year" width="100" />
            <el-table-column prop="startDate" label="Start" width="120" />
            <el-table-column prop="endDate" label="End" width="120" />
            <el-table-column prop="status" label="Status" width="110">
              <template #default="scope">
                <el-tag size="small" :type="scope.row.status === 'OPEN' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Actions" width="150">
              <template #default="scope">
                <el-button size="small" :disabled="scope.row.status !== 'OPEN'" @click.stop="closeFy(scope.row)">Close</el-button>
                <el-button size="small" :disabled="scope.row.status !== 'CLOSED'" @click.stop="openFy(scope.row)">Open</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px">
            <div style="font-weight: 600">Periods</div>
            <el-tag v-if="selectedFy" type="info">FY: {{ selectedFy.year }}</el-tag>
          </div>

          <el-alert v-if="!selectedFy" title="Klik fiscal year untuk melihat periods." type="info" show-icon style="margin-bottom: 12px" />

          <el-table v-else :data="periods" size="small" style="width: 100%" v-loading="pLoading">
            <el-table-column prop="periodNo" label="#" width="70" />
            <el-table-column prop="startDate" label="Start" width="120" />
            <el-table-column prop="endDate" label="End" width="120" />
            <el-table-column prop="status" label="Status" width="110">
              <template #default="scope">
                <el-tag size="small" :type="scope.row.status === 'OPEN' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Actions" width="150">
              <template #default="scope">
                <el-button size="small" :disabled="scope.row.status !== 'OPEN'" @click="closePeriod(scope.row)">Close</el-button>
                <el-button size="small" :disabled="scope.row.status !== 'CLOSED'" @click="openPeriod(scope.row)">Open</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>

    <el-dialog v-model="createOpen" title="Create Fiscal Year" width="640px">
      <el-form label-position="top">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px">
          <el-form-item label="Year">
            <el-input v-model="form.year" placeholder="e.g. 2026" />
          </el-form-item>
          <el-form-item label="Start Date">
            <el-date-picker v-model="form.startDate" type="date" value-format="YYYY-MM-DD" style="width: 220px" />
          </el-form-item>
          <el-form-item label="End Date">
            <el-date-picker v-model="form.endDate" type="date" value-format="YYYY-MM-DD" style="width: 220px" />
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <el-button @click="createOpen = false">Cancel</el-button>
        <el-button type="primary" :loading="saving" :disabled="!canSave" @click="save">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { financeApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import CompanyOrgBar from '@/views/modules/common/CompanyOrgBar.vue'

const ctx = useContextStore()

const fiscalYears = ref([])
const fyLoading = ref(false)

const selectedFy = ref(null)

const periods = ref([])
const pLoading = ref(false)

const createOpen = ref(false)
const saving = ref(false)

const form = reactive({
  year: '',
  startDate: '',
  endDate: ''
})

const canSave = computed(() => {
  if (!ctx.companyId) return false
  const y = Number(form.year)
  if (!Number.isFinite(y) || y <= 0) return false
  if (!form.startDate || !form.endDate) return false
  return true
})

async function loadFiscalYears() {
  if (!ctx.companyId) {
    fiscalYears.value = []
    selectedFy.value = null
    periods.value = []
    return
  }
  fyLoading.value = true
  try {
    fiscalYears.value = await financeApi.listFiscalYears(ctx.companyId)
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    fyLoading.value = false
  }
}

async function loadPeriods() {
  if (!ctx.companyId || !selectedFy.value?.id) {
    periods.value = []
    return
  }
  pLoading.value = true
  try {
    periods.value = await financeApi.listPeriods(ctx.companyId, selectedFy.value.id)
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    pLoading.value = false
  }
}

function onSelectFy(row) {
  selectedFy.value = row
  loadPeriods()
}

function openCreate() {
  const now = new Date()
  form.year = String(now.getFullYear())
  form.startDate = `${now.getFullYear()}-01-01`
  form.endDate = `${now.getFullYear()}-12-31`
  createOpen.value = true
}

async function save() {
  saving.value = true
  try {
    await financeApi.createFiscalYear(ctx.companyId, {
      year: Number(form.year),
      startDate: form.startDate,
      endDate: form.endDate
    })
    ElMessage.success('Fiscal year created')
    createOpen.value = false
    await loadFiscalYears()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    saving.value = false
  }
}

async function closeFy(row) {
  try {
    await financeApi.closeFiscalYear(ctx.companyId, row.id)
    ElMessage.success('Fiscal year closed')
    await loadFiscalYears()
    if (selectedFy.value?.id === row.id) {
      selectedFy.value = fiscalYears.value.find((x) => x.id === row.id) || selectedFy.value
      await loadPeriods()
    }
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  }
}

async function openFy(row) {
  try {
    await financeApi.openFiscalYear(ctx.companyId, row.id)
    ElMessage.success('Fiscal year opened')
    await loadFiscalYears()
    if (selectedFy.value?.id === row.id) {
      selectedFy.value = fiscalYears.value.find((x) => x.id === row.id) || selectedFy.value
      await loadPeriods()
    }
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  }
}

async function closePeriod(row) {
  try {
    await financeApi.closePeriod(ctx.companyId, row.id)
    ElMessage.success('Period closed')
    await loadPeriods()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  }
}

async function openPeriod(row) {
  try {
    await financeApi.openPeriod(ctx.companyId, row.id)
    ElMessage.success('Period opened')
    await loadPeriods()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  }
}

watch(
  () => ctx.companyId,
  async () => {
    await loadFiscalYears()
    await loadPeriods()
  }
)

onMounted(loadFiscalYears)
</script>
