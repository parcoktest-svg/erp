<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 600">Inventory Movements</div>
            <div style="color: #606266">IN / OUT / TRANSFER untuk update stok.</div>
          </div>
          <el-button type="primary" :disabled="!ctx.companyId" @click="openCreate">Create Movement</el-button>
        </div>

        <CompanyOrgBar />
      </div>
    </el-card>

    <el-card>
      <el-alert v-if="!ctx.companyId" title="Pilih company dulu." type="warning" show-icon style="margin-bottom: 12px" />

      <el-table :data="rows" style="width: 100%" v-loading="loading">
        <el-table-column prop="documentNo" label="Document No" width="180" />
        <el-table-column prop="status" label="Status" width="140" />
        <el-table-column prop="movementType" label="Type" width="140" />
        <el-table-column prop="movementDate" label="Date" width="140" />
        <el-table-column prop="description" label="Description" />
      </el-table>
    </el-card>

    <el-dialog v-model="createOpen" title="Create Inventory Movement" width="980px">
      <el-form label-position="top">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px">
          <el-form-item label="Type">
            <el-select v-model="form.movementType" style="width: 100%">
              <el-option label="IN" value="IN" />
              <el-option label="OUT" value="OUT" />
              <el-option label="TRANSFER" value="TRANSFER" />
            </el-select>
          </el-form-item>
          <el-form-item label="Movement Date">
            <el-date-picker v-model="form.movementDate" type="date" value-format="YYYY-MM-DD" style="width: 220px" />
          </el-form-item>
          <el-form-item label="Org">
            <el-input v-model="form.orgId" placeholder="Auto from context" :disabled="true" />
          </el-form-item>
        </div>

        <el-form-item label="Description">
          <el-input v-model="form.description" placeholder="optional" />
        </el-form-item>

        <div style="display: flex; align-items: center; justify-content: space-between; margin: 12px 0 6px">
          <div style="font-weight: 600">Lines</div>
          <el-button size="small" @click="addLine">Add Line</el-button>
        </div>

        <el-table :data="form.lines" size="small" style="width: 100%">
          <el-table-column label="Product" min-width="300">
            <template #default="scope">
              <el-select v-model="scope.row.productId" filterable placeholder="Select product" style="width: 100%" :disabled="products.length === 0">
                <el-option v-for="p in products" :key="p.id" :label="`${p.code} - ${p.name}`" :value="p.id" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="Qty" width="160">
            <template #default="scope">
              <el-input v-model="scope.row.qty" />
            </template>
          </el-table-column>
          <el-table-column label="From" min-width="220">
            <template #default="scope">
              <el-select v-model="scope.row.fromLocatorId" filterable clearable placeholder="From locator" style="width: 100%" :disabled="locators.length === 0 || form.movementType === 'IN'">
                <el-option v-for="l in locators" :key="l.id" :label="`${l.code} - ${l.name}`" :value="l.id" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="To" min-width="220">
            <template #default="scope">
              <el-select v-model="scope.row.toLocatorId" filterable clearable placeholder="To locator" style="width: 100%" :disabled="locators.length === 0 || form.movementType === 'OUT'">
                <el-option v-for="l in locators" :key="l.id" :label="`${l.code} - ${l.name}`" :value="l.id" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="" width="70">
            <template #default="scope">
              <el-button type="danger" plain size="small" @click="removeLine(scope.$index)">X</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-alert v-if="products.length === 0" title="Product belum ada. Buat Product dulu di Master Data." type="warning" show-icon style="margin-top: 12px" />
        <el-alert v-if="locators.length === 0" title="Locator belum ada. Buat Locator dulu di Inventory > Locators." type="warning" show-icon style="margin-top: 12px" />
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
import { inventoryApi, masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import CompanyOrgBar from '@/views/modules/common/CompanyOrgBar.vue'

const ctx = useContextStore()

const rows = ref([])
const loading = ref(false)

const products = ref([])
const locators = ref([])

const createOpen = ref(false)
const saving = ref(false)

const form = reactive({
  movementType: 'IN',
  movementDate: '',
  orgId: null,
  description: '',
  lines: []
})

const canSave = computed(() => {
  if (!ctx.companyId) return false
  if (!form.movementType) return false
  if (!form.movementDate) return false
  if (!Array.isArray(form.lines) || form.lines.length === 0) return false
  if (!form.lines.every((l) => l.productId && String(l.qty).trim())) return false

  if (form.movementType === 'IN') return form.lines.every((l) => l.toLocatorId)
  if (form.movementType === 'OUT') return form.lines.every((l) => l.fromLocatorId)
  // TRANSFER
  return form.lines.every((l) => l.fromLocatorId && l.toLocatorId && l.fromLocatorId !== l.toLocatorId)
})

function addLine() {
  form.lines.push({
    productId: products.value[0]?.id || null,
    qty: '1',
    fromLocatorId: locators.value[0]?.id || null,
    toLocatorId: locators.value[0]?.id || null
  })
}

function removeLine(idx) {
  form.lines.splice(idx, 1)
}

async function loadLookups() {
  if (!ctx.companyId) {
    products.value = []
    locators.value = []
    return
  }
  try {
    ;[products.value, locators.value] = await Promise.all([
      masterDataApi.listProducts(ctx.companyId),
      inventoryApi.listLocators(ctx.companyId)
    ])
  } catch {
    products.value = []
    locators.value = []
  }
}

async function load() {
  if (!ctx.companyId) {
    rows.value = []
    return
  }
  loading.value = true
  try {
    rows.value = await inventoryApi.listMovements(ctx.companyId)
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  form.movementType = 'IN'
  form.movementDate = new Date().toISOString().slice(0, 10)
  form.orgId = ctx.orgId
  form.description = ''
  form.lines = []
  addLine()
  createOpen.value = true
}

async function save() {
  saving.value = true
  try {
    await inventoryApi.createMovement(ctx.companyId, {
      movementType: form.movementType,
      movementDate: form.movementDate,
      description: form.description,
      orgId: ctx.orgId || null,
      lines: form.lines.map((l) => ({
        productId: l.productId,
        qty: l.qty,
        fromLocatorId: l.fromLocatorId || null,
        toLocatorId: l.toLocatorId || null
      }))
    })
    ElMessage.success('Movement created')
    createOpen.value = false
    await load()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    saving.value = false
  }
}

watch(
  () => ctx.companyId,
  async () => {
    await loadLookups()
    await load()
  }
)

watch(
  () => ctx.orgId,
  () => {
    form.orgId = ctx.orgId
  }
)

onMounted(async () => {
  await loadLookups()
  await load()
})
</script>
