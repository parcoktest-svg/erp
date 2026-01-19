<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 600">Purchase Orders</div>
            <div style="color: #606266">Buat PO untuk vendor, lalu lanjut Goods Receipt.</div>
          </div>
          <el-button type="primary" :disabled="!ctx.companyId" @click="openCreate">Create PO</el-button>
        </div>

        <CompanyOrgBar />
      </div>
    </el-card>

    <el-card>
      <el-alert v-if="!ctx.companyId" title="Pilih company dulu." type="warning" show-icon style="margin-bottom: 12px" />

      <el-table :data="rows" style="width: 100%" v-loading="loading">
        <el-table-column prop="documentNo" label="Document No" width="180" />
        <el-table-column prop="status" label="Status" width="140" />
        <el-table-column prop="orderDate" label="Order Date" width="140" />
        <el-table-column prop="grandTotal" label="Grand Total" width="140" />
        <el-table-column label="Action" width="260">
          <template #default="scope">
            <el-button size="small" type="success" :disabled="!canApproveRow(scope.row)" @click="onApprove(scope.row)">Approve</el-button>
            <el-button size="small" type="primary" plain :disabled="!canReceiptRow(scope.row)" @click="openGoodsReceipt(scope.row)">
              Goods Receipt
            </el-button>
            <el-button size="small" @click="openEdit(scope.row)" :disabled="!canEditRow(scope.row)">Edit</el-button>
            <el-button type="danger" size="small" plain @click="onDelete(scope.row)" :disabled="!canEditRow(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="createOpen" :title="dialogTitle" width="860px">
      <el-form label-position="top">
        <el-alert
          v-if="ctx.companyId && (priceLists.length === 0 || priceListVersions.length === 0 || !form.priceListVersionId)"
          title="Price List Version belum dipilih/tersedia. Buat Price List & Version dulu di Master Data, lalu pilih versinya."
          type="warning"
          show-icon
          style="margin-bottom: 12px"
        />

        <el-alert
          v-if="missingPriceProductLabels.length"
          :title="`Harga belum di-setup untuk: ${missingPriceProductLabels.join(', ')}. Isi Product Prices dulu di Master Data > Price Lists.`"
          type="warning"
          show-icon
          style="margin-bottom: 12px"
        />

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px">
          <el-form-item label="Org">
            <el-input v-model="form.orgId" placeholder="Auto from context" :disabled="true" />
          </el-form-item>
          <el-form-item label="Vendor">
            <el-select v-model="form.vendorId" filterable placeholder="Select vendor" style="width: 100%" :disabled="vendors.length === 0">
              <el-option v-for="v in vendors" :key="v.id" :label="v.name || v.code || String(v.id)" :value="v.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Price List Version">
            <el-select v-model="form.priceListVersionId" filterable placeholder="Select version" style="width: 100%" :disabled="priceListVersions.length === 0">
              <el-option v-for="p in priceListVersions" :key="p.id" :label="p.name || p.code || String(p.id)" :value="p.id" />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="Order Date">
          <el-date-picker v-model="form.orderDate" type="date" value-format="YYYY-MM-DD" style="width: 220px" />
        </el-form-item>

        <div style="display: flex; align-items: center; justify-content: space-between; margin: 12px 0 6px">
          <div style="font-weight: 600">Lines</div>
          <el-button size="small" @click="addLine">Add Line</el-button>
        </div>

        <el-table :data="form.lines" size="small" style="width: 100%">
          <el-table-column label="Product" min-width="320">
            <template #default="scope">
              <el-select v-model="scope.row.productId" filterable placeholder="Select product" style="width: 100%" :disabled="products.length === 0">
                <el-option v-for="p in products" :key="p.id" :label="`${p.code} - ${p.name}`" :value="p.id" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="Qty" width="180">
            <template #default="scope">
              <el-input v-model="scope.row.qty" />
            </template>
          </el-table-column>
          <el-table-column label="" width="70">
            <template #default="scope">
              <el-button type="danger" plain size="small" @click="removeLine(scope.$index)">X</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-alert v-if="vendors.length === 0" title="Vendor belum ada. Buat Business Partner (vendor) dulu di Master Data." type="warning" show-icon style="margin-top: 12px" />
        <el-alert v-if="products.length === 0" title="Product belum ada. Buat Product dulu di Master Data." type="warning" show-icon style="margin-top: 12px" />
      </el-form>

      <template #footer>
        <el-button @click="createOpen = false">Cancel</el-button>
        <el-button type="primary" :loading="saving" :disabled="!canSave" @click="save">Save</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="receiptOpen" title="Goods Receipt" width="980px">
      <el-form label-position="top">
        <el-alert v-if="!ctx.companyId" title="Pilih company dulu." type="warning" show-icon style="margin-bottom: 12px" />

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px">
          <el-form-item label="To Locator">
            <el-select v-model="receiptForm.toLocatorId" filterable placeholder="Select locator" style="width: 100%" :disabled="locators.length === 0">
              <el-option v-for="l in locators" :key="l.id" :label="`${l.code} - ${l.name}`" :value="l.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Receipt Date">
            <el-date-picker v-model="receiptForm.movementDate" type="date" value-format="YYYY-MM-DD" style="width: 220px" />
          </el-form-item>
          <el-form-item label="Description">
            <el-input v-model="receiptForm.description" placeholder="optional" />
          </el-form-item>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; margin: 12px 0 6px">
          <div style="font-weight: 600">Lines</div>
        </div>

        <el-table :data="receiptForm.lines" size="small" style="width: 100%">
          <el-table-column label="Product" min-width="320">
            <template #default="scope">
              <span>{{ productLabelById(scope.row.productId) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Ordered" width="140">
            <template #default="scope">
              <span>{{ scope.row.orderedQty }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Received" width="140">
            <template #default="scope">
              <span>{{ scope.row.receivedQty }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Receive Qty" width="180">
            <template #default="scope">
              <el-input v-model="scope.row.qty" placeholder="e.g. 1" />
            </template>
          </el-table-column>
        </el-table>

        <el-alert v-if="locators.length === 0" title="Locator belum ada. Buat Locator dulu di Inventory > Locators." type="warning" show-icon style="margin-top: 12px" />
      </el-form>

      <template #footer>
        <el-button @click="receiptOpen = false">Cancel</el-button>
        <el-button type="primary" :loading="receiptSaving" :disabled="!canReceiptSave" @click="submitGoodsReceipt">Submit</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { inventoryApi, masterDataApi, purchaseApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import CompanyOrgBar from '@/views/modules/common/CompanyOrgBar.vue'

const ctx = useContextStore()

const rows = ref([])
const loading = ref(false)

const vendors = ref([])
const products = ref([])
const priceLists = ref([])
const priceListVersions = ref([])
const productPrices = ref([])

const locators = ref([])

const createOpen = ref(false)
const saving = ref(false)

const receiptOpen = ref(false)
const receiptSaving = ref(false)
const receiptPoId = ref(null)

const editMode = ref('create')
const editingId = ref(null)

const dialogTitle = computed(() => (editMode.value === 'edit' ? 'Edit Purchase Order' : 'Create Purchase Order'))

const form = reactive({
  orgId: null,
  vendorId: null,
  priceListVersionId: null,
  orderDate: '',
  lines: []
})

const receiptForm = reactive({
  toLocatorId: null,
  movementDate: '',
  description: '',
  lines: []
})

const canReceiptSave = computed(() => {
  if (!ctx.companyId) return false
  if (!receiptPoId.value) return false
  if (!receiptForm.toLocatorId) return false
  if (!receiptForm.movementDate) return false
  if (!Array.isArray(receiptForm.lines) || receiptForm.lines.length === 0) return false
  return receiptForm.lines.some((l) => {
    const qty = Number(l.qty)
    if (!Number.isFinite(qty) || qty <= 0) return false
    const remaining = Math.max(0, Number(l.orderedQty ?? 0) - Number(l.receivedQty ?? 0))
    return qty <= remaining
  })
})

const canSave = computed(() => {
  if (!ctx.companyId) return false
  if (!form.vendorId) return false
  if (!form.priceListVersionId) return false
  if (!form.orderDate) return false
  if (!Array.isArray(form.lines) || form.lines.length === 0) return false
  if (!form.lines.every((l) => l.productId && String(l.qty).trim())) return false
  // ensure price exists for each selected product
  const priced = new Set((productPrices.value || []).map((pp) => pp.productId))
  return form.lines.every((l) => priced.has(l.productId))
})

const missingPriceProductLabels = computed(() => {
  if (!createOpen.value) return []
  if (!form.priceListVersionId) return []
  const priced = new Set((productPrices.value || []).map((pp) => pp.productId))
  const uniq = new Map()
  for (const l of form.lines || []) {
    if (!l?.productId) continue
    if (priced.has(l.productId)) continue
    const p = (products.value || []).find((x) => x.id === l.productId)
    const label = p ? `${p.code}` : String(l.productId)
    uniq.set(l.productId, label)
  }
  return Array.from(uniq.values())
})

function addLine() {
  form.lines.push({ productId: products.value[0]?.id || null, qty: '1' })
}

function removeLine(idx) {
  form.lines.splice(idx, 1)
}

async function loadLookups() {
  if (!ctx.companyId) {
    vendors.value = []
    products.value = []
    priceLists.value = []
    priceListVersions.value = []
    productPrices.value = []
    locators.value = []
    return
  }

  const [bps, prods, pls] = await Promise.all([
    masterDataApi.listBusinessPartners(ctx.companyId),
    masterDataApi.listProducts(ctx.companyId),
    masterDataApi.listPriceLists(ctx.companyId)
  ])

  vendors.value = (bps || []).filter((x) => x.type === 'VENDOR' || x.type === 'BOTH')
  products.value = prods || []
  priceLists.value = pls || []

  const plId = priceLists.value[0]?.id
  priceListVersions.value = plId ? await masterDataApi.listPriceListVersions(plId) : []

  const plvId = priceListVersions.value[0]?.id
  productPrices.value = plvId ? await masterDataApi.listProductPrices(plvId) : []

  locators.value = await inventoryApi.listLocators(ctx.companyId)
}

async function load() {
  if (!ctx.companyId) {
    rows.value = []
    return
  }
  loading.value = true
  try {
    rows.value = await purchaseApi.listPurchaseOrders(ctx.companyId)
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editMode.value = 'create'
  editingId.value = null
  form.orgId = ctx.orgId
  form.vendorId = vendors.value[0]?.id || null
  form.priceListVersionId = priceListVersions.value[0]?.id || null
  form.orderDate = new Date().toISOString().slice(0, 10)
  form.lines = []
  addLine()
  createOpen.value = true
}

async function openEdit(row) {
  if (!row?.id) return
  editMode.value = 'edit'
  editingId.value = row.id

  form.orgId = row.orgId || null
  form.vendorId = row.vendorId || null
  form.priceListVersionId = row.priceListVersionId || null
  form.orderDate = row.orderDate || new Date().toISOString().slice(0, 10)
  form.lines = (row.lines || []).map((l) => ({
    productId: l.productId,
    qty: String(l.qty ?? '')
  }))
  if (form.lines.length === 0) addLine()

  productPrices.value = form.priceListVersionId ? await masterDataApi.listProductPrices(form.priceListVersionId) : []
  createOpen.value = true
}

function canEditRow(row) {
  return !!ctx.companyId && row?.status === 'DRAFTED'
}

function canApproveRow(row) {
  return !!ctx.companyId && row?.status === 'DRAFTED'
}

function canReceiptRow(row) {
  return !!ctx.companyId && (row?.status === 'APPROVED' || row?.status === 'PARTIALLY_COMPLETED')
}

function productLabelById(productId) {
  const p = (products.value || []).find((x) => x.id === productId)
  return p ? `${p.code} - ${p.name}` : String(productId ?? '')
}

function openGoodsReceipt(row) {
  if (!row?.id) return
  receiptPoId.value = row.id
  receiptForm.toLocatorId = locators.value[0]?.id || null
  receiptForm.movementDate = new Date().toISOString().slice(0, 10)
  receiptForm.description = `Goods Receipt for PO ${row.documentNo}`
  receiptForm.lines = (row.lines || []).map((l) => {
    const ordered = Number(l.qty ?? 0)
    const received = Number(l.receivedQty ?? 0)
    const remaining = Math.max(0, ordered - received)
    return {
      purchaseOrderLineId: l.id,
      productId: l.productId,
      orderedQty: ordered,
      receivedQty: received,
      qty: remaining > 0 ? String(remaining) : '0'
    }
  })
  receiptOpen.value = true
}

async function submitGoodsReceipt() {
  if (!receiptPoId.value) return
  receiptSaving.value = true
  try {
    const invalid = (receiptForm.lines || []).find((l) => {
      const qty = Number(l.qty)
      if (!Number.isFinite(qty) || qty <= 0) return false
      const remaining = Math.max(0, Number(l.orderedQty ?? 0) - Number(l.receivedQty ?? 0))
      return qty > remaining
    })
    if (invalid) {
      const remaining = Math.max(0, Number(invalid.orderedQty ?? 0) - Number(invalid.receivedQty ?? 0))
      throw new Error(`Receive qty exceeds remaining qty (remaining=${remaining})`)
    }

    const lines = (receiptForm.lines || [])
      .map((l) => ({
        purchaseOrderLineId: l.purchaseOrderLineId,
        qty: l.qty
      }))
      .filter((l) => {
        const qty = Number(l.qty)
        return Number.isFinite(qty) && qty > 0
      })

    await purchaseApi.createGoodsReceipt(ctx.companyId, receiptPoId.value, {
      toLocatorId: receiptForm.toLocatorId,
      movementDate: receiptForm.movementDate,
      description: receiptForm.description,
      lines
    })

    ElMessage.success('Goods Receipt created')
    receiptOpen.value = false
    await load()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    receiptSaving.value = false
  }
}

async function onApprove(row) {
  if (!row?.id) return
  try {
    await ElMessageBox.confirm(`Approve Purchase Order "${row.documentNo}"?`, 'Confirm', {
      type: 'warning',
      confirmButtonText: 'Approve',
      cancelButtonText: 'Cancel'
    })
    await purchaseApi.approvePurchaseOrder(ctx.companyId, row.id)
    ElMessage.success('Purchase Order approved')
    await load()
  } catch (e) {
    if (e === 'cancel' || e === 'close') return
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  }
}

watch(
  () => form.priceListVersionId,
  async (v) => {
    if (!createOpen.value) return
    productPrices.value = v ? await masterDataApi.listProductPrices(v) : []
  }
)

async function save() {
  saving.value = true
  try {
    const payload = {
      orgId: form.orgId || null,
      vendorId: form.vendorId,
      priceListVersionId: form.priceListVersionId,
      orderDate: form.orderDate,
      lines: form.lines.map((l) => ({
        productId: l.productId,
        qty: l.qty
      }))
    }

    if (editMode.value === 'edit' && editingId.value) {
      await purchaseApi.updatePurchaseOrder(ctx.companyId, editingId.value, payload)
      ElMessage.success('Purchase Order updated')
    } else {
      await purchaseApi.createPurchaseOrder(ctx.companyId, payload)
      ElMessage.success('Purchase Order created')
    }
    createOpen.value = false
    await load()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    saving.value = false
  }
}

async function onDelete(row) {
  if (!row?.id) return
  try {
    await ElMessageBox.confirm(`Delete Purchase Order "${row.documentNo}"?`, 'Confirm', {
      type: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })
    await purchaseApi.deletePurchaseOrder(ctx.companyId, row.id)
    ElMessage.success('Purchase Order deleted')
    await load()
  } catch (e) {
    if (e === 'cancel' || e === 'close') return
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  }
}

watch(
  () => ctx.companyId,
  async () => {
    await loadLookups()
    await load()
  }
)

watch(
  () => ctx.orgId,
  () => {
    form.orgId = ctx.orgId
  }
)

watch(
  () => priceListVersions.value,
  (v) => {
    if (!createOpen.value) return
    if (form.priceListVersionId) return
    if (Array.isArray(v) && v.length > 0) form.priceListVersionId = v[0].id
  }
)

onMounted(async () => {
  await loadLookups()
  await load()
})
</script>
