<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 600">Organizations</div>
            <div style="color: #606266">Org adalah unit operasional di dalam company.</div>
          </div>
          <el-button type="primary" :disabled="!ctx.companyId" @click="openCreate">Create Org</el-button>
        </div>

        <CompanyOrgBar :show-org="false" />
      </div>
    </el-card>

    <el-card>
      <el-alert v-if="!ctx.companyId" title="Pilih company dulu." type="warning" show-icon style="margin-bottom: 12px" />

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
            <el-button size="small" @click="selectOrg(scope.row)">Select</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="createOpen" title="Create Org" width="520px">
      <el-form label-position="top">
        <el-form-item label="Code">
          <el-input v-model="form.code" placeholder="e.g. HQ" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="form.name" placeholder="e.g. Head Office" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="createOpen = false">Cancel</el-button>
        <el-button type="primary" :loading="saving" :disabled="!ctx.companyId" @click="save">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { coreApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import CompanyOrgBar from '@/views/modules/common/CompanyOrgBar.vue'

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
  if (!ctx.companyId) {
    rows.value = []
    return
  }
  loading.value = true
  try {
    rows.value = await coreApi.listOrgs(ctx.companyId)
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
    const saved = await coreApi.createOrg(ctx.companyId, { code: form.code, name: form.name })
    ElMessage.success('Org created')
    createOpen.value = false
    await load()
    if (saved?.id) ctx.setOrgId(saved.id)
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    saving.value = false
  }
}

function selectOrg(row) {
  ctx.setOrgId(row.id)
  ElMessage.success(`Selected org: ${row.code}`)
}

watch(
  () => ctx.companyId,
  () => load()
)

onMounted(load)
</script>
