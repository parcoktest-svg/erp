<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 600">Business Partners</div>
            <div style="color: #606266">Customer, Vendor, atau keduanya (BOTH).</div>
          </div>
          <el-button type="primary" :disabled="!ctx.companyId" @click="openCreate">Create Business Partner</el-button>
        </div>

        <CompanyOrgBar :show-org="false" />
      </div>
    </el-card>

    <el-card>
      <el-alert v-if="!ctx.companyId" title="Pilih company dulu." type="warning" show-icon style="margin-bottom: 12px" />

      <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 10px; flex-wrap: wrap">
        <el-input v-model="q" placeholder="Search name/email/phone" clearable style="max-width: 360px" />
        <el-select v-model="typeFilter" placeholder="Filter type" clearable style="width: 220px">
          <el-option label="CUSTOMER" value="CUSTOMER" />
          <el-option label="VENDOR" value="VENDOR" />
          <el-option label="BOTH" value="BOTH" />
        </el-select>
      </div>

      <el-table :data="filtered" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="90" />
        <el-table-column prop="name" label="Name" min-width="220" />
        <el-table-column prop="type" label="Type" width="120">
          <template #default="scope">
            <el-tag size="small" type="info">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="Email" min-width="220" />
        <el-table-column prop="phone" label="Phone" width="160" />
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

    <el-dialog v-model="createOpen" title="Create Business Partner" width="620px">
      <el-form label-position="top">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
          <el-form-item label="Type">
            <el-select v-model="form.type" style="width: 100%">
              <el-option label="CUSTOMER" value="CUSTOMER" />
              <el-option label="VENDOR" value="VENDOR" />
              <el-option label="BOTH" value="BOTH" />
            </el-select>
          </el-form-item>
          <el-form-item label="Name">
            <el-input v-model="form.name" placeholder="e.g. PT Vendor A" />
          </el-form-item>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
          <el-form-item label="Email">
            <el-input v-model="form.email" placeholder="optional" />
          </el-form-item>
          <el-form-item label="Phone">
            <el-input v-model="form.phone" placeholder="optional" />
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <el-button @click="createOpen = false">Cancel</el-button>
        <el-button type="primary" :loading="saving" :disabled="!canSave" @click="save">Save</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="editOpen" title="Edit Business Partner" width="620px">
      <el-form label-position="top">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
          <el-form-item label="Type">
            <el-select v-model="editForm.type" style="width: 100%">
              <el-option label="CUSTOMER" value="CUSTOMER" />
              <el-option label="VENDOR" value="VENDOR" />
              <el-option label="BOTH" value="BOTH" />
            </el-select>
          </el-form-item>
          <el-form-item label="Name">
            <el-input v-model="editForm.name" placeholder="e.g. PT Vendor A" />
          </el-form-item>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
          <el-form-item label="Email">
            <el-input v-model="editForm.email" placeholder="optional" />
          </el-form-item>
          <el-form-item label="Phone">
            <el-input v-model="editForm.phone" placeholder="optional" />
          </el-form-item>
        </div>

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

const q = ref('')
const typeFilter = ref('')

const createOpen = ref(false)
const saving = ref(false)

const editOpen = ref(false)
const editSaving = ref(false)
const editingId = ref(null)

const form = reactive({
  type: 'CUSTOMER',
  name: '',
  email: '',
  phone: ''
})

const editForm = reactive({
  type: 'CUSTOMER',
  name: '',
  email: '',
  phone: '',
  active: true
})

const canSave = computed(() => Boolean(ctx.companyId && form.name.trim() && form.type))
const canEditSave = computed(() => Boolean(ctx.companyId && editingId.value && editForm.name.trim() && editForm.type))

const filtered = computed(() => {
  const qq = q.value.trim().toLowerCase()
  return (rows.value || []).filter((r) => {
    if (typeFilter.value && r.type !== typeFilter.value) return false
    if (!qq) return true
    return (
      String(r.name || '').toLowerCase().includes(qq) ||
      String(r.email || '').toLowerCase().includes(qq) ||
      String(r.phone || '').toLowerCase().includes(qq)
    )
  })
})

async function load() {
  if (!ctx.companyId) {
    rows.value = []
    return
  }
  loading.value = true
  try {
    rows.value = await masterDataApi.listBusinessPartners(ctx.companyId)
  } finally {
    loading.value = false
  }
}

function openCreate() {
  form.type = 'CUSTOMER'
  form.name = ''
  form.email = ''
  form.phone = ''
  createOpen.value = true
}

function openEdit(row) {
  if (!row?.id) return
  editingId.value = row.id
  editForm.type = row.type || 'CUSTOMER'
  editForm.name = row.name || ''
  editForm.email = row.email || ''
  editForm.phone = row.phone || ''
  editForm.active = Boolean(row.active)
  editOpen.value = true
}

async function save() {
  saving.value = true
  try {
    await masterDataApi.createBusinessPartner(ctx.companyId, {
      type: form.type,
      name: form.name,
      email: form.email || null,
      phone: form.phone || null
    })
    ElMessage.success('Business Partner created')
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
    await masterDataApi.updateBusinessPartner(ctx.companyId, editingId.value, {
      type: editForm.type,
      name: editForm.name,
      email: String(editForm.email || '').trim() || null,
      phone: String(editForm.phone || '').trim() || null,
      active: Boolean(editForm.active)
    })
    ElMessage.success('Business Partner updated')
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
    await ElMessageBox.confirm(`Delete Business Partner "${row.name}"?`, 'Confirm', {
      type: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })
    await masterDataApi.deleteBusinessPartner(ctx.companyId, row.id)
    ElMessage.success('Business Partner deleted')
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
