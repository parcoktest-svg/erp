<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-card>
      <div style="display: flex; flex-direction: column; gap: 10px">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 600">Price Lists</div>
            <div style="color: #606266">Buat price list dan version (valid from) untuk transaksi PO/SO.</div>
          </div>
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap">
            <el-button type="primary" :disabled="!ctx.companyId" @click="openCreate">Create Price List</el-button>
            <el-button :disabled="!selectedPriceListId" @click="openCreateVersion">Create Version</el-button>
          </div>
        </div>

        <CompanyOrgBar :show-org="false" />
      </div>
    </el-card>

    <el-card>
      <el-alert v-if="!ctx.companyId" title="Pilih company dulu." type="warning" show-icon style="margin-bottom: 12px" />

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px">
            <div style="font-weight: 600">Price Lists</div>
            <div style="display: flex; gap: 8px; align-items: center">
              <el-button size="small" :disabled="!selectedPriceListId" @click="openEdit">Edit</el-button>
              <el-button size="small" type="danger" plain :disabled="!selectedPriceListId" @click="onDelete">Delete</el-button>
            </div>
          </div>
          <el-table :data="priceLists" highlight-current-row @current-change="onSelectPriceList" v-loading="loading" style="width: 100%">
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="salesPriceList" label="Sales" width="100">
              <template #default="scope">
                <el-tag size="small" :type="scope.row.salesPriceList ? 'success' : 'info'">{{ scope.row.salesPriceList ? 'Yes' : 'No' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="active" label="Active" width="100">
              <template #default="scope">
                <el-tag size="small" :type="scope.row.active ? 'success' : 'info'">{{ scope.row.active ? 'Yes' : 'No' }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <div style="color: #909399; font-size: 12px; margin-top: 6px">
            Klik baris untuk melihat versions.
          </div>
        </div>

        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px">
            <div style="font-weight: 600">Versions</div>
            <el-tag v-if="selectedPriceList" type="info">{{ selectedPriceList.name }}</el-tag>
          </div>

          <el-empty v-if="!selectedPriceListId" description="Pilih Price List dulu" />
          <el-table v-else :data="versions" v-loading="versionsLoading" highlight-current-row @current-change="onSelectVersion" style="width: 100%">
            <el-table-column prop="validFrom" label="Valid From" width="160" />
            <el-table-column prop="active" label="Active" width="100">
              <template #default="scope">
                <el-tag size="small" :type="scope.row.active ? 'success' : 'info'">{{ scope.row.active ? 'Yes' : 'No' }}</el-tag>
              </template>
            </el-table-column>
          </el-table>

          <div style="margin-top: 12px">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px">
              <div style="font-weight: 600">Product Prices</div>
              <div style="display: flex; gap: 8px; align-items: center">
                <el-select v-model="selectedVersionId" placeholder="Select version" style="width: 220px" :disabled="versions.length === 0">
                  <el-option v-for="v in versions" :key="v.id" :label="v.validFrom" :value="v.id" />
                </el-select>
                <el-button size="small" :disabled="!selectedVersionId" @click="loadProductPrices">Refresh</el-button>
              </div>
            </div>

            <el-alert
              v-if="selectedVersionId && missingPriceCount > 0"
              :title="`${missingPriceCount} product belum punya harga di version ini. PO/SO akan gagal sebelum harganya diisi.`"
              type="warning"
              show-icon
              style="margin-bottom: 10px"
            />

            <el-table :data="priceRows" v-loading="pricesLoading" size="small" style="width: 100%">
              <el-table-column prop="code" label="Product" min-width="260">
                <template #default="scope">
                  {{ scope.row.code }} - {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column label="Price" width="220">
                <template #default="scope">
                  <el-input v-model="scope.row.price" placeholder="0" />
                </template>
              </el-table-column>
              <el-table-column label="" width="120">
                <template #default="scope">
                  <el-button size="small" type="primary" :loading="scope.row.saving" :disabled="!canSavePrice(scope.row)" @click="savePrice(scope.row)">Save</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog v-model="createOpen" title="Create Price List" width="640px">
      <el-form label-position="top">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
          <el-form-item label="Name">
            <el-input v-model="form.name" placeholder="e.g. Default Sales PL" />
          </el-form-item>
          <el-form-item label="Currency">
            <el-select v-model="form.currencyId" filterable placeholder="Select currency" style="width: 100%" :disabled="currencies.length === 0">
              <el-option v-for="c in currencies" :key="c.id" :label="`${c.code} - ${c.name}`" :value="c.id" />
            </el-select>
            <div v-if="currencies.length === 0" style="color: #909399; font-size: 12px; margin-top: 6px">
              Currency belum ada. Buat di menu Currencies.
            </div>
          </el-form-item>
        </div>

        <el-form-item>
          <el-checkbox v-model="form.salesPriceList">Sales Price List</el-checkbox>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="createOpen = false">Cancel</el-button>
        <el-button type="primary" :loading="saving" :disabled="!canSave" @click="save">Save</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="editOpen" title="Edit Price List" width="640px">
      <el-form label-position="top">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
          <el-form-item label="Name">
            <el-input v-model="editForm.name" placeholder="e.g. Default Sales PL" />
          </el-form-item>
          <el-form-item label="Currency">
            <el-select v-model="editForm.currencyId" filterable placeholder="Select currency" style="width: 100%" :disabled="currencies.length === 0">
              <el-option v-for="c in currencies" :key="c.id" :label="`${c.code} - ${c.name}`" :value="c.id" />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item>
          <el-checkbox v-model="editForm.salesPriceList">Sales Price List</el-checkbox>
        </el-form-item>

        <el-form-item label="Active">
          <el-switch v-model="editForm.active" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editOpen = false">Cancel</el-button>
        <el-button type="primary" :loading="editSaving" :disabled="!canEditSave" @click="saveEdit">Save</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="createVersionOpen" title="Create Price List Version" width="520px">
      <el-form label-position="top">
        <el-form-item label="Valid From">
          <el-date-picker v-model="versionForm.validFrom" type="date" value-format="YYYY-MM-DD" style="width: 220px" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="createVersionOpen = false">Cancel</el-button>
        <el-button type="primary" :loading="versionSaving" :disabled="!versionForm.validFrom || !selectedPriceListId" @click="saveVersion">Save</el-button>
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

const priceLists = ref([])
const versions = ref([])
const currencies = ref([])

const products = ref([])
const selectedVersionId = ref(null)
const pricesLoading = ref(false)
const priceRows = ref([])

const loading = ref(false)
const versionsLoading = ref(false)

const selectedPriceListId = ref(null)
const selectedPriceList = computed(() => (priceLists.value || []).find((x) => x.id === selectedPriceListId.value) || null)

const createOpen = ref(false)
const saving = ref(false)

const form = reactive({
  name: '',
  currencyId: null,
  salesPriceList: true
})

const canSave = computed(() => Boolean(ctx.companyId && form.name.trim() && form.currencyId))

const editOpen = ref(false)
const editSaving = ref(false)

const editForm = reactive({
  name: '',
  currencyId: null,
  salesPriceList: true,
  active: true
})

const canEditSave = computed(() => Boolean(ctx.companyId && selectedPriceListId.value && editForm.name.trim() && editForm.currencyId))

const createVersionOpen = ref(false)
const versionSaving = ref(false)
const versionForm = reactive({
  validFrom: ''
})

async function load() {
  if (!ctx.companyId) {
    priceLists.value = []
    currencies.value = []
    versions.value = []
    selectedPriceListId.value = null
    products.value = []
    selectedVersionId.value = null
    priceRows.value = []
    return
  }

  loading.value = true
  try {
    ;[priceLists.value, currencies.value, products.value] = await Promise.all([
      masterDataApi.listPriceLists(ctx.companyId),
      masterDataApi.listCurrencies(ctx.companyId),
      masterDataApi.listProducts(ctx.companyId)
    ])
  } finally {
    loading.value = false
  }

  if (priceLists.value.length && !selectedPriceListId.value) {
    selectedPriceListId.value = priceLists.value[0].id
    await loadVersions(selectedPriceListId.value)
  }
}

async function saveEdit() {
  editSaving.value = true
  try {
    const saved = await masterDataApi.updatePriceList(ctx.companyId, selectedPriceListId.value, {
      name: editForm.name,
      currencyId: editForm.currencyId,
      salesPriceList: Boolean(editForm.salesPriceList),
      active: Boolean(editForm.active)
    })
    ElMessage.success('Price List updated')
    editOpen.value = false
    await load()

    if (saved?.id) {
      selectedPriceListId.value = saved.id
      await loadVersions(saved.id)
    }
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    editSaving.value = false
  }
}

async function onDelete() {
  if (!selectedPriceList.value?.id) return
  try {
    await ElMessageBox.confirm(`Delete Price List "${selectedPriceList.value.name}"?`, 'Confirm', {
      type: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })
    await masterDataApi.deletePriceList(ctx.companyId, selectedPriceList.value.id)
    ElMessage.success('Price List deleted')
    selectedPriceListId.value = null
    await load()
  } catch (e) {
    if (e === 'cancel' || e === 'close') return
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  }
}

async function loadVersions(priceListId) {
  if (!priceListId) {
    versions.value = []
    selectedVersionId.value = null
    priceRows.value = []
    return
  }
  versionsLoading.value = true
  try {
    versions.value = await masterDataApi.listPriceListVersions(priceListId)
  } finally {
    versionsLoading.value = false
  }

  selectedVersionId.value = versions.value[0]?.id || null
  await loadProductPrices()
}

function onSelectVersion(row) {
  if (!row?.id) return
  selectedVersionId.value = row.id
  loadProductPrices()
}

const missingPriceCount = computed(() => (priceRows.value || []).filter((r) => !String(r.price ?? '').trim()).length)

async function loadProductPrices() {
  if (!selectedVersionId.value) {
    priceRows.value = []
    return
  }
  pricesLoading.value = true
  try {
    const existing = await masterDataApi.listProductPrices(selectedVersionId.value)

    const byProductId = new Map((existing || []).map((pp) => [pp.productId, pp]))

    priceRows.value = (products.value || []).map((p) => {
      const found = byProductId.get(p.id)
      return {
        productId: p.id,
        code: p.code,
        name: p.name,
        price: found?.price ?? '',
        saving: false
      }
    })
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed to load product prices')
  } finally {
    pricesLoading.value = false
  }
}

function canSavePrice(row) {
  if (!selectedVersionId.value) return false
  if (!row?.productId) return false
  const v = String(row.price ?? '').trim()
  if (!v) return false
  return !Number.isNaN(Number(v))
}

async function savePrice(row) {
  row.saving = true
  try {
    await masterDataApi.upsertProductPrice(selectedVersionId.value, {
      productId: row.productId,
      price: row.price
    })
    ElMessage.success('Price saved')
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    row.saving = false
  }
}

function onSelectPriceList(row) {
  if (!row?.id) return
  selectedPriceListId.value = row.id
  loadVersions(row.id)
}

function openCreate() {
  form.name = ''
  form.currencyId = currencies.value[0]?.id || null
  form.salesPriceList = true
  createOpen.value = true
}

function openEdit() {
  if (!selectedPriceList.value) return
  editForm.name = selectedPriceList.value.name || ''
  editForm.currencyId = selectedPriceList.value.currencyId || currencies.value[0]?.id || null
  editForm.salesPriceList = Boolean(selectedPriceList.value.salesPriceList)
  editForm.active = Boolean(selectedPriceList.value.active)
  editOpen.value = true
}

async function save() {
  saving.value = true
  try {
    const saved = await masterDataApi.createPriceList(ctx.companyId, {
      name: form.name,
      currencyId: form.currencyId,
      salesPriceList: form.salesPriceList
    })
    ElMessage.success('Price List created')
    createOpen.value = false
    await load()

    if (saved?.id) {
      selectedPriceListId.value = saved.id
      await loadVersions(saved.id)
    }
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    saving.value = false
  }
}

function openCreateVersion() {
  versionForm.validFrom = new Date().toISOString().slice(0, 10)
  createVersionOpen.value = true
}

async function saveVersion() {
  versionSaving.value = true
  try {
    await masterDataApi.createPriceListVersion(selectedPriceListId.value, {
      validFrom: versionForm.validFrom
    })
    ElMessage.success('Price List Version created')
    createVersionOpen.value = false
    await loadVersions(selectedPriceListId.value)
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || e?.message || 'Failed')
  } finally {
    versionSaving.value = false
  }
}

watch(
  () => ctx.companyId,
  () => load()
)

onMounted(load)
</script>
