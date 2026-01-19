<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 600">Sales Orders</div>
            <div style="color: #606266">Buat SO untuk customer, lalu lanjut Goods Shipment.</div>
          </div>
          <el-button type="primary" :disabled="!ctx.companyId" @click="openCreate">Create SO</el-button>
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
        <el-table-column label="Action" width="200">
          <template #default="scope">
            <div style="display: flex; gap: 8px">
              <el-button size="small" :disabled="!canEditRow(scope.row)" @click="openEdit(scope.row)">Edit</el-button>
              <el-button size="small" type="danger" plain :disabled="!canEditRow(scope.row)" @click="onDelete(scope.row)">Delete</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="createOpen" :title="editMode === 'edit' ? 'Edit Sales Order' : 'Create Sales Order'" width="860px">
      <el-form label-position="top">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px">
          <el-form-item label="Org">
            <el-input v-model="form.orgId" placeholder="Auto from context" :disabled="true" />
          </el-form-item>
          <el-form-item label="Order Type">
            <el-select v-model="form.orderType" placeholder="Select type" style="width: 100%">
              <el-option label="Domestic" value="DOMESTIC" />
              <el-option label="Export" value="EXPORT" />
            </el-select>
          </el-form-item>
          <el-form-item label="Customer">
            <el-select v-model="form.businessPartnerId" filterable placeholder="Select customer" style="width: 100%" :disabled="customers.length === 0">
              <el-option v-for="c in customers" :key="c.id" :label="c.name || c.code || String(c.id)" :value="c.id" />
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

        <div v-if="form.orderType === 'DOMESTIC'" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px">
          <el-form-item label="Buyer PO">
            <el-input v-model="form.buyerPo" placeholder="Buyer PO" />
          </el-form-item>
          <el-form-item label="Department">
            <el-select v-model="form.departmentId" filterable placeholder="Select department" style="width: 100%" :disabled="departments.length === 0">
              <el-option v-for="d in departments" :key="d.id" :label="d.name || String(d.id)" :value="d.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Employee">
            <el-select v-model="form.employeeId" filterable placeholder="Select employee" style="width: 100%" :disabled="employees.length === 0">
              <el-option v-for="e in employees" :key="e.id" :label="e.name || e.email || String(e.id)" :value="e.id" />
            </el-select>
          </el-form-item>

          <el-form-item label="In Charge">
            <el-input v-model="form.inCharge" placeholder="In Charge" />
          </el-form-item>
          <el-form-item label="Payment Condition">
            <el-input v-model="form.paymentCondition" placeholder="Payment Condition" />
          </el-form-item>
          <el-form-item label="Delivery Place">
            <el-input v-model="form.deliveryPlace" placeholder="Delivery Place" />
          </el-form-item>

          <el-form-item label="Forwarding Warehouse">
            <el-select v-model="form.forwardingWarehouseId" filterable placeholder="Select warehouse" style="width: 100%" :disabled="warehouses.length === 0">
              <el-option v-for="w in warehouses" :key="w.id" :label="`${w.code || ''} ${w.name || ''}`.trim() || String(w.id)" :value="w.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Memo" style="grid-column: span 2">
            <el-input v-model="form.memo" type="textarea" :rows="2" placeholder="Memo" />
          </el-form-item>
        </div>

        <div v-if="form.orderType === 'EXPORT'" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px">
          <el-form-item label="Buyer PO">
            <el-input v-model="form.buyerPo" placeholder="Buyer PO" />
          </el-form-item>
          <el-form-item label="Department">
            <el-select v-model="form.departmentId" filterable placeholder="Select department" style="width: 100%" :disabled="departments.length === 0">
              <el-option v-for="d in departments" :key="d.id" :label="d.name || String(d.id)" :value="d.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Employee">
            <el-select v-model="form.employeeId" filterable placeholder="Select employee" style="width: 100%" :disabled="employees.length === 0">
              <el-option v-for="e in employees" :key="e.id" :label="e.name || e.email || String(e.id)" :value="e.id" />
            </el-select>
          </el-form-item>

          <el-form-item label="In Charge">
            <el-input v-model="form.inCharge" placeholder="In Charge" />
          </el-form-item>
          <el-form-item label="Currency">
            <el-select v-model="form.currencyId" filterable placeholder="Select currency" style="width: 100%" :disabled="currencies.length === 0">
              <el-option v-for="c in currencies" :key="c.id" :label="`${c.code} - ${c.name}`" :value="c.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Exchange Rate">
            <el-input v-model="form.exchangeRate" />
          </el-form-item>

          <el-form-item label="Foreign Amount">
            <el-input v-model="form.foreignAmount" />
          </el-form-item>
          <el-form-item label="Payment Condition">
            <el-input v-model="form.paymentCondition" placeholder="Payment Condition" />
          </el-form-item>
          <el-form-item label="Delivery Place">
            <el-input v-model="form.deliveryPlace" placeholder="Delivery Place" />
          </el-form-item>

          <el-form-item label="Forwarding Warehouse">
            <el-select v-model="form.forwardingWarehouseId" filterable placeholder="Select warehouse" style="width: 100%" :disabled="warehouses.length === 0">
              <el-option v-for="w in warehouses" :key="w.id" :label="`${w.code || ''} ${w.name || ''}`.trim() || String(w.id)" :value="w.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Memo" style="grid-column: span 2">
            <el-input v-model="form.memo" type="textarea" :rows="2" placeholder="Memo" />
          </el-form-item>
        </div>

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

          <el-table-column v-if="form.orderType === 'DOMESTIC'" label="Unit Price" width="160">
            <template #default="scope">
              <el-input v-model="scope.row.unitPrice" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'DOMESTIC'" label="Description" min-width="220">
            <template #default="scope">
              <el-input v-model="scope.row.description" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'DOMESTIC'" label="Unit" width="120">
            <template #default="scope">
              <el-input v-model="scope.row.unit" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'DOMESTIC'" label="Size" width="120">
            <template #default="scope">
              <el-input v-model="scope.row.size" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'DOMESTIC'" label="National Size" width="140">
            <template #default="scope">
              <el-input v-model="scope.row.nationalSize" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'DOMESTIC'" label="Style" width="140">
            <template #default="scope">
              <el-input v-model="scope.row.style" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'DOMESTIC'" label="Cutting No" width="140">
            <template #default="scope">
              <el-input v-model="scope.row.cuttingNo" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'DOMESTIC'" label="Color" width="140">
            <template #default="scope">
              <el-input v-model="scope.row.color" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'DOMESTIC'" label="Destination" width="160">
            <template #default="scope">
              <el-input v-model="scope.row.destination" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'DOMESTIC'" label="Supply Amount" width="160">
            <template #default="scope">
              <el-input v-model="scope.row.supplyAmount" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'DOMESTIC'" label="VAT Amount" width="140">
            <template #default="scope">
              <el-input v-model="scope.row.vatAmount" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'DOMESTIC'" label="FOB" width="120">
            <template #default="scope">
              <el-input v-model="scope.row.fobPrice" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'DOMESTIC'" label="LDP" width="120">
            <template #default="scope">
              <el-input v-model="scope.row.ldpPrice" />
            </template>
          </el-table-column>

          <el-table-column v-if="form.orderType === 'EXPORT'" label="DP Price" width="140">
            <template #default="scope">
              <el-input v-model="scope.row.dpPrice" />
            </template>
          </el-table-column>

          <el-table-column v-if="form.orderType === 'EXPORT'" label="Delivery Date" width="150">
            <template #default="scope">
              <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'EXPORT'" label="Ship Mode" width="160">
            <template #default="scope">
              <el-input v-model="scope.row.shipMode" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'EXPORT'" label="Factory" width="160">
            <template #default="scope">
              <el-input v-model="scope.row.factory" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'EXPORT'" label="Remark" min-width="220">
            <template #default="scope">
              <el-input v-model="scope.row.remark" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'EXPORT'" label="File Path" min-width="240">
            <template #default="scope">
              <el-input v-model="scope.row.filePath" placeholder="/path/to/file" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT'" label="CMT Cost" width="140">
            <template #default="scope">
              <el-input v-model="scope.row.cmtCost" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT'" label="CM Cost" width="140">
            <template #default="scope">
              <el-input v-model="scope.row.cmCost" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT'" label="Fabric ETA" width="150">
            <template #default="scope">
              <el-date-picker v-model="scope.row.fabricEta" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT'" label="Fabric ETD" width="150">
            <template #default="scope">
              <el-date-picker v-model="scope.row.fabricEtd" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column label="" width="70">
            <template #default="scope">
              <el-button type="danger" plain size="small" @click="removeLine(scope.$index)">X</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-alert v-if="customers.length === 0" title="Customer belum ada. Buat Business Partner (customer) dulu di Master Data." type="warning" show-icon style="margin-top: 12px" />
        <el-alert v-if="products.length === 0" title="Product belum ada. Buat Product dulu di Master Data." type="warning" show-icon style="margin-top: 12px" />

        <div v-if="form.orderType === 'DOMESTIC'" style="margin-top: 14px">
          <div style="display: flex; align-items: center; justify-content: space-between; margin: 12px 0 6px">
            <div style="font-weight: 600">Delivery Schedules</div>
            <el-button size="small" @click="addSchedule">Add Schedule</el-button>
          </div>

          <el-table :data="form.deliverySchedules" size="small" style="width: 100%">
            <el-table-column label="Delivery Date" width="150">
              <template #default="scope">
                <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
              </template>
            </el-table-column>
            <el-table-column label="Ship Mode" width="160">
              <template #default="scope">
                <el-input v-model="scope.row.shipMode" />
              </template>
            </el-table-column>
            <el-table-column label="Factory" width="160">
              <template #default="scope">
                <el-input v-model="scope.row.factory" />
              </template>
            </el-table-column>
            <el-table-column label="Remark" min-width="220">
              <template #default="scope">
                <el-input v-model="scope.row.remark" />
              </template>
            </el-table-column>
            <el-table-column label="File Path" min-width="240">
              <template #default="scope">
                <el-input v-model="scope.row.filePath" placeholder="/path/to/file" />
              </template>
            </el-table-column>
            <el-table-column label="" width="70">
              <template #default="scope">
                <el-button type="danger" plain size="small" @click="removeSchedule(scope.$index)">X</el-button>
              </template>
            </el-table-column>
          </el-table>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { hrApi, masterDataApi, salesApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import CompanyOrgBar from '@/views/modules/common/CompanyOrgBar.vue'

const ctx = useContextStore()

const rows = ref([])
const loading = ref(false)

const customers = ref([])
const products = ref([])
const priceLists = ref([])
const priceListVersions = ref([])
const currencies = ref([])
const departments = ref([])
const employees = ref([])
const warehouses = ref([])

const createOpen = ref(false)
const saving = ref(false)
const editMode = ref('create')
const editingId = ref(null)

const form = reactive({
  orgId: null,
  orderType: 'DOMESTIC',
  businessPartnerId: null,
  priceListVersionId: null,
  buyerPo: '',
  departmentId: null,
  employeeId: null,
  inCharge: '',
  paymentCondition: '',
  deliveryPlace: '',
  forwardingWarehouseId: null,
  currencyId: null,
  exchangeRate: '',
  foreignAmount: '',
  memo: '',
  orderDate: '',
  lines: [],
  deliverySchedules: []
})

const canSave = computed(() => {
  if (!ctx.companyId) return false
  if (!form.orderType) return false
  if (!form.businessPartnerId) return false
  if (!form.priceListVersionId) return false
  if (!form.orderDate) return false
  if (!Array.isArray(form.lines) || form.lines.length === 0) return false
  return form.lines.every((l) => l.productId && String(l.qty).trim())
})

function addLine() {
  form.lines.push({
    productId: products.value[0]?.id || null,
    qty: '1',
    unitPrice: '',
    description: '',
    unit: '',
    size: '',
    nationalSize: '',
    style: '',
    cuttingNo: '',
    color: '',
    destination: '',
    supplyAmount: '',
    vatAmount: '',
    fobPrice: '',
    ldpPrice: '',
    dpPrice: '',
    cmtCost: '',
    cmCost: '',
    fabricEta: '',
    fabricEtd: '',
    deliveryDate: '',
    shipMode: '',
    factory: '',
    remark: '',
    filePath: ''
  })
}

function removeLine(idx) {
  form.lines.splice(idx, 1)
}

function addSchedule() {
  form.deliverySchedules.push({
    deliveryDate: '',
    shipMode: '',
    factory: '',
    remark: '',
    filePath: ''
  })
}

function removeSchedule(idx) {
  form.deliverySchedules.splice(idx, 1)
}

async function loadLookups() {
  if (!ctx.companyId) {
    customers.value = []
    products.value = []
    priceLists.value = []
    priceListVersions.value = []
    currencies.value = []
    departments.value = []
    employees.value = []
    warehouses.value = []
    return
  }

  const [bps, prods, pls, curs, depts, emps, whs] = await Promise.all([
    masterDataApi.listBusinessPartners(ctx.companyId),
    masterDataApi.listProducts(ctx.companyId),
    masterDataApi.listPriceLists(ctx.companyId),
    masterDataApi.listCurrencies(ctx.companyId),
    hrApi.listDepartments(),
    hrApi.listEmployees(),
    masterDataApi.listWarehouses(ctx.companyId)
  ])

  customers.value = (bps || []).filter((x) => x.type === 'CUSTOMER' || x.type === 'BOTH')
  products.value = prods || []
  priceLists.value = pls || []
  currencies.value = curs || []
  departments.value = depts || []
  employees.value = emps || []
  warehouses.value = whs || []

  const plId = priceLists.value[0]?.id
  priceListVersions.value = plId ? await masterDataApi.listPriceListVersions(plId) : []
}

async function load() {
  if (!ctx.companyId) {
    rows.value = []
    return
  }
  loading.value = true
  try {
    rows.value = await salesApi.listSalesOrders(ctx.companyId)
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editMode.value = 'create'
  editingId.value = null
  form.orgId = ctx.orgId
  form.orderType = 'DOMESTIC'
  form.businessPartnerId = customers.value[0]?.id || null
  form.priceListVersionId = priceListVersions.value[0]?.id || null
  form.buyerPo = ''
  form.departmentId = departments.value[0]?.id || null
  form.employeeId = employees.value[0]?.id || null
  form.inCharge = ''
  form.paymentCondition = ''
  form.deliveryPlace = ''
  form.forwardingWarehouseId = warehouses.value[0]?.id || null
  form.currencyId = currencies.value[0]?.id || null
  form.exchangeRate = ''
  form.foreignAmount = ''
  form.memo = ''
  form.orderDate = new Date().toISOString().slice(0, 10)
  form.lines = []
  form.deliverySchedules = []
  addLine()
  createOpen.value = true
}

function canEditRow(row) {
  if (!ctx.companyId) return false
  if (!row?.id) return false
  return row.status === 'DRAFTED'
}

function openEdit(row) {
  if (!row?.id) return
  editMode.value = 'edit'
  editingId.value = row.id

  form.orgId = row.orgId || ctx.orgId
  form.orderType = row.orderType || 'DOMESTIC'
  form.businessPartnerId = row.businessPartnerId || customers.value[0]?.id || null
  form.priceListVersionId = row.priceListVersionId || priceListVersions.value[0]?.id || null
  form.buyerPo = row.buyerPo || ''
  form.departmentId = row.departmentId || departments.value[0]?.id || null
  form.employeeId = row.employeeId || employees.value[0]?.id || null
  form.inCharge = row.inCharge || ''
  form.paymentCondition = row.paymentCondition || ''
  form.deliveryPlace = row.deliveryPlace || ''
  form.forwardingWarehouseId = row.forwardingWarehouseId || warehouses.value[0]?.id || null
  form.currencyId = row.currencyId || currencies.value[0]?.id || null
  form.exchangeRate = row.exchangeRate != null ? String(row.exchangeRate) : ''
  form.foreignAmount = row.foreignAmount != null ? String(row.foreignAmount) : ''
  form.memo = row.memo || ''
  form.orderDate = row.orderDate || new Date().toISOString().slice(0, 10)

  const lines = Array.isArray(row.lines) ? row.lines : []
  form.lines = lines.length
    ? lines.map((l) => ({
        productId: l.productId,
        qty: String(l.qty ?? ''),
        unitPrice: l.price != null ? String(l.price) : '',
        description: l.description || '',
        unit: l.unit || '',
        size: l.size || '',
        nationalSize: l.nationalSize || '',
        style: l.style || '',
        cuttingNo: l.cuttingNo || '',
        color: l.color || '',
        destination: l.destination || '',
        supplyAmount: l.supplyAmount != null ? String(l.supplyAmount) : '',
        vatAmount: l.vatAmount != null ? String(l.vatAmount) : '',
        fobPrice: l.fobPrice != null ? String(l.fobPrice) : '',
        ldpPrice: l.ldpPrice != null ? String(l.ldpPrice) : '',
        dpPrice: l.dpPrice != null ? String(l.dpPrice) : '',
        cmtCost: l.cmtCost != null ? String(l.cmtCost) : '',
        cmCost: l.cmCost != null ? String(l.cmCost) : '',
        fabricEta: l.fabricEta || '',
        fabricEtd: l.fabricEtd || '',
        deliveryDate: l.deliveryDate || '',
        shipMode: l.shipMode || '',
        factory: l.factory || '',
        remark: l.remark || '',
        filePath: l.filePath || ''
      }))
    : []

  const schedules = Array.isArray(row.deliverySchedules) ? row.deliverySchedules : []
  form.deliverySchedules =
    form.orderType === 'DOMESTIC'
      ? schedules.map((s) => ({
          deliveryDate: s.deliveryDate || '',
          shipMode: s.shipMode || '',
          factory: s.factory || '',
          remark: s.remark || '',
          filePath: s.filePath || ''
        }))
      : []

  if (!form.lines.length) addLine()
  createOpen.value = true
}

async function save() {
  saving.value = true
  try {
    const payload = {
      orgId: form.orgId || null,
      orderType: form.orderType || 'DOMESTIC',
      businessPartnerId: form.businessPartnerId,
      priceListVersionId: form.priceListVersionId,
      currencyId: form.orderType === 'EXPORT' ? form.currencyId || null : null,
      exchangeRate: form.orderType === 'EXPORT' && String(form.exchangeRate || '').trim() ? form.exchangeRate : null,
      foreignAmount: form.orderType === 'EXPORT' && String(form.foreignAmount || '').trim() ? form.foreignAmount : null,
      buyerPo: (form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT') ? (form.buyerPo || null) : null,
      departmentId: (form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT') ? form.departmentId || null : null,
      employeeId: (form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT') ? form.employeeId || null : null,
      inCharge: (form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT') ? (form.inCharge || null) : null,
      paymentCondition: (form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT') ? (form.paymentCondition || null) : null,
      deliveryPlace: (form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT') ? (form.deliveryPlace || null) : null,
      forwardingWarehouseId: (form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT') ? form.forwardingWarehouseId || null : null,
      memo: (form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT') ? (form.memo || null) : null,
      orderDate: form.orderDate,
      lines: form.lines.map((l) => ({
        productId: l.productId,
        qty: l.qty,
        unitPrice: form.orderType === 'DOMESTIC' && String(l.unitPrice || '').trim() ? l.unitPrice : null,
        description: form.orderType === 'DOMESTIC' ? (l.description || null) : null,
        unit: form.orderType === 'DOMESTIC' ? (l.unit || null) : null,
        size: form.orderType === 'DOMESTIC' ? (l.size || null) : null,
        nationalSize: form.orderType === 'DOMESTIC' ? (l.nationalSize || null) : null,
        style: form.orderType === 'DOMESTIC' ? (l.style || null) : null,
        cuttingNo: form.orderType === 'DOMESTIC' ? (l.cuttingNo || null) : null,
        color: form.orderType === 'DOMESTIC' ? (l.color || null) : null,
        destination: form.orderType === 'DOMESTIC' ? (l.destination || null) : null,
        supplyAmount: form.orderType === 'DOMESTIC' && String(l.supplyAmount || '').trim() ? l.supplyAmount : null,
        vatAmount: form.orderType === 'DOMESTIC' && String(l.vatAmount || '').trim() ? l.vatAmount : null,
        fobPrice: form.orderType === 'DOMESTIC' && String(l.fobPrice || '').trim() ? l.fobPrice : null,
        ldpPrice: form.orderType === 'DOMESTIC' && String(l.ldpPrice || '').trim() ? l.ldpPrice : null,
        dpPrice: form.orderType === 'EXPORT' && String(l.dpPrice || '').trim() ? l.dpPrice : null,
        cmtCost: (form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT') && String(l.cmtCost || '').trim() ? l.cmtCost : null,
        cmCost: (form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT') && String(l.cmCost || '').trim() ? l.cmCost : null,
        fabricEta: (form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT') && String(l.fabricEta || '').trim() ? l.fabricEta : null,
        fabricEtd: (form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT') && String(l.fabricEtd || '').trim() ? l.fabricEtd : null,
        deliveryDate: form.orderType === 'EXPORT' && String(l.deliveryDate || '').trim() ? l.deliveryDate : null,
        shipMode: form.orderType === 'EXPORT' && String(l.shipMode || '').trim() ? l.shipMode : null,
        factory: form.orderType === 'EXPORT' && String(l.factory || '').trim() ? l.factory : null,
        remark: form.orderType === 'EXPORT' && String(l.remark || '').trim() ? l.remark : null,
        filePath: form.orderType === 'EXPORT' && String(l.filePath || '').trim() ? l.filePath : null
      })),
      deliverySchedules:
        form.orderType === 'DOMESTIC'
          ? (form.deliverySchedules || []).map((s) => ({
              deliveryDate: String(s.deliveryDate || '').trim() ? s.deliveryDate : null,
              shipMode: String(s.shipMode || '').trim() ? s.shipMode : null,
              factory: String(s.factory || '').trim() ? s.factory : null,
              remark: String(s.remark || '').trim() ? s.remark : null,
              filePath: String(s.filePath || '').trim() ? s.filePath : null
            }))
          : null
    }

    if (editMode.value === 'edit' && editingId.value) {
      await salesApi.updateSalesOrder(ctx.companyId, editingId.value, payload)
      ElMessage.success('Sales Order updated')
    } else {
      await salesApi.createSalesOrder(ctx.companyId, payload)
      ElMessage.success('Sales Order created')
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
    await ElMessageBox.confirm(`Delete Sales Order "${row.documentNo}"?`, 'Confirm', {
      type: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })
    await salesApi.deleteSalesOrder(ctx.companyId, row.id)
    ElMessage.success('Sales Order deleted')
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

onMounted(async () => {
  await loadLookups()
  await load()
})
</script>
