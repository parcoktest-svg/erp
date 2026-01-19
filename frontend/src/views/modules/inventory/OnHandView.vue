<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 600">On-hand</div>
            <div style="color: #606266">Cek stok on-hand per locator dan produk.</div>
          </div>
          <el-button type="primary" :disabled="!canCheck" :loading="checking" @click="check">Check</el-button>
        </div>

        <CompanyOrgBar />
      </div>
    </el-card>

    <el-card>
      <el-alert v-if="!ctx.companyId" title="Pilih company dulu." type="warning" show-icon style="margin-bottom: 12px" />

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px">
        <el-form-item label="Warehouse">
          <el-select v-model="form.warehouseId" placeholder="Select warehouse" clearable filterable style="width: 100%" :disabled="warehouses.length === 0">
            <el-option v-for="w in warehouses" :key="w.id" :label="`${w.code} - ${w.name}`" :value="w.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="Locator">
          <el-select v-model="form.locatorId" placeholder="Select locator" filterable style="width: 100%" :disabled="locators.length === 0">
            <el-option v-for="l in locators" :key="l.id" :label="`${l.code} - ${l.name}`" :value="l.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="Product">
          <el-select v-model="form.productId" placeholder="Select product" filterable style="width: 100%" :disabled="products.length === 0">
            <el-option label="All" :value="0" />
            <el-option v-for="p in products" :key="p.id" :label="`${p.code} - ${p.name}`" :value="p.id" />
          </el-select>
        </el-form-item>
      </div>

      <el-divider />

      <el-descriptions v-if="!isAllProducts" :column="3" border>
        <el-descriptions-item label="Locator">{{ selectedLocatorLabel }}</el-descriptions-item>
        <el-descriptions-item label="Product">{{ selectedProductLabel }}</el-descriptions-item>
        <el-descriptions-item label="On-hand Qty">
          <el-tag size="small" type="success">{{ result.onHandQty ?? '-' }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <div v-else>
        <div style="margin-bottom: 8px; font-weight: 600">{{ selectedLocatorLabel }}</div>
        <el-table :data="onHandRows" size="small" style="width: 100%">
          <el-table-column label="Product" min-width="320">
            <template #default="scope">
              <span>{{ productLabelById(scope.row.productId) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="onHandQty" label="On-hand Qty" width="160" />
        </el-table>
      </div>

      <el-alert
        v-if="ctx.companyId && (warehouses.length === 0 || locators.length === 0)"
        title="Pastikan Warehouse dan Locator sudah dibuat dulu."
        type="warning"
        show-icon
        style="margin-top: 12px"
      />
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { inventoryApi, masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import CompanyOrgBar from '@/views/modules/common/CompanyOrgBar.vue'

const ctx = useContextStore()

const warehouses = ref([])
const locators = ref([])
const products = ref([])
const onHandRows = ref([])

const checking = ref(false)
const result = reactive({
  locatorId: null,
  productId: null,
  onHandQty: null
})

const form = reactive({
  warehouseId: null,
  locatorId: null,
  productId: null
})

const isAllProducts = computed(() => Number(form.productId) === 0)
const canCheck = computed(() => Boolean(ctx.companyId && form.locatorId && (form.productId != null)))

const selectedLocatorLabel = computed(() => {
  const l = (locators.value || []).find((x) => x.id === form.locatorId)
  return l ? `${l.code} - ${l.name}` : '-'
})

const selectedProductLabel = computed(() => {
  if (isAllProducts.value) return 'All'
  const p = (products.value || []).find((x) => x.id === Number(form.productId))
  return p ? `${p.code} - ${p.name}` : '-'
})

function productLabelById(productId) {
  const p = (products.value || []).find((x) => x.id === productId)
  return p ? `${p.code} - ${p.name}` : String(productId ?? '')
}

async function loadLookups() {
  if (!ctx.companyId) {
    warehouses.value = []
    locators.value = []
    products.value = []
    onHandRows.value = []
    return
  }

  try {
    ;[warehouses.value, products.value] = await Promise.all([
      masterDataApi.listWarehouses(ctx.companyId),
      masterDataApi.listProducts(ctx.companyId)
    ])
  } catch {
    warehouses.value = []
    products.value = []
  }

  if (!form.warehouseId) form.warehouseId = warehouses.value[0]?.id || null
  if (form.productId == null) form.productId = 0
}

async function loadLocators() {
  if (!ctx.companyId) {
    locators.value = []
    return
  }
  try {
    locators.value = await inventoryApi.listLocators(ctx.companyId, form.warehouseId ? { warehouseId: form.warehouseId } : undefined)
  } catch {
    locators.value = []
  }
  if (!form.locatorId) form.locatorId = locators.value[0]?.id || null
}

async function check() {
  if (!canCheck.value) return
  checking.value = true
  try {
    if (isAllProducts.value) {
      const rows = await inventoryApi.getOnHandByLocator(ctx.companyId, {
        locatorId: form.locatorId
      })
      onHandRows.value = rows || []
      result.locatorId = form.locatorId
      result.productId = 0
      result.onHandQty = null
    } else {
      const r = await inventoryApi.getOnHand(ctx.companyId, {
        locatorId: form.locatorId,
        productId: form.productId
      })
      onHandRows.value = []
      result.locatorId = r.locatorId
      result.productId = r.productId
      result.onHandQty = r.onHandQty
    }
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    checking.value = false
  }
}

watch(
  () => ctx.companyId,
  async () => {
    await loadLookups()
    await loadLocators()
  }
)

watch(
  () => form.warehouseId,
  async () => {
    form.locatorId = null
    onHandRows.value = []
    await loadLocators()
  }
)

onMounted(async () => {
  await loadLookups()
  await loadLocators()
})
</script>
