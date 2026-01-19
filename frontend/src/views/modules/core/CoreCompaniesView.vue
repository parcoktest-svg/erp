<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
        <div>
          <div style="font-size: 18px; font-weight: 600">Companies</div>
          <div style="color: #606266">Buat dan pilih company untuk menjalankan flow ERP.</div>
        </div>
        <el-button type="primary" @click="openCreate">Create Company</el-button>
      </div>
    </el-card>

    <el-card>
      <el-table :data="rows" style="width: 100%" v-loading="loading">
        <el-table-column prop="code" label="Code" width="160" />
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="active" label="Active" width="100">
          <template #default="scope">
            <el-tag size="small" :type="scope.row.active ? 'success' : 'info'">{{ scope.row.active ? 'Yes' : 'No' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Action" width="180">
          <template #default="scope">
            <el-button size="small" @click="selectCompany(scope.row)">Select</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="createOpen" title="Create Company" width="520px">
      <el-form label-position="top">
        <el-form-item label="Code">
          <el-input v-model="form.code" placeholder="e.g. COMP01" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="form.name" placeholder="e.g. PT Example" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="createOpen = false">Cancel</el-button>
        <el-button type="primary" :loading="saving" @click="save">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { coreApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'

const ctx = useContextStore()

const rows = ref([])
const loading = ref(false)

const createOpen = ref(false)
const saving = ref(false)

const form = reactive({
  code: '',
  name: ''
})

async function load() {
  loading.value = true
  try {
    rows.value = await coreApi.listCompanies()
  } finally {
    loading.value = false
  }
}

function openCreate() {
  form.code = ''
  form.name = ''
  createOpen.value = true
}

async function save() {
  saving.value = true
  try {
    const saved = await coreApi.createCompany({ code: form.code, name: form.name })
    ElMessage.success('Company created')
    createOpen.value = false
    await load()
    if (saved?.id) ctx.setCompanyId(saved.id)
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    saving.value = false
  }
}

function selectCompany(row) {
  ctx.setCompanyId(row.id)
  ElMessage.success(`Selected company: ${row.code}`)
}

onMounted(load)
</script>
