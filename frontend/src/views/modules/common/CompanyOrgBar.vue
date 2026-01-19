<template>
  <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
    <div style="display: flex; gap: 8px; align-items: center">
      <span style="color: #606266">Company</span>
      <el-select v-model="companyIdLocal" filterable placeholder="Select company" style="min-width: 220px" @change="onCompanyChange">
        <el-option v-for="c in companies" :key="c.id" :label="`${c.code} - ${c.name}`" :value="c.id" />
      </el-select>
      <el-button size="small" @click="refresh">Refresh</el-button>
    </div>

    <div v-if="showOrg" style="display: flex; gap: 8px; align-items: center">
      <span style="color: #606266">Org</span>
      <el-select v-model="orgIdLocal" filterable placeholder="Select org" style="min-width: 220px" :disabled="!companyIdLocal" @change="onOrgChange">
        <el-option v-for="o in orgs" :key="o.id" :label="`${o.code} - ${o.name}`" :value="o.id" />
      </el-select>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { coreApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'

const props = defineProps({
  showOrg: { type: Boolean, default: true }
})

const ctx = useContextStore()

const companies = ref([])
const orgs = ref([])

const companyIdLocal = ref(ctx.companyId)
const orgIdLocal = ref(ctx.orgId)

async function loadCompanies() {
  companies.value = await coreApi.listCompanies()
}

async function loadOrgs(companyId) {
  if (!companyId) {
    orgs.value = []
    return
  }
  orgs.value = await coreApi.listOrgs(companyId)
}

async function refresh() {
  await loadCompanies()
  await loadOrgs(companyIdLocal.value)
}

function onCompanyChange(v) {
  ctx.setCompanyId(v)
  companyIdLocal.value = ctx.companyId
  orgIdLocal.value = null
}

function onOrgChange(v) {
  ctx.setOrgId(v)
  orgIdLocal.value = ctx.orgId
}

watch(
  () => ctx.companyId,
  async (id) => {
    companyIdLocal.value = id
    await loadOrgs(id)
  }
)

watch(
  () => ctx.orgId,
  (id) => {
    orgIdLocal.value = id
  }
)

onMounted(async () => {
  await refresh()
  if (companyIdLocal.value) await loadOrgs(companyIdLocal.value)
})
</script>
