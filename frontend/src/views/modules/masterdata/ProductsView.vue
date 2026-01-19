<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 600">Products</div>
            <div style="color: #606266">Master produk untuk transaksi Purchase/Sales/Manufacturing.</div>
          </div>
          <el-button type="primary" :disabled="!ctx.companyId" @click="openCreate">Create Product</el-button>
        </div>

        <CompanyOrgBar :show-org="false" />
      </div>
    </el-card>

    <el-card>
      <el-alert v-if="!ctx.companyId" title="Pilih company dulu." type="warning" show-icon style="margin-bottom: 12px" />

      <el-table :data="rows" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="90" />
        <el-table-column prop="code" label="Code" width="160" />
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="uomId" label="UoM" width="160">
          <template #default="scope">
            <span>
              {{ (uoms || []).find((x) => x.id === scope.row.uomId)?.name || (uoms || []).find((x) => x.id === scope.row.uomId)?.code || scope.row.uomId }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="active" label="Active" width="100">
          <template #default="scope">
            <el-tag size="small" :type="scope.row.active ? 'success' : 'info'">{{ scope.row.active ? 'Yes' : 'No' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Action" width="200">
          <template #default="scope">
            <div style="display: flex; gap: 8px">
              <el-button size="small" :disabled="!ctx.companyId" @click="openEdit(scope.row)">Edit</el-button>
              <el-button size="small" type="danger" plain :disabled="!ctx.companyId" @click="onDelete(scope.row)">Delete</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="createOpen" title="Create Product" width="600px">
      <el-form label-position="top">
        <el-form-item label="Code">
          <el-input v-model="form.code" placeholder="e.g. PRD-001" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="form.name" placeholder="e.g. Item A" />
        </el-form-item>
        <el-form-item label="UoM">
          <el-select v-model="form.uomId" filterable placeholder="Select UoM" style="width: 100%" :disabled="uoms.length === 0">
            <el-option v-for="u in uoms" :key="u.id" :label="u.name || u.code || String(u.id)" :value="u.id" />
          </el-select>
          <div v-if="uoms.length === 0" style="color: #909399; font-size: 12px; margin-top: 6px">
            UoM belum ada. Buat UoM dulu di Master Data.
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="createOpen = false">Cancel</el-button>
        <el-button type="primary" :loading="saving" :disabled="!ctx.companyId || !form.uomId" @click="save">Save</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="editOpen" title="Edit Product" width="600px">
      <el-form label-position="top">
        <el-form-item label="Code">
          <el-input v-model="editForm.code" placeholder="e.g. PRD-001" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="editForm.name" placeholder="e.g. Item A" />
        </el-form-item>
        <el-form-item label="UoM">
          <el-select v-model="editForm.uomId" filterable placeholder="Select UoM" style="width: 100%" :disabled="uoms.length === 0">
            <el-option v-for="u in uoms" :key="u.id" :label="u.name || u.code || String(u.id)" :value="u.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Active">
          <el-switch v-model="editForm.active" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editOpen = false">Cancel</el-button>
        <el-button type="primary" :loading="editSaving" :disabled="!canEditSave" @click="saveEdit">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import CompanyOrgBar from '@/views/modules/common/CompanyOrgBar.vue'

const ctx = useContextStore()

const rows = ref([])
const uoms = ref([])
const loading = ref(false)

const createOpen = ref(false)
const saving = ref(false)

const editOpen = ref(false)
const editSaving = ref(false)
const editingId = ref(null)

const form = reactive({
  code: '',
  name: '',
  uomId: null
})

const editForm = reactive({
  code: '',
  name: '',
  uomId: null,
  active: true
})

const canEditSave = computed(() => Boolean(ctx.companyId && editingId.value && editForm.code.trim() && editForm.name.trim() && editForm.uomId))

async function load() {
  if (!ctx.companyId) {
    rows.value = []
    uoms.value = []
    return
  }
  loading.value = true
  try {
    ;[rows.value, uoms.value] = await Promise.all([masterDataApi.listProducts(ctx.companyId), masterDataApi.listUoms(ctx.companyId)])
  } finally {
    loading.value = false
  }
}

function openCreate() {
  form.code = ''
  form.name = ''
  form.uomId = uoms.value[0]?.id || null
  createOpen.value = true
}

function openEdit(row) {
  if (!row?.id) return
  editingId.value = row.id
  editForm.code = row.code || ''
  editForm.name = row.name || ''
  editForm.uomId = row.uomId || null
  editForm.active = Boolean(row.active)
  editOpen.value = true
}

async function save() {
  saving.value = true
  try {
    await masterDataApi.createProduct(ctx.companyId, { code: form.code, name: form.name, uomId: form.uomId })
    ElMessage.success('Product created')
    createOpen.value = false
    await load()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    saving.value = false
  }
}

async function saveEdit() {
  editSaving.value = true
  try {
    await masterDataApi.updateProduct(ctx.companyId, editingId.value, {
      code: editForm.code,
      name: editForm.name,
      uomId: editForm.uomId,
      active: Boolean(editForm.active)
    })
    ElMessage.success('Product updated')
    editOpen.value = false
    await load()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    editSaving.value = false
  }
}

async function onDelete(row) {
  if (!row?.id) return
  try {
    await ElMessageBox.confirm(`Delete Product "${row.code}"?`, 'Confirm', {
      type: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })
    await masterDataApi.deleteProduct(ctx.companyId, row.id)
    ElMessage.success('Product deleted')
    await load()
  } catch (e) {
    if (e === 'cancel' || e === 'close') return
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  }
}

watch(
  () => ctx.companyId,
  () => load()
)

onMounted(load)
</script>
