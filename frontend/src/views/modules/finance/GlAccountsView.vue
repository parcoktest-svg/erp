<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 600">GL Accounts</div>
            <div style="color: #606266">Chart of Accounts untuk posting jurnal dan laporan keuangan.</div>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap">
            <el-button :disabled="!ctx.companyId" :loading="seeding" @click="seedDefaults">Seed Defaults</el-button>
            <el-button type="primary" :disabled="!ctx.companyId" @click="openCreate">Create GL Account</el-button>
          </div>
        </div>

        <CompanyOrgBar :show-org="false" />
      </div>
    </el-card>

    <el-card>
      <el-alert v-if="!ctx.companyId" title="Pilih company dulu." type="warning" show-icon style="margin-bottom: 12px" />

      <el-table :data="rows" style="width: 100%" v-loading="loading">
        <el-table-column prop="code" label="Code" width="160" />
        <el-table-column prop="name" label="Name" min-width="240" />
        <el-table-column prop="type" label="Type" width="140" />
        <el-table-column prop="active" label="Active" width="110">
          <template #default="scope">
            <el-tag size="small" :type="scope.row.active ? 'success' : 'info'">{{ scope.row.active ? 'Yes' : 'No' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="createOpen" title="Create GL Account" width="620px">
      <el-form label-position="top">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
          <el-form-item label="Code">
            <el-input v-model="form.code" placeholder="e.g. 1100" />
          </el-form-item>
          <el-form-item label="Type">
            <el-select v-model="form.type" style="width: 100%">
              <el-option v-for="t in glTypes" :key="t" :label="t" :value="t" />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="Name">
          <el-input v-model="form.name" placeholder="e.g. Cash" />
        </el-form-item>

        <el-form-item label="Active">
          <el-switch v-model="form.active" />
        </el-form-item>
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
import { financeApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import CompanyOrgBar from '@/views/modules/common/CompanyOrgBar.vue'

const ctx = useContextStore()

const rows = ref([])
const loading = ref(false)

const createOpen = ref(false)
const saving = ref(false)
const seeding = ref(false)

const glTypes = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE']

const form = reactive({
  code: '',
  name: '',
  type: 'ASSET',
  active: true
})

const canSave = computed(() => {
  if (!ctx.companyId) return false
  if (!String(form.code).trim()) return false
  if (!String(form.name).trim()) return false
  if (!form.type) return false
  return true
})

async function load() {
  if (!ctx.companyId) {
    rows.value = []
    return
  }
  loading.value = true
  try {
    rows.value = await financeApi.listGlAccounts(ctx.companyId)
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  form.code = ''
  form.name = ''
  form.type = 'ASSET'
  form.active = true
  createOpen.value = true
}

async function save() {
  saving.value = true
  try {
    await financeApi.createGlAccount(ctx.companyId, {
      code: form.code,
      name: form.name,
      type: form.type,
      active: !!form.active
    })
    ElMessage.success('GL Account created')
    createOpen.value = false
    await load()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    saving.value = false
  }
}

async function seedDefaults() {
  seeding.value = true
  try {
    await financeApi.seedDefaultGlAccounts(ctx.companyId)
    ElMessage.success('Default GL Accounts seeded')
    await load()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    seeding.value = false
  }
}

watch(
  () => ctx.companyId,
  () => load()
)

onMounted(load)
</script>
