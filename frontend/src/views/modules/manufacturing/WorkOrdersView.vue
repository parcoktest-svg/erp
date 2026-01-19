<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 600">Work Orders</div>
            <div style="color: #606266">Perintah produksi: issue komponen dan receipt finished goods saat complete.</div>
          </div>
          <el-button type="primary" :disabled="!ctx.companyId" @click="openCreate">Create Work Order</el-button>
        </div>

        <CompanyOrgBar />
      </div>
    </el-card>

    <el-card>
      <el-alert v-if="!ctx.companyId" title="Pilih company dulu." type="warning" show-icon style="margin-bottom: 12px" />

      <el-table :data="rows" style="width: 100%" v-loading="loading">
        <el-table-column prop="documentNo" label="Document No" width="180" />
        <el-table-column label="Status" width="140">
          <template #default="scope">
            <el-tag size="small" :type="statusTagType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="workDate" label="Work Date" width="140" />
        <el-table-column label="BOM" width="120">
          <template #default="scope">
            <span>{{ scope.row.bomId || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Product" min-width="240">
          <template #default="scope">
            <span>{{ productLabel(scope.row.productId) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="qty" label="Qty" width="110" />
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
        <el-table-column label="Movements" min-width="240">
          <template #default="scope">
            <div style="display: flex; flex-direction: column; gap: 4px">
              <span>Issue: {{ scope.row.issueMovementDocNo || '-' }}</span>
              <span>Receipt: {{ scope.row.receiptMovementDocNo || '-' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="260">
          <template #default="scope">
            <el-button size="small" @click="openEdit(scope.row)" :disabled="scope.row.status !== 'DRAFTED'">Edit</el-button>
            <el-button size="small" type="danger" plain @click="onDelete(scope.row)" :disabled="scope.row.status !== 'DRAFTED'">Delete</el-button>
            <el-button size="small" type="success" :disabled="scope.row.status !== 'DRAFTED'" @click="complete(scope.row)">Complete</el-button>
            <el-button size="small" type="danger" plain :disabled="scope.row.status === 'VOIDED'" @click="voidWo(scope.row)">Void</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="createOpen" :title="dialogTitle" width="980px">
      <el-form label-position="top">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px">
          <el-form-item label="Work Date">
            <el-date-picker v-model="form.workDate" type="date" value-format="YYYY-MM-DD" style="width: 220px" />
          </el-form-item>
          <el-form-item label="Org">
            <el-input v-model="form.orgId" placeholder="Auto from context" :disabled="true" />
          </el-form-item>
          <el-form-item label="Qty">
            <el-input v-model="form.qty" placeholder="e.g. 1" />
          </el-form-item>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
          <el-form-item label="BOM">
            <el-select v-model="form.bomId" filterable placeholder="Select BOM" style="width: 100%" :disabled="boms.length === 0">
              <el-option v-for="b in boms" :key="b.id" :label="bomLabel(b)" :value="b.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Description">
            <el-input v-model="form.description" placeholder="optional" />
          </el-form-item>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
          <el-form-item label="From Locator (Issue Components)">
            <el-select v-model="form.fromLocatorId" filterable placeholder="Select from locator" style="width: 100%" :disabled="locators.length === 0">
              <el-option v-for="l in locators" :key="l.id" :label="`${l.code} - ${l.name}`" :value="l.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="To Locator (Receipt Finished Goods)">
            <el-select v-model="form.toLocatorId" filterable placeholder="Select to locator" style="width: 100%" :disabled="locators.length === 0">
              <el-option v-for="l in locators" :key="l.id" :label="`${l.code} - ${l.name}`" :value="l.id" />
            </el-select>
          </el-form-item>
        </div>

        <el-alert v-if="boms.length === 0" title="BOM belum ada. Buat BOM dulu di Manufacturing > BOMs." type="warning" show-icon style="margin-top: 12px" />
        <el-alert v-if="locators.length === 0" title="Locator belum ada. Buat Locator dulu di Inventory > Locators." type="warning" show-icon style="margin-top: 12px" />
      </el-form>

      <template #footer>
        <el-button @click="createOpen = false">Cancel</el-button>
        <el-button type="primary" :loading="saving" :disabled="!canSave" @click="save">Save</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="completeOpen" title="Complete Work Order" width="520px">
      <el-form label-position="top">
        <el-form-item label="Completion Date">
          <el-date-picker v-model="completeForm.completionDate" type="date" value-format="YYYY-MM-DD" style="width: 220px" />
        </el-form-item>
        <el-alert title="Saat complete: sistem akan cek on-hand komponen di From Locator, lalu buat movement OUT (issue) dan movement IN (receipt)." type="info" show-icon />
      </el-form>
      <template #footer>
        <el-button @click="completeOpen = false">Cancel</el-button>
        <el-button type="success" :loading="actionLoading" :disabled="!completeForm.completionDate" @click="doComplete">Complete</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="voidOpen" title="Void Work Order" width="520px">
      <el-form label-position="top">
        <el-form-item label="Void Date">
          <el-date-picker v-model="voidForm.voidDate" type="date" value-format="YYYY-MM-DD" style="width: 220px" />
        </el-form-item>
        <el-form-item label="Reason">
          <el-input v-model="voidForm.reason" placeholder="optional" />
        </el-form-item>
        <el-alert title="Jika WO sudah completed: sistem akan buat reversal movements untuk restore stock." type="warning" show-icon />
      </el-form>
      <template #footer>
        <el-button @click="voidOpen = false">Cancel</el-button>
        <el-button type="danger" :loading="actionLoading" :disabled="!voidForm.voidDate" @click="doVoid">Void</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { inventoryApi, manufacturingApi, masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import CompanyOrgBar from '@/views/modules/common/CompanyOrgBar.vue'

const ctx = useContextStore()

const rows = ref([])
const loading = ref(false)

const boms = ref([])
const products = ref([])
const locators = ref([])

const createOpen = ref(false)
const saving = ref(false)

const editMode = ref('create')
const editingId = ref(null)

const dialogTitle = computed(() => (editMode.value === 'edit' ? 'Edit Work Order' : 'Create Work Order'))

const form = reactive({
  workDate: '',
  orgId: null,
  bomId: null,
  qty: '1',
  fromLocatorId: null,
  toLocatorId: null,
  description: ''
})

const canSave = computed(() => {
  if (!ctx.companyId) return false
  if (!form.workDate) return false
  if (!form.bomId) return false
  if (!String(form.qty).trim()) return false
  if (!form.fromLocatorId) return false
  if (!form.toLocatorId) return false
  return true
})

const completeOpen = ref(false)
const voidOpen = ref(false)
const actionLoading = ref(false)
const selectedRow = ref(null)

const completeForm = reactive({
  completionDate: ''
})

const voidForm = reactive({
  voidDate: '',
  reason: ''
})

function statusTagType(s) {
  if (s === 'COMPLETED') return 'success'
  if (s === 'VOIDED') return 'danger'
  if (s === 'DRAFTED') return 'info'
  return 'warning'
}

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
    boms.value = []
    products.value = []
    locators.value = []
    return
  }
  try {
    ;[boms.value, products.value, locators.value] = await Promise.all([
      manufacturingApi.listBoms(ctx.companyId),
      masterDataApi.listProducts(ctx.companyId),
      inventoryApi.listLocators(ctx.companyId)
    ])
  } catch {
    boms.value = []
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
    rows.value = await manufacturingApi.listWorkOrders(ctx.companyId)
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editMode.value = 'create'
  editingId.value = null
  form.workDate = new Date().toISOString().slice(0, 10)
  form.orgId = ctx.orgId
  form.bomId = boms.value[0]?.id || null
  form.qty = '1'
  form.fromLocatorId = locators.value[0]?.id || null
  form.toLocatorId = locators.value[1]?.id || locators.value[0]?.id || null
  form.description = ''
  createOpen.value = true
}

function openEdit(row) {
  if (!row?.id) return
  editMode.value = 'edit'
  editingId.value = row.id
  form.workDate = row.workDate || new Date().toISOString().slice(0, 10)
  form.orgId = row.orgId || null
  form.bomId = row.bomId || null
  form.qty = String(row.qty ?? '1')
  form.fromLocatorId = row.fromLocatorId || null
  form.toLocatorId = row.toLocatorId || null
  form.description = row.description || ''
  createOpen.value = true
}

async function save() {
  saving.value = true
  try {
    const payload = {
      orgId: form.orgId || null,
      bomId: form.bomId,
      workDate: form.workDate,
      qty: form.qty,
      fromLocatorId: form.fromLocatorId,
      toLocatorId: form.toLocatorId,
      description: form.description
    }

    if (editMode.value === 'edit' && editingId.value) {
      await manufacturingApi.updateWorkOrder(ctx.companyId, editingId.value, payload)
      ElMessage.success('Work order updated')
    } else {
      await manufacturingApi.createWorkOrder(ctx.companyId, payload)
      ElMessage.success('Work order created')
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
    await ElMessageBox.confirm(`Delete Work Order "${row.documentNo}"?`, 'Confirm', {
      type: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })
    await manufacturingApi.deleteWorkOrder(ctx.companyId, row.id)
    ElMessage.success('Work order deleted')
    await load()
  } catch (e) {
    if (e === 'cancel' || e === 'close') return
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  }
}

function complete(row) {
  selectedRow.value = row
  completeForm.completionDate = new Date().toISOString().slice(0, 10)
  completeOpen.value = true
}

async function doComplete() {
  if (!selectedRow.value) return
  actionLoading.value = true
  try {
    await manufacturingApi.completeWorkOrder(ctx.companyId, selectedRow.value.id, {
      completionDate: completeForm.completionDate
    })
    ElMessage.success('Work order completed')
    completeOpen.value = false
    await load()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    actionLoading.value = false
  }
}

function voidWo(row) {
  selectedRow.value = row
  voidForm.voidDate = new Date().toISOString().slice(0, 10)
  voidForm.reason = ''
  voidOpen.value = true
}

async function doVoid() {
  if (!selectedRow.value) return
  actionLoading.value = true
  try {
    await manufacturingApi.voidWorkOrder(ctx.companyId, selectedRow.value.id, {
      voidDate: voidForm.voidDate,
      reason: voidForm.reason || null
    })
    ElMessage.success('Work order voided')
    voidOpen.value = false
    await load()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    actionLoading.value = false
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
