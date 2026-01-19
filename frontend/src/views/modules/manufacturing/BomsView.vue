<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 600">BOMs</div>
            <div style="color: #606266">Bill of Materials untuk produksi (finished good + komponen).</div>
          </div>
          <el-button type="primary" :disabled="!ctx.companyId" @click="openCreate">Create BOM</el-button>
        </div>

        <CompanyOrgBar />
      </div>
    </el-card>

    <el-card>
      <el-alert v-if="!ctx.companyId" title="Pilih company dulu." type="warning" show-icon style="margin-bottom: 12px" />

      <el-table :data="rows" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="90" />
        <el-table-column label="Finished Product" min-width="260">
          <template #default="scope">
            <span>{{ productLabel(scope.row.productId) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="Version" width="110" />
        <el-table-column prop="active" label="Active" width="110">
          <template #default="scope">
            <el-tag size="small" :type="scope.row.active ? 'success' : 'info'">{{ scope.row.active ? 'Yes' : 'No' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Lines" width="110">
          <template #default="scope">
            <span>{{ (scope.row.lines || []).length }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Action" width="180">
          <template #default="scope">
            <el-button size="small" @click="openEdit(scope.row)" :disabled="!ctx.companyId">Edit</el-button>
            <el-button type="danger" size="small" plain @click="onDelete(scope.row)" :disabled="!ctx.companyId">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="createOpen" :title="dialogTitle" width="980px">
      <el-form label-position="top">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px">
          <el-form-item label="Finished Product">
            <el-select v-model="form.productId" filterable placeholder="Select product" style="width: 100%" :disabled="products.length === 0">
              <el-option v-for="p in products" :key="p.id" :label="`${p.code} - ${p.name}`" :value="p.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Version">
            <el-input v-model="form.version" placeholder="e.g. 1" />
          </el-form-item>
          <el-form-item label="Active">
            <el-switch v-model="form.active" />
          </el-form-item>
        </div>

        <el-form-item label="Org">
          <el-input v-model="form.orgId" placeholder="Auto from context" :disabled="true" />
        </el-form-item>

        <div style="display: flex; align-items: center; justify-content: space-between; margin: 12px 0 6px">
          <div style="font-weight: 600">Components</div>
          <el-button size="small" @click="addLine">Add Line</el-button>
        </div>

        <el-table :data="form.lines" size="small" style="width: 100%">
          <el-table-column label="Component Product" min-width="320">
            <template #default="scope">
              <el-select v-model="scope.row.componentProductId" filterable placeholder="Select component" style="width: 100%" :disabled="products.length === 0">
                <el-option v-for="p in products" :key="p.id" :label="`${p.code} - ${p.name}`" :value="p.id" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="Qty" width="180">
            <template #default="scope">
              <el-input v-model="scope.row.qty" placeholder="e.g. 2" />
            </template>
          </el-table-column>
          <el-table-column label="" width="70">
            <template #default="scope">
              <el-button type="danger" plain size="small" @click="removeLine(scope.$index)">X</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-alert v-if="products.length === 0" title="Product belum ada. Buat Product dulu di Master Data." type="warning" show-icon style="margin-top: 12px" />
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
import { manufacturingApi, masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import CompanyOrgBar from '@/views/modules/common/CompanyOrgBar.vue'

const ctx = useContextStore()

const rows = ref([])
const loading = ref(false)

const products = ref([])

const createOpen = ref(false)
const saving = ref(false)

const editMode = ref('create')
const editingId = ref(null)

const dialogTitle = computed(() => (editMode.value === 'edit' ? 'Edit BOM' : 'Create BOM'))

const form = reactive({
  orgId: null,
  productId: null,
  version: '1',
  active: true,
  lines: []
})

const canSave = computed(() => {
  if (!ctx.companyId) return false
  if (!form.productId) return false
  const v = Number(form.version)
  if (!Number.isFinite(v) || v <= 0) return false
  if (!Array.isArray(form.lines) || form.lines.length === 0) return false
  return form.lines.every((l) => l.componentProductId && String(l.qty).trim())
})

function productLabel(id) {
  if (!id) return ''
  const p = products.value.find((x) => x.id === id)
  if (!p) return String(id)
  return `${p.code} - ${p.name}`
}

function addLine() {
  form.lines.push({
    componentProductId: products.value[0]?.id || null,
    qty: '1'
  })
}

function removeLine(idx) {
  form.lines.splice(idx, 1)
}

async function loadLookups() {
  if (!ctx.companyId) {
    products.value = []
    return
  }
  try {
    products.value = await masterDataApi.listProducts(ctx.companyId)
  } catch {
    products.value = []
  }
}

async function load() {
  if (!ctx.companyId) {
    rows.value = []
    return
  }
  loading.value = true
  try {
    rows.value = await manufacturingApi.listBoms(ctx.companyId)
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editMode.value = 'create'
  editingId.value = null
  form.orgId = ctx.orgId
  form.productId = products.value[0]?.id || null
  form.version = '1'
  form.active = true
  form.lines = []
  addLine()
  createOpen.value = true
}

function openEdit(row) {
  if (!row?.id) return
  editMode.value = 'edit'
  editingId.value = row.id
  form.orgId = row.orgId || null
  form.productId = row.productId || null
  form.version = String(row.version ?? '1')
  form.active = !!row.active
  form.lines = (row.lines || []).map((l) => ({
    componentProductId: l.componentProductId,
    qty: String(l.qty ?? '')
  }))
  if (form.lines.length === 0) addLine()
  createOpen.value = true
}

async function save() {
  saving.value = true
  try {
    const payload = {
      orgId: form.orgId || null,
      productId: form.productId,
      version: Number(form.version),
      active: !!form.active,
      lines: form.lines.map((l) => ({
        componentProductId: l.componentProductId,
        qty: l.qty
      }))
    }

    if (editMode.value === 'edit' && editingId.value) {
      await manufacturingApi.updateBom(ctx.companyId, editingId.value, payload)
      ElMessage.success('BOM updated')
    } else {
      await manufacturingApi.createBom(ctx.companyId, payload)
      ElMessage.success('BOM created')
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
    await ElMessageBox.confirm(`Delete BOM #${row.id}?`, 'Confirm', {
      type: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })
    await manufacturingApi.deleteBom(ctx.companyId, row.id)
    ElMessage.success('BOM deleted')
    await load()
  } catch (e) {
    if (e === 'cancel' || e === 'close') return
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
