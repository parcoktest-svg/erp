<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px">
        <div>
          <div style="font-size: 18px; font-weight: 600">User Management</div>
          <div style="color: #606266; margin-top: 6px">Create/update user, reset password, change status, dan delete user (khusus ADMIN).</div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center">
          <el-button @click="load">Refresh</el-button>
          <el-button type="primary" @click="openCreate">Create User</el-button>
        </div>
      </div>
    </el-card>

    <el-card>
      <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 10px">
        <el-input v-model="q" placeholder="Search name/email..." clearable style="max-width: 260px" />
        <el-select v-model="roleFilter" clearable placeholder="Filter role" style="min-width: 180px" @change="onFilterChange">
          <el-option v-for="r in roles" :key="r" :label="r" :value="r" />
        </el-select>
        <el-select v-model="statusFilter" clearable placeholder="Filter status" style="min-width: 180px" @change="onFilterChange">
          <el-option label="ACTIVE" value="ACTIVE" />
          <el-option label="DISABLED" value="DISABLED" />
        </el-select>
      </div>

      <el-table :data="filtered" style="width: 100%" size="small" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="fullName" label="Full Name" min-width="200" />
        <el-table-column prop="email" label="Email" min-width="220" />
        <el-table-column prop="department" label="Department" width="160" />
        <el-table-column prop="role" label="Role" width="120">
          <template #default="scope">
            <el-tag size="small" type="info">{{ scope.row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status" width="120">
          <template #default="scope">
            <el-tag size="small" :type="scope.row.status === 'ACTIVE' ? 'success' : 'danger'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Action" width="420">
          <template #default="scope">
            <div style="display: flex; gap: 8px; flex-wrap: wrap">
              <el-button size="small" @click="openEdit(scope.row)">Edit</el-button>
              <el-button size="small" type="warning" plain @click="openReset(scope.row)">Reset Password</el-button>
              <el-button size="small" :type="scope.row.status === 'ACTIVE' ? 'warning' : 'success'" plain @click="onToggleStatus(scope.row)">
                {{ scope.row.status === 'ACTIVE' ? 'Disable' : 'Activate' }}
              </el-button>
              <el-button size="small" type="danger" plain @click="onDelete(scope.row)">Delete</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div style="display: flex; justify-content: flex-end; margin-top: 10px">
        <el-pagination
          v-model:current-page="page"
          :page-size="size"
          :total="total"
          layout="prev, pager, next, jumper"
          @current-change="load"
        />
      </div>
    </el-card>

    <el-dialog v-model="userOpen" :title="userMode === 'create' ? 'Create User' : 'Edit User'" width="720px">
      <el-alert
        v-if="userMode === 'create' && !departments.length"
        title="Department belum ada. Buat Department dulu di modul HR (Departments)."
        type="warning"
        show-icon
        style="margin-bottom: 12px"
      />
      <el-form label-width="140px">
        <el-form-item label="Full Name" required>
          <el-input v-model="userForm.fullName" placeholder="Full name" />
        </el-form-item>
        <el-form-item label="Email" required>
          <el-input v-model="userForm.email" placeholder="name@company.com" />
        </el-form-item>
        <el-form-item label="Role" required>
          <el-select v-model="userForm.role" placeholder="Select role" style="width: 100%">
            <el-option v-for="r in roles" :key="r" :label="r" :value="r" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="userMode === 'create'" label="Department" required>
          <el-select v-model="userForm.departmentName" filterable placeholder="Select department" style="width: 100%" :disabled="!departments.length">
            <el-option v-for="d in departments" :key="d.id" :label="d.name" :value="d.name" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="userMode === 'create'" label="Password" required>
          <el-input v-model="userForm.password" type="password" show-password placeholder="Min 8 chars" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 8px">
          <el-button @click="userOpen = false">Cancel</el-button>
          <el-button type="primary" :disabled="!canSaveUser" :loading="saving" @click="onSaveUser">Save</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="resetOpen" title="Reset Password" width="520px">
      <el-form label-width="140px">
        <el-form-item label="User">
          <div style="font-weight: 600">{{ resetTarget?.fullName }} ({{ resetTarget?.email }})</div>
        </el-form-item>
        <el-form-item label="New Password" required>
          <el-input v-model="resetForm.newPassword" type="password" show-password placeholder="Min 8 chars" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 8px">
          <el-button @click="resetOpen = false">Cancel</el-button>
          <el-button type="primary" :disabled="!canReset" :loading="saving" @click="onResetPassword">Reset</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi, hrApi } from '@/utils/api'

const roles = ['ADMIN', 'HR', 'FINANCE', 'INVENTORY', 'EMPLOYEE']

const loading = ref(false)
const saving = ref(false)

const q = ref('')
const roleFilter = ref(null)
const statusFilter = ref(null)

const page = ref(1)
const size = ref(10)
const total = ref(0)

const rows = ref([])
const departments = ref([])

const userOpen = ref(false)
const userMode = ref('create')
const editingId = ref(null)
const userForm = ref({
  fullName: '',
  email: '',
  role: 'EMPLOYEE',
  departmentName: '',
  password: ''
})

const resetOpen = ref(false)
const resetTarget = ref(null)
const resetForm = ref({ newPassword: '' })

function isValidEmail(v) {
  const s = String(v ?? '').trim()
  if (!s) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

const filtered = computed(() => {
  const qq = q.value.trim().toLowerCase()
  if (!qq) return rows.value
  return rows.value.filter((r) => {
    const hay = `${r.fullName || ''} ${r.email || ''}`.toLowerCase()
    return hay.includes(qq)
  })
})

const canSaveUser = computed(() => {
  if (!String(userForm.value.fullName || '').trim()) return false
  if (!isValidEmail(userForm.value.email)) return false
  if (!String(userForm.value.role || '').trim()) return false

  if (userMode.value === 'create') {
    if (!String(userForm.value.departmentName || '').trim()) return false
    if (!String(userForm.value.password || '').trim()) return false
    if (String(userForm.value.password).trim().length < 8) return false
  }

  return true
})

const canReset = computed(() => {
  const p = String(resetForm.value.newPassword || '').trim()
  if (p.length < 8) return false
  return true
})

function onFilterChange() {
  page.value = 1
  load()
}

async function loadDepartments() {
  try {
    departments.value = await hrApi.listDepartments()
  } catch {
    departments.value = []
  }
}

async function load() {
  loading.value = true
  try {
    const params = {
      page: page.value - 1,
      size: size.value
    }
    if (roleFilter.value) params.role = roleFilter.value
    if (statusFilter.value) params.status = statusFilter.value

    const res = await adminApi.listUsers(params)
    rows.value = res?.users || []
    total.value = Number(res?.totalItems ?? 0)
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed to load users')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  userMode.value = 'create'
  editingId.value = null
  userForm.value = {
    fullName: '',
    email: '',
    role: 'EMPLOYEE',
    departmentName: departments.value[0]?.name || '',
    password: ''
  }
  userOpen.value = true
}

function openEdit(row) {
  userMode.value = 'edit'
  editingId.value = row.id
  userForm.value = {
    fullName: row.fullName || '',
    email: row.email || '',
    role: row.role || 'EMPLOYEE',
    departmentName: row.department || '',
    password: ''
  }
  userOpen.value = true
}

async function onSaveUser() {
  saving.value = true
  try {
    if (userMode.value === 'create') {
      const payload = {
        fullName: String(userForm.value.fullName || '').trim(),
        email: String(userForm.value.email || '').trim().toLowerCase(),
        password: String(userForm.value.password || '').trim(),
        role: userForm.value.role,
        departmentName: String(userForm.value.departmentName || '').trim()
      }
      await adminApi.createUser(payload)
      ElMessage.success('User created')
    } else {
      const payload = {
        fullName: String(userForm.value.fullName || '').trim(),
        email: String(userForm.value.email || '').trim().toLowerCase(),
        role: userForm.value.role
      }
      await adminApi.updateUser(editingId.value, payload)
      ElMessage.success('User updated')
    }

    userOpen.value = false
    await load()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed to save user')
  } finally {
    saving.value = false
  }
}

function openReset(row) {
  resetTarget.value = row
  resetForm.value.newPassword = ''
  resetOpen.value = true
}

async function onResetPassword() {
  saving.value = true
  try {
    await adminApi.resetPassword(resetTarget.value.id, { newPassword: String(resetForm.value.newPassword || '').trim() })
    ElMessage.success('Password reset')
    resetOpen.value = false
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed to reset password')
  } finally {
    saving.value = false
  }
}

async function onToggleStatus(row) {
  try {
    await adminApi.changeStatus(row.id)
    ElMessage.success('Status updated')
    await load()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed to change status')
  }
}

async function onDelete(row) {
  try {
    await ElMessageBox.confirm(`Delete user "${row.fullName}"?`, 'Confirm', {
      type: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })
    await adminApi.deleteUser(row.id)
    ElMessage.success('User deleted')
    await load()
  } catch (e) {
    if (e === 'cancel' || e === 'close') return
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed to delete user')
  }
}

onMounted(async () => {
  await loadDepartments()
  await load()
})
</script>
