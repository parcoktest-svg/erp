<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 600">UoM (Unit of Measure)</div>
            <div style="color: #606266">Satuan untuk produk, misalnya PCS, KG, LTR.</div>
          </div>
          <el-button type="primary" :disabled="!ctx.companyId" @click="openCreate">Create UoM</el-button>
        </div>

        <CompanyOrgBar :show-org="false" />
      </div>
    </el-card>

    <el-card>
      <el-alert v-if="!ctx.companyId" title="Pilih company dulu." type="warning" show-icon style="margin-bottom: 12px" />

      <el-table :data="rows" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="90" />
        <el-table-column prop="code" label="Code" width="180" />
        <el-table-column prop="name" label="Name" />
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

    <el-dialog v-model="createOpen" title="Create UoM" width="520px">
      <el-form label-position="top">
        <el-form-item label="Code">
          <el-input v-model="form.code" placeholder="e.g. PCS" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="form.name" placeholder="e.g. Pieces" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="createOpen = false">Cancel</el-button>
        <el-button type="primary" :loading="saving" :disabled="!canSave" @click="save">Save</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="editOpen" title="Edit UoM" width="520px">
      <el-form label-position="top">
        <el-form-item label="Code">
          <el-input v-model="editForm.code" placeholder="e.g. PCS" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="editForm.name" placeholder="e.g. Pieces" />
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

const editForm = reactive({
  code: '',
  name: '',
  active: true
})

const form = reactive({
  code: '',
  name: ''
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
    rows.value = await masterDataApi.listUoms(ctx.companyId)
  } finally {
    loading.value = false
  }
}

function openCreate() {
  form.code = ''
  form.name = ''
  createOpen.value = true
}

function openEdit(row) {
  if (!row?.id) return
  editingId.value = row.id
  editForm.code = row.code || ''
  editForm.name = row.name || ''
  editForm.active = Boolean(row.active)
  editOpen.value = true
}

async function save() {
  saving.value = true
  try {
    await masterDataApi.createUom(ctx.companyId, { code: form.code, name: form.name })
    ElMessage.success('UoM created')
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
    await masterDataApi.updateUom(ctx.companyId, editingId.value, {
      code: editForm.code,
      name: editForm.name,
      active: Boolean(editForm.active)
    })
    ElMessage.success('UoM updated')
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
    await ElMessageBox.confirm(`Delete UoM "${row.code}"?`, 'Confirm', {
      type: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })
    await masterDataApi.deleteUom(ctx.companyId, row.id)
    ElMessage.success('UoM deleted')
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
