<template>
  <el-card>
    <div style="font-size: 18px; font-weight: 600; margin-bottom: 12px">Sign in</div>

    <el-form :model="form" label-position="top" @submit.prevent>
      <el-form-item label="Email">
        <el-input v-model="form.email" autocomplete="username" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input v-model="form.password" type="password" autocomplete="current-password" show-password />
      </el-form-item>

      <el-alert v-if="error" :title="error" type="error" show-icon style="margin-bottom: 12px" />

      <el-button type="primary" :loading="loading" style="width: 100%" @click="onSubmit">Login</el-button>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    await auth.login({ email: form.email, password: form.password })
    router.push('/')
  } catch (e) {
    error.value = e?.response?.data?.message || e?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
