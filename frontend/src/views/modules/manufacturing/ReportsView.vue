<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 600">Manufacturing Reports</div>
            <div style="color: #606266">WIP dan estimasi biaya produksi berdasarkan BOM & price list.</div>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap">
            <el-button :disabled="!ctx.companyId" @click="loadWip">Refresh WIP</el-button>
            <el-button type="primary" :disabled="!canRunCost" :loading="costLoading" @click="runCost">Run Production Cost</el-button>
          </div>
        </div>

        <CompanyOrgBar :show-org="false" />
      </div>
    </el-card>

    <el-card>
      <div style="font-weight: 600; margin-bottom: 10px">WIP (Work Orders not completed)</div>
      <el-alert v-if="!ctx.companyId" title="Pilih company dulu." type="warning" show-icon style="margin-bottom: 12px" />

      <el-table :data="wipRows" style="width: 100%" v-loading="wipLoading">
        <el-table-column prop="documentNo" label="Document No" width="180" />
        <el-table-column prop="status" label="Status" width="140" />
        <el-table-column prop="workDate" label="Work Date" width="140" />
        <el-table-column prop="bomId" label="BOM" width="120" />
        <el-table-column label="Product" min-width="240">
          <template #default="scope">
            <span>{{ productLabel(scope.row.productId) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="qty" label="Qty" width="120" />
        <el-table-column label="From" min-width="200">
          <template #default="scope">
            <span>{{ locatorLabel(scope.row.fromLocatorId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="To" min-width="200">
          <template #default="scope">
            <span>{{ locatorLabel(scope.row.toLocatorId) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card>
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px">
        <div style="font-weight: 600">Production Cost (Estimate)</div>
        <el-tag type="info">Need Price List Version</el-tag>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px">
        <el-form label-position="top" style="grid-column: 1 / -1">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px">
            <el-form-item label="BOM">
              <el-select v-model="costForm.bomId" filterable placeholder="Select BOM" style="width: 100%" :disabled="boms.length === 0">
                <el-option v-for="b in boms" :key="b.id" :label="bomLabel(b)" :value="b.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="Qty">
              <el-input v-model="costForm.qty" placeholder="e.g. 10" />
            </el-form-item>
            <el-form-item label="Price List Version">
              <el-select v-model="costForm.priceListVersionId" filterable placeholder="Select price list version" style="width: 100%" :disabled="priceListVersions.length === 0">
                <el-option
                  v-for="v in priceListVersions"
                  :key="v.id"
                  :label="`${v.name || 'Version'} (#${v.id})`"
                  :value="v.id"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <el-alert v-if="boms.length === 0" title="BOM belum ada. Buat BOM dulu di Manufacturing > BOMs." type="warning" show-icon style="margin-top: 12px" />
      <el-alert v-if="priceListVersions.length === 0" title="Price List Version belum ada. Buat dulu di Master Data > Price Lists." type="warning" show-icon style="margin-top: 12px" />

      <el-divider />

      <div v-if="costResult" style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; gap: 12px; flex-wrap: wrap">
          <el-tag type="success">Total Cost: {{ costResult.totalCost }}</el-tag>
          <el-tag type="info">BOM: {{ costResult.bomId }}</el-tag>
          <el-tag type="info">Work Order Qty: {{ costResult.workOrderQty }}</el-tag>
        </div>

        <el-table :data="costResult.lines || []" size="small" style="width: 100%">
          <el-table-column label="Component" min-width="260">
            <template #default="scope">
              <span>{{ productLabel(scope.row.componentProductId) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="requiredQty" label="Required Qty" width="160" />
          <el-table-column prop="unitPrice" label="Unit Price" width="160" />
          <el-table-column prop="lineCost" label="Line Cost" width="160" />
        </el-table>
      </div>

      <el-empty v-else description="Run Production Cost untuk melihat estimasi biaya." />
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { inventoryApi, manufacturingApi, masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import CompanyOrgBar from '@/views/modules/common/CompanyOrgBar.vue'

const ctx = useContextStore()

const products = ref([])
const locators = ref([])
const boms = ref([])
const priceListVersions = ref([])

const wipRows = ref([])
const wipLoading = ref(false)

const costForm = reactive({
  bomId: null,
  qty: '1',
  priceListVersionId: null
})

const costResult = ref(null)
const costLoading = ref(false)

const canRunCost = computed(() => {
  if (!ctx.companyId) return false
  if (!costForm.bomId) return false
  if (!String(costForm.qty).trim()) return false
  if (!costForm.priceListVersionId) return false
  const q = Number(costForm.qty)
  return Number.isFinite(q) && q > 0
})

function productLabel(id) {
  if (!id) return ''
  const p = products.value.find((x) => x.id === id)
  if (!p) return String(id)
  return `${p.code} - ${p.name}`
}

function locatorLabel(id) {
  if (!id) return ''
  const l = locators.value.find((x) => x.id === id)
  if (!l) return String(id)
  return `${l.code} - ${l.name}`
}

function bomLabel(b) {
  if (!b) return ''
  const finished = productLabel(b.productId)
  const v = b.version != null ? `v${b.version}` : ''
  const act = b.active ? 'active' : 'inactive'
  return `#${b.id} ${v} (${act}) - ${finished}`
}

async function loadLookups() {
  if (!ctx.companyId) {
    products.value = []
    locators.value = []
    boms.value = []
    priceListVersions.value = []
    return
  }

  try {
    products.value = await masterDataApi.listProducts(ctx.companyId)
  } catch {
    products.value = []
  }

  try {
    locators.value = await inventoryApi.listLocators(ctx.companyId)
  } catch {
    locators.value = []
  }

  try {
    boms.value = await manufacturingApi.listBoms(ctx.companyId)
  } catch {
    boms.value = []
  }

  try {
    const priceLists = await masterDataApi.listPriceLists(ctx.companyId)
    const versions = []
    for (const pl of priceLists || []) {
      try {
        const vs = await masterDataApi.listPriceListVersions(pl.id)
        for (const v of vs || []) versions.push(v)
      } catch {
      }
    }
    priceListVersions.value = versions
  } catch {
    priceListVersions.value = []
  }

  costForm.bomId = costForm.bomId || boms.value[0]?.id || null
  costForm.priceListVersionId = costForm.priceListVersionId || priceListVersions.value[0]?.id || null
}

async function loadWip() {
  if (!ctx.companyId) {
    wipRows.value = []
    return
  }
  wipLoading.value = true
  try {
    const dto = await manufacturingApi.wipReport(ctx.companyId)
    wipRows.value = dto?.rows || []
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    wipLoading.value = false
  }
}

async function runCost() {
  if (!canRunCost.value) return
  costLoading.value = true
  try {
    costResult.value = await manufacturingApi.productionCost(ctx.companyId, {
      bomId: costForm.bomId,
      qty: costForm.qty,
      priceListVersionId: costForm.priceListVersionId
    })
  } catch (e) {
    costResult.value = null
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    costLoading.value = false
  }
}

watch(
  () => ctx.companyId,
  async () => {
    costResult.value = null
    await loadLookups()
    await loadWip()
  }
)

onMounted(async () => {
  await loadLookups()
  await loadWip()
})
</script>
