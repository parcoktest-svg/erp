<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 600">Warehouses</div>
            <div style="color: #606266">Buat warehouse untuk inventory locator dan pergerakan stok.</div>
          </div>
          <el-button type="primary" :disabled="!ctx.companyId" @click="openCreate">Create Warehouse</el-button>
        </div>

        <CompanyOrgBar :show-org="true" />
      </div>
    </el-card>

    <el-card>
      <el-alert v-if="!ctx.companyId" title="Pilih company dulu." type="warning" show-icon style="margin-bottom: 12px" />

      <el-table :data="rows" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="90" />
        <el-table-column prop="code" label="Code" width="160" />
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="active" label="Active" width="120">
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

    <el-dialog v-model="createOpen" title="Create Warehouse" width="640px">
      <el-form label-position="top">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
          <el-form-item label="Code">
            <el-input v-model="form.code" placeholder="e.g. WH-01" />
          </el-form-item>
          <el-form-item label="Name">
            <el-input v-model="form.name" placeholder="e.g. Main Warehouse" />
          </el-form-item>
        </div>
        <el-form-item label="Org (optional)">
          <el-input v-model="form.orgId" placeholder="Auto from context" :disabled="true" />
          <div style="color: #909399; font-size: 12px; margin-top: 6px">Org diambil dari context jika dipilih.</div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="createOpen = false">Cancel</el-button>
        <el-button type="primary" :loading="saving" :disabled="!canSave" @click="save">Save</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="editOpen" title="Edit Warehouse" width="640px">
      <el-form label-position="top">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
          <el-form-item label="Code">
            <el-input v-model="editForm.code" placeholder="e.g. WH-01" />
          </el-form-item>
          <el-form-item label="Name">
            <el-input v-model="editForm.name" placeholder="e.g. Main Warehouse" />
          </el-form-item>
        </div>
        <el-form-item label="Org ID (optional)">
          <el-input v-model="editForm.orgId" placeholder="Auto from existing / context" :disabled="true" />
          <div style="color: #909399; font-size: 12px; margin-top: 6px">Org diambil dari existing warehouse atau context.</div>
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
const loading = ref(false)

const createOpen = ref(false)
const saving = ref(false)

const editOpen = ref(false)
const editSaving = ref(false)
const editingId = ref(null)

const form = reactive({
  code: '',
  name: '',
  orgId: null
})

const editForm = reactive({
  code: '',
  name: '',
  orgId: null,
  active: true
})

const canSave = computed(() => Boolean(ctx.companyId && form.code.trim() && form.name.trim()))
const canEditSave = computed(() => Boolean(ctx.companyId && editingId.value && editForm.code.trim() && editForm.name.trim()))

async function load() {
  if (!ctx.companyId) {
    rows.value = []
    return
  }
  loading.value = true
  try {
    rows.value = await masterDataApi.listWarehouses(ctx.companyId)
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  form.code = ''
  form.name = ''
  form.orgId = ctx.orgId
  createOpen.value = true
}

function openEdit(row) {
  if (!row?.id) return
  editingId.value = row.id
  editForm.code = row.code || ''
  editForm.name = row.name || ''
  editForm.orgId = row.orgId ?? ctx.orgId ?? null
  editForm.active = Boolean(row.active)
  editOpen.value = true
}

async function save() {
  saving.value = true
  try {
    await masterDataApi.createWarehouse(ctx.companyId, {
      code: form.code,
      name: form.name,
      orgId: ctx.orgId || null
    })
    ElMessage.success('Warehouse created')
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
    await masterDataApi.updateWarehouse(ctx.companyId, editingId.value, {
      code: editForm.code,
      name: editForm.name,
      orgId: editForm.orgId || null,
      active: Boolean(editForm.active)
    })
    ElMessage.success('Warehouse updated')
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
    await ElMessageBox.confirm(`Delete Warehouse "${row.code}"?`, 'Confirm', {
      type: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })
    await masterDataApi.deleteWarehouse(ctx.companyId, row.id)
    ElMessage.success('Warehouse deleted')
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

watch(
  () => ctx.orgId,
  () => {
    form.orgId = ctx.orgId
  }
)

onMounted(load)
</script>
