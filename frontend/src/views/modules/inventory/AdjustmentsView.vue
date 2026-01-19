<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 600">Inventory Adjustments</div>
            <div style="color: #606266">Penyesuaian stok (stock opname) + posting jurnal saat complete.</div>
          </div>
          <el-button type="primary" :disabled="!ctx.companyId" @click="openCreate">Create Adjustment</el-button>
        </div>

        <CompanyOrgBar />
      </div>
    </el-card>

    <el-card>
      <el-alert v-if="!ctx.companyId" title="Pilih company dulu." type="warning" show-icon style="margin-bottom: 12px" />

      <el-table :data="rows" style="width: 100%" v-loading="loading">
        <el-table-column prop="documentNo" label="Document No" width="180" />
        <el-table-column prop="status" label="Status" width="140" />
        <el-table-column prop="adjustmentDate" label="Date" width="140" />
        <el-table-column prop="description" label="Description" />
        <el-table-column label="Actions" width="220">
          <template #default="scope">
            <el-button size="small" :disabled="scope.row.status !== 'DRAFTED'" @click="openEdit(scope.row)">Edit</el-button>
            <el-button size="small" type="danger" plain :disabled="scope.row.status !== 'DRAFTED'" @click="onDelete(scope.row)"
              >Delete</el-button
            >
            <el-button size="small" type="success" :disabled="scope.row.status !== 'DRAFTED'" @click="complete(scope.row)">Complete</el-button>
            <el-button size="small" type="danger" plain :disabled="scope.row.status === 'VOIDED'" @click="voidAdj(scope.row)">Void</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="createOpen" :title="dialogTitle" width="980px">
      <el-form label-position="top">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px">
          <el-form-item label="Adjustment Date">
            <el-date-picker v-model="form.adjustmentDate" type="date" value-format="YYYY-MM-DD" style="width: 220px" />
          </el-form-item>
          <el-form-item label="Org">
            <el-input v-model="form.orgId" placeholder="Auto from context" :disabled="true" />
          </el-form-item>
          <el-form-item label="Description">
            <el-input v-model="form.description" placeholder="optional" />
          </el-form-item>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; margin: 12px 0 6px">
          <div style="font-weight: 600">Lines</div>
          <el-button size="small" @click="addLine">Add Line</el-button>
        </div>

        <el-table :data="form.lines" size="small" style="width: 100%">
          <el-table-column label="Product" min-width="280">
            <template #default="scope">
              <el-select v-model="scope.row.productId" filterable placeholder="Select product" style="width: 100%" :disabled="products.length === 0">
                <el-option v-for="p in products" :key="p.id" :label="`${p.code} - ${p.name}`" :value="p.id" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="Locator" min-width="240">
            <template #default="scope">
              <el-select v-model="scope.row.locatorId" filterable placeholder="Select locator" style="width: 100%" :disabled="locators.length === 0">
                <el-option v-for="l in locators" :key="l.id" :label="`${l.code} - ${l.name}`" :value="l.id" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="Qty Adjusted" width="160">
            <template #default="scope">
              <el-input v-model="scope.row.quantityAdjusted" placeholder="e.g. -2 or 5" />
            </template>
          </el-table-column>
          <el-table-column label="Amount" width="160">
            <template #default="scope">
              <el-input v-model="scope.row.adjustmentAmount" placeholder="e.g. 10000" />
            </template>
          </el-table-column>
          <el-table-column label="Notes" min-width="200">
            <template #default="scope">
              <el-input v-model="scope.row.notes" placeholder="optional" />
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
import { ElMessage, ElMessageBox } from 'element-plus'
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

const editMode = ref('create')
const editingId = ref(null)

const dialogTitle = computed(() => (editMode.value === 'edit' ? 'Edit Inventory Adjustment' : 'Create Inventory Adjustment'))

const form = reactive({
  adjustmentDate: '',
  orgId: null,
  description: '',
  lines: []
})

const canSave = computed(() => {
  if (!ctx.companyId) return false
  if (!form.adjustmentDate) return false
  if (!Array.isArray(form.lines) || form.lines.length === 0) return false
  return form.lines.every((l) => l.productId && l.locatorId && String(l.quantityAdjusted).trim() && String(l.adjustmentAmount).trim())
})

function addLine() {
  form.lines.push({
    productId: products.value[0]?.id || null,
    locatorId: locators.value[0]?.id || null,
    quantityAdjusted: '1',
    adjustmentAmount: '0',
    notes: ''
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
    rows.value = await inventoryApi.listAdjustments(ctx.companyId)
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editMode.value = 'create'
  editingId.value = null
  form.adjustmentDate = new Date().toISOString().slice(0, 10)
  form.orgId = ctx.orgId
  form.description = ''
  form.lines = []
  addLine()
  createOpen.value = true
}

function openEdit(row) {
  if (!row?.id) return
  editMode.value = 'edit'
  editingId.value = row.id
  form.adjustmentDate = row.adjustmentDate || new Date().toISOString().slice(0, 10)
  form.orgId = row.orgId || null
  form.description = row.description || ''
  form.lines = (row.lines || []).map((l) => ({
    productId: l.productId,
    locatorId: l.locatorId,
    quantityAdjusted: String(l.quantityAdjusted ?? ''),
    adjustmentAmount: String(l.adjustmentAmount ?? ''),
    notes: l.notes || ''
  }))
  if (form.lines.length === 0) addLine()
  createOpen.value = true
}

async function save() {
  saving.value = true
  try {
    const payload = {
      adjustmentDate: form.adjustmentDate,
      orgId: form.orgId || null,
      description: form.description,
      lines: form.lines.map((l) => ({
        productId: l.productId,
        locatorId: l.locatorId,
        quantityAdjusted: l.quantityAdjusted,
        adjustmentAmount: l.adjustmentAmount,
        notes: l.notes
      }))
    }

    if (editMode.value === 'edit' && editingId.value) {
      await inventoryApi.updateAdjustment(ctx.companyId, editingId.value, payload)
      ElMessage.success('Adjustment updated')
    } else {
      await inventoryApi.createAdjustment(ctx.companyId, payload)
      ElMessage.success('Adjustment created')
    }
    createOpen.value = false
    await load()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    saving.value = false
  }
}

async function onDelete(row) {
  if (!row?.id) return
  try {
    await ElMessageBox.confirm(`Delete Adjustment "${row.documentNo}"?`, 'Confirm', {
      type: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })
    await inventoryApi.deleteAdjustment(ctx.companyId, row.id)
    ElMessage.success('Adjustment deleted')
    await load()
  } catch (e) {
    if (e === 'cancel' || e === 'close') return
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  }
}

async function complete(row) {
  try {
    await inventoryApi.completeAdjustment(ctx.companyId, row.id)
    ElMessage.success('Adjustment completed')
    await load()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  }
}

async function voidAdj(row) {
  try {
    await inventoryApi.voidAdjustment(ctx.companyId, row.id)
    ElMessage.success('Adjustment voided')
    await load()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
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
