<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 600">Locators</div>
            <div style="color: #606266">Rak/lokasi penyimpanan stok per warehouse.</div>
          </div>
          <el-button type="primary" :disabled="!ctx.companyId" @click="openCreate">Create Locator</el-button>
        </div>

        <CompanyOrgBar />
      </div>
    </el-card>

    <el-card>
      <el-alert v-if="!ctx.companyId" title="Pilih company dulu." type="warning" show-icon style="margin-bottom: 12px" />

      <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 10px">
        <el-select v-model="filters.warehouseId" placeholder="Filter warehouse" clearable style="width: 260px" :disabled="warehouses.length === 0">
          <el-option v-for="w in warehouses" :key="w.id" :label="`${w.code} - ${w.name}`" :value="w.id" />
        </el-select>
        <el-button size="small" :disabled="!ctx.companyId" @click="load">Refresh</el-button>
      </div>

      <el-table :data="rows" style="width: 100%" v-loading="loading">
        <el-table-column prop="code" label="Code" width="160" />
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="active" label="Active" width="120">
          <template #default="scope">
            <el-tag size="small" :type="scope.row.active ? 'success' : 'info'">{{ scope.row.active ? 'Yes' : 'No' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <el-alert
        v-if="ctx.companyId && warehouses.length === 0"
        title="Warehouse belum ada. Buat dulu di Master Data > Warehouses."
        type="warning"
        show-icon
        style="margin-top: 12px"
      />
    </el-card>

    <el-dialog v-model="createOpen" title="Create Locator" width="720px">
      <el-form label-position="top">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
          <el-form-item label="Warehouse">
            <el-select v-model="form.warehouseId" filterable placeholder="Select warehouse" style="width: 100%" :disabled="warehouses.length === 0">
              <el-option v-for="w in warehouses" :key="w.id" :label="`${w.code} - ${w.name}`" :value="w.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Org">
            <el-input v-model="form.orgId" placeholder="Auto from context" :disabled="true" />
          </el-form-item>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
          <el-form-item label="Code">
            <el-input v-model="form.code" placeholder="e.g. RACK-A1" />
          </el-form-item>
          <el-form-item label="Name">
            <el-input v-model="form.name" placeholder="e.g. Rack A1" />
          </el-form-item>
        </div>
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
import { inventoryApi, masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import CompanyOrgBar from '@/views/modules/common/CompanyOrgBar.vue'

const ctx = useContextStore()

const rows = ref([])
const warehouses = ref([])
const loading = ref(false)

const filters = reactive({
  warehouseId: null
})

const createOpen = ref(false)
const saving = ref(false)

const form = reactive({
  warehouseId: null,
  orgId: null,
  code: '',
  name: ''
})

const canSave = computed(() => Boolean(ctx.companyId && form.warehouseId && form.code.trim() && form.name.trim()))

async function loadWarehouses() {
  if (!ctx.companyId) {
    warehouses.value = []
    return
  }
  try {
    warehouses.value = await masterDataApi.listWarehouses(ctx.companyId)
  } catch {
    warehouses.value = []
  }
}

async function load() {
  if (!ctx.companyId) {
    rows.value = []
    return
  }
  loading.value = true
  try {
    rows.value = await inventoryApi.listLocators(ctx.companyId, filters.warehouseId ? { warehouseId: filters.warehouseId } : undefined)
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  form.warehouseId = warehouses.value[0]?.id || null
  form.orgId = ctx.orgId
  form.code = ''
  form.name = ''
  createOpen.value = true
}

async function save() {
  saving.value = true
  try {
    await inventoryApi.createLocator(ctx.companyId, {
      warehouseId: form.warehouseId,
      orgId: ctx.orgId || null,
      code: form.code,
      name: form.name
    })
    ElMessage.success('Locator created')
    createOpen.value = false
    await load()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    saving.value = false
  }
}

watch(
  () => ctx.companyId,
  async () => {
    await loadWarehouses()
    await load()
  }
)

watch(
  () => filters.warehouseId,
  () => load()
)

watch(
  () => ctx.orgId,
  () => {
    form.orgId = ctx.orgId
  }
)

onMounted(async () => {
  await loadWarehouses()
  await load()
})
</script>
