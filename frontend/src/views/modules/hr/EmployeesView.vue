<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px">
        <div>
          <div style="font-size: 18px; font-weight: 600">Employees</div>
          <div style="color: #606266; margin-top: 6px">Manage employee master data (role, department, salary, active).</div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center">
          <el-button @click="load">Refresh</el-button>
          <el-button type="primary" :disabled="!hasDepartments" @click="openCreate">Create Employee</el-button>
        </div>
      </div>
    </el-card>

    <el-card>
      <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 10px">
        <el-input v-model="q" placeholder="Search name/email..." clearable style="max-width: 260px" />
        <el-select v-model="deptFilter" clearable filterable placeholder="Filter department" style="min-width: 220px">
          <el-option v-for="d in departments" :key="d.id" :label="d.name" :value="d.id" />
        </el-select>
        <el-select v-model="activeFilter" clearable placeholder="Filter status" style="min-width: 180px">
          <el-option label="Active" :value="true" />
          <el-option label="Inactive" :value="false" />
        </el-select>
      </div>

      <el-table :data="filtered" style="width: 100%" size="small" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="Name" min-width="180" />
        <el-table-column prop="email" label="Email" min-width="200" />
        <el-table-column prop="phone" label="Phone" width="140" />
        <el-table-column prop="departmentName" label="Department" width="160" />
        <el-table-column prop="role" label="Role" width="120">
          <template #default="scope">
            <el-tag size="small" type="info">{{ scope.row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="active" label="Status" width="110">
          <template #default="scope">
            <el-tag size="small" :type="scope.row.active ? 'success' : 'danger'">{{ scope.row.active ? 'Active' : 'Inactive' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Action" width="320">
          <template #default="scope">
            <div style="display: flex; gap: 8px; flex-wrap: wrap">
              <el-button size="small" @click="openEdit(scope.row)">Edit</el-button>
              <el-button size="small" :type="scope.row.active ? 'warning' : 'success'" plain @click="onToggle(scope.row)">
                {{ scope.row.active ? 'Deactivate' : 'Activate' }}
              </el-button>
              <el-button size="small" type="danger" plain @click="onDelete(scope.row)">Delete</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="editOpen" :title="editMode === 'create' ? 'Create Employee' : 'Edit Employee'" width="760px">
      <el-alert
        v-if="editMode === 'create' && !hasDepartments"
        title="Department belum ada. Buat Department dulu sebelum membuat Employee."
        type="warning"
        show-icon
        style="margin-bottom: 12px"
      />
      <el-alert v-if="saveIssues.length" type="warning" show-icon style="margin-bottom: 12px">
        <template #title>
          <div style="display: flex; flex-direction: column; gap: 6px">
            <div>Lengkapi data berikut agar bisa Save:</div>
            <div>
              <div v-for="(s, idx) in saveIssues" :key="idx">- {{ s }}</div>
            </div>
          </div>
        </template>
      </el-alert>
      <el-form label-width="140px">
        <el-form-item label="Name" required>
          <el-input v-model="form.name" placeholder="Employee name" />
        </el-form-item>

        <el-form-item label="Email" required>
          <el-input v-model="form.email" placeholder="name@company.com" />
        </el-form-item>

        <el-form-item label="Phone">
          <el-input v-model="form.phone" placeholder="08xxxxxxxx" />
        </el-form-item>

        <el-form-item label="Department" required>
          <el-select v-model="form.departmentId" filterable placeholder="Select department" style="width: 100%">
            <el-option v-for="d in departments" :key="d.id" :label="d.name" :value="d.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="Role" required>
          <el-select v-model="form.role" placeholder="Select role" style="width: 100%">
            <el-option v-for="r in roles" :key="r" :label="r" :value="r" />
          </el-select>
        </el-form-item>

        <el-form-item label="Active">
          <el-switch v-model="form.active" />
        </el-form-item>

        <el-divider />

        <el-form-item label="Base Salary">
          <el-input v-model="form.baseSalary" placeholder="e.g. 5000000" />
        </el-form-item>

        <el-form-item label="Bonus">
          <el-input v-model="form.bonus" placeholder="e.g. 0" />
        </el-form-item>

        <el-form-item label="Deduction">
          <el-input v-model="form.deduction" placeholder="e.g. 0" />
        </el-form-item>

        <el-form-item label="Performance Rating">
          <el-input v-model="form.performanceRating" placeholder="e.g. 4.5" />
        </el-form-item>

        <el-divider />

        <el-form-item :label="editMode === 'create' ? 'Password' : 'New Password'" :required="editMode === 'create'">
          <el-input v-model="form.password" type="password" show-password placeholder="Leave blank to keep unchanged" />
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

const roles = ['ADMIN', 'HR', 'FINANCE', 'INVENTORY', 'EMPLOYEE']

const loading = ref(false)
const saving = ref(false)
const rows = ref([])
const departments = ref([])

const q = ref('')
const deptFilter = ref(null)
const activeFilter = ref(null)

const hasDepartments = computed(() => (departments.value || []).length > 0)

const editOpen = ref(false)
const editMode = ref('create')
const editingId = ref(null)

const form = ref({
  name: '',
  email: '',
  phone: '',
  role: 'EMPLOYEE',
  departmentId: null,
  baseSalary: '',
  bonus: '',
  deduction: '',
  performanceRating: '',
  active: true,
  password: ''
})

function isValidEmail(v) {
  const s = String(v ?? '').trim()
  if (!s) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

const canSave = computed(() => {
  if (!String(form.value.name || '').trim()) return false
  if (!isValidEmail(form.value.email)) return false
  if (!String(form.value.role || '').trim()) return false
  if (!form.value.departmentId) return false
  if (editMode.value === 'create' && !String(form.value.password || '').trim()) return false
  return true
})

const saveIssues = computed(() => {
  const issues = []
  if (!String(form.value.name || '').trim()) issues.push('Name wajib diisi')
  if (!isValidEmail(form.value.email)) issues.push('Email tidak valid (contoh: nama@company.com)')
  if (!form.value.departmentId) issues.push('Department wajib dipilih')
  if (!String(form.value.role || '').trim()) issues.push('Role wajib dipilih')
  if (editMode.value === 'create' && !String(form.value.password || '').trim()) issues.push('Password wajib diisi untuk Create')
  return issues
})

const filtered = computed(() => {
  const qq = q.value.trim().toLowerCase()
  return rows.value.filter((r) => {
    if (qq) {
      const hay = `${r.name || ''} ${r.email || ''}`.toLowerCase()
      if (!hay.includes(qq)) return false
    }
    if (deptFilter.value && r.departmentId !== deptFilter.value) return false
    if (activeFilter.value !== null && activeFilter.value !== undefined) {
      if (Boolean(r.active) !== Boolean(activeFilter.value)) return false
    }
    return true
  })
})

function normalizeNumber(v) {
  const s = String(v ?? '').trim()
  if (!s) return null
  const n = Number(s)
  if (Number.isNaN(n)) return null
  return n
}

async function load() {
  loading.value = true
  try {
    const [depts, emps] = await Promise.all([hrApi.listDepartments(), hrApi.listEmployees()])
    departments.value = depts
    rows.value = emps

    if (!deptFilter.value && (departments.value || []).length === 1) {
      deptFilter.value = departments.value[0].id
    }

    if (editOpen.value && editMode.value === 'create' && !form.value.departmentId && hasDepartments.value) {
      form.value.departmentId = departments.value[0].id
    }
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed to load employees')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  if (!hasDepartments.value) {
    ElMessage.warning('Department belum ada. Buat Department dulu.')
    return
  }
  editMode.value = 'create'
  editingId.value = null
  form.value = {
    name: '',
    email: '',
    phone: '',
    role: 'EMPLOYEE',
    departmentId: departments.value[0]?.id || null,
    baseSalary: '',
    bonus: '',
    deduction: '',
    performanceRating: '',
    active: true,
    password: ''
  }
  editOpen.value = true
}

function openEdit(row) {
  editMode.value = 'edit'
  editingId.value = row.id
  form.value = {
    name: row.name || '',
    email: row.email || '',
    phone: row.phone || '',
    role: row.role || 'EMPLOYEE',
    departmentId: row.departmentId || null,
    baseSalary: row.baseSalary ?? '',
    bonus: row.bonus ?? '',
    deduction: row.deduction ?? '',
    performanceRating: row.performanceRating ?? '',
    active: Boolean(row.active),
    password: ''
  }
  editOpen.value = true
}

async function onSave() {
  saving.value = true
  try {
    const payload = {
      name: String(form.value.name || '').trim(),
      email: String(form.value.email || '').trim().toLowerCase(),
      phone: String(form.value.phone || '').trim() || null,
      role: form.value.role,
      departmentId: form.value.departmentId,
      baseSalary: normalizeNumber(form.value.baseSalary),
      bonus: normalizeNumber(form.value.bonus) ?? 0,
      deduction: normalizeNumber(form.value.deduction) ?? 0,
      performanceRating: String(form.value.performanceRating || '').trim() || null,
      active: Boolean(form.value.active),
      password: String(form.value.password || '').trim() || null
    }

    if (!isValidEmail(payload.email)) {
      ElMessage.error('Email tidak valid. Contoh: nama@company.com')
      return
    }

    if (editMode.value === 'create') {
      await hrApi.createEmployee(payload)
      ElMessage.success('Employee created')
    } else {
      if (!payload.password) delete payload.password
      await hrApi.updateEmployee(editingId.value, payload)
      ElMessage.success('Employee updated')
    }

    editOpen.value = false
    await load()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed to save employee')
  } finally {
    saving.value = false
  }
}

async function onToggle(row) {
  try {
    await hrApi.toggleEmployeeStatus(row.id)
    ElMessage.success('Status updated')
    await load()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed to toggle status')
  }
}

async function onDelete(row) {
  try {
    await ElMessageBox.confirm(`Delete employee "${row.name}"?`, 'Confirm', {
      type: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })
    await hrApi.deleteEmployee(row.id)
    ElMessage.success('Employee deleted')
    await load()
  } catch (e) {
    if (e === 'cancel' || e === 'close') return
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed to delete employee')
  }
}

onMounted(load)
</script>
