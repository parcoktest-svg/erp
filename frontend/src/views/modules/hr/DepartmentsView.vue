<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
        <div>
          <div style="font-size: 18px; font-weight: 600">Departments</div>
          <div style="color: #606266; margin-top: 6px">Setup department untuk struktur organisasi & filter employee.</div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center">
          <el-button @click="load">Refresh</el-button>
          <el-button type="primary" @click="openCreate">Create Department</el-button>
        </div>
      </div>
    </el-card>

    <el-card>
      <el-table :data="rows" style="width: 100%" size="small" v-loading="loading">
        <el-table-column prop="id" label="ID" width="90" />
        <el-table-column prop="name" label="Name" min-width="240" />
        <el-table-column label="Action" width="220">
          <template #default="scope">
            <div style="display: flex; gap: 8px">
              <el-button size="small" @click="openEdit(scope.row)">Edit</el-button>
              <el-button size="small" type="danger" plain @click="onDelete(scope.row)">Delete</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="editOpen" :title="editMode === 'create' ? 'Create Department' : 'Edit Department'" width="520px">
      <el-form label-width="120px">
        <el-form-item label="Name" required>
          <el-input v-model="form.name" placeholder="e.g. Production" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 8px">
          <el-button @click="editOpen = false">Cancel</el-button>
          <el-button type="primary" :disabled="!canSave" :loading="saving" @click="onSave">Save</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { hrApi } from '@/utils/api'

const loading = ref(false)
const saving = ref(false)
const rows = ref([])

const editOpen = ref(false)
const editMode = ref('create')
const editingId = ref(null)

const form = ref({
  name: ''
})

const canSave = computed(() => {
  if (!String(form.value.name || '').trim()) return false
  return true
})

async function load() {
  loading.value = true
  try {
    rows.value = await hrApi.listDepartments()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed to load departments')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editMode.value = 'create'
  editingId.value = null
  form.value.name = ''
  editOpen.value = true
}

function openEdit(row) {
  editMode.value = 'edit'
  editingId.value = row.id
  form.value.name = row.name
  editOpen.value = true
}

async function onSave() {
  saving.value = true
  try {
    if (editMode.value === 'create') {
      await hrApi.createDepartment({ name: form.value.name })
      ElMessage.success('Department created')
    } else {
      await hrApi.updateDepartment(editingId.value, { id: editingId.value, name: form.value.name })
      ElMessage.success('Department updated')
    }
    editOpen.value = false
    await load()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed to save department')
  } finally {
    saving.value = false
  }
}

async function onDelete(row) {
  try {
    await ElMessageBox.confirm(`Delete department "${row.name}"?`, 'Confirm', {
      type: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })
    await hrApi.deleteDepartment(row.id)
    ElMessage.success('Department deleted')
    await load()
  } catch (e) {
    if (e === 'cancel' || e === 'close') return
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed to delete department')
  }
}

onMounted(load)
</script>
