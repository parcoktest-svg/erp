<template>
  <div style="display: grid; grid-template-columns: 360px 1fr; gap: 12px">
    <el-card style="height: calc(100vh - 140px); overflow: auto">
      <div style="font-weight: 600; margin-bottom: 8px">Endpoints</div>

      <el-input v-model="q" placeholder="Search path / controller..." clearable style="margin-bottom: 10px" />

      <el-select v-model="methodFilter" placeholder="Method" clearable style="width: 100%; margin-bottom: 10px">
        <el-option label="GET" value="GET" />
        <el-option label="POST" value="POST" />
        <el-option label="PUT" value="PUT" />
        <el-option label="DELETE" value="DELETE" />
        <el-option label="PATCH" value="PATCH" />
      </el-select>

      <el-menu :default-active="selectedKey" @select="onSelect" style="border-right: none">
        <el-menu-item v-for="e in filtered" :key="e.key" :index="e.key">
          <div style="display: flex; flex-direction: column">
            <div style="display: flex; gap: 8px; align-items: center">
              <el-tag size="small" :type="tagType(e.method)">{{ e.method }}</el-tag>
              <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace">
                {{ e.fullPath }}
              </span>
            </div>
            <div style="color: #909399; font-size: 12px">{{ e.controller }}#{{ e.handler }}</div>
          </div>
        </el-menu-item>
      </el-menu>
    </el-card>

    <el-card>
      <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px">
        <el-tag v-if="selected" :type="tagType(selected.method)">{{ selected.method }}</el-tag>
        <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace">
          {{ selected?.fullPath || '-' }}
        </div>
      </div>

      <el-form label-position="top">
        <el-form-item label="Base URL">
          <el-input v-model="baseUrl" />
        </el-form-item>

        <el-form-item label="URL">
          <el-input v-model="url" />
        </el-form-item>

        <el-form-item label="Method">
          <el-select v-model="method" style="width: 220px">
            <el-option label="GET" value="GET" />
            <el-option label="POST" value="POST" />
            <el-option label="PUT" value="PUT" />
            <el-option label="DELETE" value="DELETE" />
            <el-option label="PATCH" value="PATCH" />
          </el-select>
        </el-form-item>

        <el-form-item label="Query Params (JSON)">
          <el-input v-model="paramsJson" type="textarea" :rows="4" placeholder='{"page":0,"size":10}' />
        </el-form-item>

        <el-form-item label="Body (JSON)">
          <el-input v-model="bodyJson" type="textarea" :rows="10" placeholder='{"email":"...","password":"..."}' />
        </el-form-item>

        <el-button type="primary" :loading="loading" @click="send">Send</el-button>
      </el-form>

      <div style="margin-top: 16px">
        <div style="font-weight: 600; margin-bottom: 8px">Response</div>
        <el-input v-model="responseText" type="textarea" :rows="16" readonly />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { genericApi } from '@/utils/api'
import endpoints from '@/generated/endpoints.json'

const route = useRoute()

const baseUrl = ref(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080')

const q = ref('')
const methodFilter = ref('')

const selectedKey = ref('')
const selected = ref(null)

const url = ref('')
const method = ref('GET')
const paramsJson = ref('')
const bodyJson = ref('')

const loading = ref(false)
const responseText = ref('')

const flattened = computed(() => {
  const arr = []
  for (const c of endpoints.controllers || []) {
    for (const e of c.endpoints || []) {
      arr.push({
        key: `${c.name}:${e.method}:${e.path}:${e.handler}`,
        controller: c.name,
        handler: e.handler,
        method: e.method,
        fullPath: e.path
      })
    }
  }
  return arr
})

const filtered = computed(() => {
  const qq = q.value.trim().toLowerCase()
  return flattened.value.filter((e) => {
    if (methodFilter.value && e.method !== methodFilter.value) return false
    if (!qq) return true
    return e.fullPath.toLowerCase().includes(qq) || e.controller.toLowerCase().includes(qq) || e.handler.toLowerCase().includes(qq)
  })
})

function tagType(m) {
  if (m === 'GET') return 'success'
  if (m === 'POST') return 'warning'
  if (m === 'PUT' || m === 'PATCH') return 'info'
  if (m === 'DELETE') return 'danger'
  return ''
}

function onSelect(key) {
  selectedKey.value = key
  selected.value = filtered.value.find((x) => x.key === key) || null
  if (selected.value) {
    url.value = selected.value.fullPath
    method.value = selected.value.method
    paramsJson.value = ''
    bodyJson.value = ''
    responseText.value = ''
  }
}

function safeParseJson(text) {
  const t = (text || '').trim()
  if (!t) return undefined
  return JSON.parse(t)
}

async function send() {
  loading.value = true
  responseText.value = ''
  try {
    const params = safeParseJson(paramsJson.value)
    const data = safeParseJson(bodyJson.value)

    const fullUrl = url.value.startsWith('http') ? url.value : `${baseUrl.value}${url.value.startsWith('/') ? '' : '/'}${url.value}`

    const res = await genericApi.request({
      method: method.value,
      url: fullUrl,
      params,
      data
    })

    responseText.value = JSON.stringify(res, null, 2)
  } catch (e) {
    responseText.value = JSON.stringify(
      {
        message: e?.message,
        status: e?.response?.status,
        data: e?.response?.data
      },
      null,
      2
    )
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (typeof route.query.q === 'string' && route.query.q.trim()) {
    q.value = route.query.q.trim()
  }
  if (filtered.value.length) onSelect(filtered.value[0].key)
})

watch(
  () => route.query.q,
  (next) => {
    if (typeof next === 'string') q.value = next
  }
)
</script>
