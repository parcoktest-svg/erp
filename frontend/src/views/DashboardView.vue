<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px">
        <div>
          <div style="font-size: 18px; font-weight: 600">ERP Dashboard</div>
          <div style="color: #606266; margin-top: 6px">
            Mulai dari setup company, isi master data, lalu jalankan transaksi Purchase/Sales.
          </div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap">
          <el-tag v-if="ctx.companyId" type="success">Company: {{ ctx.companyId }}</el-tag>
          <el-tag v-if="ctx.orgId" type="info">Org: {{ ctx.orgId }}</el-tag>
        </div>
      </div>
    </el-card>

    <el-card>
      <div style="font-weight: 600; margin-bottom: 10px">Quick Start (Flow Bisnis)</div>
      <el-steps :active="0" finish-status="success">
        <el-step title="Core Setup" description="Create Company & Org" />
        <el-step title="Master Data" description="Create Products" />
        <el-step title="Purchase" description="Create Purchase Orders" />
        <el-step title="Sales" description="Create Sales Orders" />
      </el-steps>
    </el-card>

    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px">
      <el-card>
        <div style="font-weight: 600; margin-bottom: 6px">Core Setup</div>
        <div style="color: #606266; margin-bottom: 10px">Setup struktur dasar perusahaan.</div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap">
          <el-button type="primary" @click="go('/modules/core/companies')">Companies</el-button>
          <el-button @click="go('/modules/core/orgs')">Organizations</el-button>
        </div>
      </el-card>

      <el-card>
        <div style="font-weight: 600; margin-bottom: 6px">Master Data</div>
        <div style="color: #606266; margin-bottom: 10px">Siapkan produk untuk transaksi.</div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap">
          <el-button type="primary" @click="go('/modules/masterdata/products')">Products</el-button>
          <el-button plain @click="go('/modules/masterdata')">All Master Data</el-button>
        </div>
      </el-card>

      <el-card>
        <div style="font-weight: 600; margin-bottom: 6px">Purchase</div>
        <div style="color: #606266; margin-bottom: 10px">Buat PO untuk vendor.</div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap">
          <el-button type="primary" @click="go('/modules/purchase/purchase-orders')">Purchase Orders</el-button>
          <el-button plain @click="go('/modules/purchase')">Purchase Module</el-button>
        </div>
      </el-card>

      <el-card>
        <div style="font-weight: 600; margin-bottom: 6px">Sales</div>
        <div style="color: #606266; margin-bottom: 10px">Buat SO untuk customer.</div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap">
          <el-button type="primary" @click="go('/modules/sales/sales-orders')">Sales Orders</el-button>
          <el-button plain @click="go('/modules/sales')">Sales Module</el-button>
        </div>
      </el-card>
    </div>

    <el-card>
      <div style="font-weight: 600; margin-bottom: 6px">Advanced / Admin Tools</div>
      <div style="color: #606266; margin-bottom: 10px">Untuk testing endpoint atau troubleshooting.</div>
      <el-button @click="go('/tools/api-explorer')">API Explorer</el-button>
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useContextStore } from '@/stores/context'

const router = useRouter()
const ctx = useContextStore()

function go(path) {
  router.push(path)
}
</script>
