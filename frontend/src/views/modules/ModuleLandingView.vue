<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px">
        <div>
          <div style="font-size: 18px; font-weight: 600">{{ mod?.title || 'Module' }}</div>
          <div style="color: #606266; margin-top: 6px">{{ mod?.description || 'Module not found' }}</div>
        </div>
        <el-button type="primary" :disabled="!mod" plain @click="openApiExplorer">Advanced (API Explorer)</el-button>
      </div>
    </el-card>

    <el-card v-if="mod">
      <div style="font-weight: 600; margin-bottom: 8px">Flow Bisnis</div>
      <el-steps direction="vertical" :active="0" finish-status="success">
        <el-step v-for="(s, idx) in mod.flow" :key="idx" :title="s" />
      </el-steps>
    </el-card>

    <el-card v-if="mod">
      <div style="font-weight: 600; margin-bottom: 8px">Menu</div>

      <div v-if="(mod.pages || []).length" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px">
        <el-card v-for="p in mod.pages" :key="p.to" shadow="hover" style="cursor: pointer" @click="go(p.to)">
          <div style="font-weight: 600">{{ p.title }}</div>
          <div style="color: #606266; margin-top: 6px">{{ p.description }}</div>
          <div style="margin-top: 10px">
            <el-button type="primary" size="small" @click.stop="go(p.to)">Open</el-button>
          </div>
        </el-card>
      </div>

      <el-empty v-else description="Menu user-friendly untuk modul ini belum tersedia." />

      <el-divider />

      <el-collapse>
        <el-collapse-item title="Advanced: Endpoint list (untuk developer)" name="advanced">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px">
            <div style="font-weight: 600">Endpoints</div>
            <el-input v-model="q" placeholder="Search endpoint..." clearable style="max-width: 320px" />
          </div>

          <el-table :data="filtered" size="small" style="width: 100%" :default-sort="{ prop: 'path', order: 'ascending' }">
            <el-table-column prop="method" label="Method" width="90">
              <template #default="scope">
                <el-tag size="small" :type="tagType(scope.row.method)">{{ scope.row.method }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="path" label="Path" min-width="340">
              <template #default="scope">
                <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace">{{ scope.row.path }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="controller" label="Controller" min-width="200" />
            <el-table-column prop="handler" label="Handler" min-width="180" />
            <el-table-column label="Action" width="120">
              <template #default="scope">
                <el-button size="small" @click="tryEndpoint(scope.row)">Try</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import endpoints from '@/generated/endpoints.json'
import { findModule, matchEndpointToModule } from '@/modules/moduleRegistry'

const route = useRoute()
const router = useRouter()

const q = ref('')

const mod = computed(() => findModule(route.params.module))

const list = computed(() => {
  const arr = []
  for (const c of endpoints.controllers || []) {
    for (const e of c.endpoints || []) {
      if (!mod.value) continue
      if (!matchEndpointToModule(e.path, mod.value)) continue
      arr.push({ controller: c.name, handler: e.handler, method: e.method, path: e.path })
    }
  }
  return arr
})

const filtered = computed(() => {
  const qq = q.value.trim().toLowerCase()
  if (!qq) return list.value
  return list.value.filter((e) => e.path.toLowerCase().includes(qq) || e.controller.toLowerCase().includes(qq) || e.handler.toLowerCase().includes(qq))
})

function openApiExplorer() {
  if (!mod.value) return
  const primaryPrefix = (mod.value.match && mod.value.match[0]) || ''
  router.push({ name: 'api-explorer', query: { q: primaryPrefix } })
}

function go(path) {
  router.push(path)
}

function tryEndpoint(e) {
  router.push({ name: 'api-explorer', query: { q: e.path } })
}

function tagType(m) {
  if (m === 'GET') return 'success'
  if (m === 'POST') return 'warning'
  if (m === 'PUT' || m === 'PATCH') return 'info'
  if (m === 'DELETE') return 'danger'
  return ''
}

watch(
  () => route.params.module,
  () => {
    q.value = ''
  }
)
</script>
