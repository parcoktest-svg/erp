import { http } from './http'

export const authApi = {
  signup: (payload) => http.post('/auth/signup', payload).then((r) => r.data),
  signin: (payload) => http.post('/auth/signin', payload).then((r) => r.data)
}

export const adminApi = {
  createUser: (payload) => http.post('/admin/create-user-management', payload).then((r) => r.data),
  updateUser: (id, payload) => http.put(`/admin/update-user/${id}`, payload).then((r) => r.data),
  resetPassword: (id, payload) => http.put(`/admin/reset-password/${id}`, payload).then((r) => r.data),
  changeStatus: (id) => http.put(`/admin/change-status/${id}`).then((r) => r.data),
  deleteUser: (id) => http.delete(`/admin/delete-user/${id}`).then((r) => r.data),
  listUsers: (params) => http.get('/admin/all-users', { params }).then((r) => r.data)
}

export const genericApi = {
  request: ({ method, url, params, data, headers }) =>
    http
      .request({ method, url, params, data, headers })
      .then((r) => ({ status: r.status, data: r.data, headers: r.headers }))
}

export const coreApi = {
  listCompanies: () => http.get('/api/core/companies').then((r) => r.data),
  createCompany: (payload) => http.post('/api/core/companies', payload).then((r) => r.data),
  listOrgs: (companyId) => http.get(`/api/core/companies/${companyId}/orgs`).then((r) => r.data),
  createOrg: (companyId, payload) => http.post(`/api/core/companies/${companyId}/orgs`, payload).then((r) => r.data)
}

export const masterDataApi = {
  listUoms: (companyId) => http.get(`/api/masterdata/companies/${companyId}/uoms`).then((r) => r.data),
  createUom: (companyId, payload) => http.post(`/api/masterdata/companies/${companyId}/uoms`, payload).then((r) => r.data),
  updateUom: (companyId, uomId, payload) => http.put(`/api/masterdata/companies/${companyId}/uoms/${uomId}`, payload).then((r) => r.data),
  deleteUom: (companyId, uomId) => http.delete(`/api/masterdata/companies/${companyId}/uoms/${uomId}`).then((r) => r.data),

  listCurrencies: (companyId) => http.get(`/api/masterdata/companies/${companyId}/currencies`).then((r) => r.data),
  createCurrency: (companyId, payload) => http.post(`/api/masterdata/companies/${companyId}/currencies`, payload).then((r) => r.data),
  updateCurrency: (companyId, currencyId, payload) =>
    http.put(`/api/masterdata/companies/${companyId}/currencies/${currencyId}`, payload).then((r) => r.data),
  deleteCurrency: (companyId, currencyId) => http.delete(`/api/masterdata/companies/${companyId}/currencies/${currencyId}`).then((r) => r.data),

  listProducts: (companyId) => http.get(`/api/masterdata/companies/${companyId}/products`).then((r) => r.data),
  createProduct: (companyId, payload) => http.post(`/api/masterdata/companies/${companyId}/products`, payload).then((r) => r.data),
  updateProduct: (companyId, productId, payload) => http.put(`/api/masterdata/companies/${companyId}/products/${productId}`, payload).then((r) => r.data),
  deleteProduct: (companyId, productId) => http.delete(`/api/masterdata/companies/${companyId}/products/${productId}`).then((r) => r.data),

  listWarehouses: (companyId) => http.get(`/api/masterdata/companies/${companyId}/warehouses`).then((r) => r.data),
  createWarehouse: (companyId, payload) => http.post(`/api/masterdata/companies/${companyId}/warehouses`, payload).then((r) => r.data),
  updateWarehouse: (companyId, warehouseId, payload) =>
    http.put(`/api/masterdata/companies/${companyId}/warehouses/${warehouseId}`, payload).then((r) => r.data),
  deleteWarehouse: (companyId, warehouseId) => http.delete(`/api/masterdata/companies/${companyId}/warehouses/${warehouseId}`).then((r) => r.data),

  listBusinessPartners: (companyId) => http.get(`/api/masterdata/companies/${companyId}/business-partners`).then((r) => r.data),
  createBusinessPartner: (companyId, payload) => http.post(`/api/masterdata/companies/${companyId}/business-partners`, payload).then((r) => r.data),
  updateBusinessPartner: (companyId, businessPartnerId, payload) =>
    http.put(`/api/masterdata/companies/${companyId}/business-partners/${businessPartnerId}`, payload).then((r) => r.data),
  deleteBusinessPartner: (companyId, businessPartnerId) =>
    http.delete(`/api/masterdata/companies/${companyId}/business-partners/${businessPartnerId}`).then((r) => r.data),

  listPriceLists: (companyId) => http.get(`/api/masterdata/companies/${companyId}/price-lists`).then((r) => r.data),
  createPriceList: (companyId, payload) => http.post(`/api/masterdata/companies/${companyId}/price-lists`, payload).then((r) => r.data),
  updatePriceList: (companyId, priceListId, payload) => http.put(`/api/masterdata/companies/${companyId}/price-lists/${priceListId}`, payload).then((r) => r.data),
  deletePriceList: (companyId, priceListId) => http.delete(`/api/masterdata/companies/${companyId}/price-lists/${priceListId}`).then((r) => r.data),

  listPriceListVersions: (priceListId) => http.get(`/api/masterdata/price-lists/${priceListId}/versions`).then((r) => r.data),
  createPriceListVersion: (priceListId, payload) => http.post(`/api/masterdata/price-lists/${priceListId}/versions`, payload).then((r) => r.data),

  listProductPrices: (priceListVersionId) =>
    http.get(`/api/masterdata/price-list-versions/${priceListVersionId}/product-prices`).then((r) => r.data),
  upsertProductPrice: (priceListVersionId, payload) =>
    http.post(`/api/masterdata/price-list-versions/${priceListVersionId}/product-prices`, payload).then((r) => r.data)
}

export const inventoryApi = {
  listLocators: (companyId, params) => http.get(`/api/inventory/companies/${companyId}/locators`, { params }).then((r) => r.data),
  createLocator: (companyId, payload) => http.post(`/api/inventory/companies/${companyId}/locators`, payload).then((r) => r.data),

  getOnHand: (companyId, params) => http.get(`/api/inventory/companies/${companyId}/onhand`, { params }).then((r) => r.data),
  getOnHandByLocator: (companyId, params) =>
    http.get(`/api/inventory/companies/${companyId}/onhand/by-locator`, { params }).then((r) => r.data),

  listMovements: (companyId) => http.get(`/api/inventory/companies/${companyId}/movements`).then((r) => r.data),
  createMovement: (companyId, payload) => http.post(`/api/inventory/companies/${companyId}/movements`, payload).then((r) => r.data),

  listAdjustments: (companyId) => http.get(`/api/inventory/companies/${companyId}/adjustments`).then((r) => r.data),
  createAdjustment: (companyId, payload) => http.post(`/api/inventory/companies/${companyId}/adjustments`, payload).then((r) => r.data),
  updateAdjustment: (companyId, adjustmentId, payload) =>
    http.put(`/api/inventory/companies/${companyId}/adjustments/${adjustmentId}`, payload).then((r) => r.data),
  deleteAdjustment: (companyId, adjustmentId) =>
    http.delete(`/api/inventory/companies/${companyId}/adjustments/${adjustmentId}`).then((r) => r.data),
  completeAdjustment: (companyId, adjustmentId) =>
    http.post(`/api/inventory/companies/${companyId}/adjustments/${adjustmentId}/complete`).then((r) => r.data),
  voidAdjustment: (companyId, adjustmentId) => http.post(`/api/inventory/companies/${companyId}/adjustments/${adjustmentId}/void`).then((r) => r.data)
}

export const purchaseApi = {
  listPurchaseOrders: (companyId) => http.get(`/api/purchase/companies/${companyId}/purchase-orders`).then((r) => r.data),
  createPurchaseOrder: (companyId, payload) => http.post(`/api/purchase/companies/${companyId}/purchase-orders`, payload).then((r) => r.data),
  updatePurchaseOrder: (companyId, purchaseOrderId, payload) =>
    http.put(`/api/purchase/companies/${companyId}/purchase-orders/${purchaseOrderId}`, payload).then((r) => r.data),
  deletePurchaseOrder: (companyId, purchaseOrderId) =>
    http.delete(`/api/purchase/companies/${companyId}/purchase-orders/${purchaseOrderId}`).then((r) => r.data),
  approvePurchaseOrder: (companyId, purchaseOrderId) =>
    http.post(`/api/purchase/companies/${companyId}/purchase-orders/${purchaseOrderId}/approve`).then((r) => r.data),
  createGoodsReceipt: (companyId, purchaseOrderId, payload) =>
    http.post(`/api/purchase/companies/${companyId}/purchase-orders/${purchaseOrderId}/goods-receipts`, payload).then((r) => r.data)
}

export const salesApi = {
  listSalesOrders: (companyId) => http.get(`/api/sales/companies/${companyId}/sales-orders`).then((r) => r.data),
  createSalesOrder: (companyId, payload) => http.post(`/api/sales/companies/${companyId}/sales-orders`, payload).then((r) => r.data),
  updateSalesOrder: (companyId, salesOrderId, payload) =>
    http.put(`/api/sales/companies/${companyId}/sales-orders/${salesOrderId}`, payload).then((r) => r.data),
  deleteSalesOrder: (companyId, salesOrderId) => http.delete(`/api/sales/companies/${companyId}/sales-orders/${salesOrderId}`).then((r) => r.data)
}

export const manufacturingApi = {
  listBoms: (companyId) => http.get(`/api/manufacturing/companies/${companyId}/boms`).then((r) => r.data),
  getBom: (companyId, bomId) => http.get(`/api/manufacturing/companies/${companyId}/boms/${bomId}`).then((r) => r.data),
  createBom: (companyId, payload) => http.post(`/api/manufacturing/companies/${companyId}/boms`, payload).then((r) => r.data),
  updateBom: (companyId, bomId, payload) => http.put(`/api/manufacturing/companies/${companyId}/boms/${bomId}`, payload).then((r) => r.data),
  deleteBom: (companyId, bomId) => http.delete(`/api/manufacturing/companies/${companyId}/boms/${bomId}`).then((r) => r.data),

  listWorkOrders: (companyId) => http.get(`/api/manufacturing/companies/${companyId}/work-orders`).then((r) => r.data),
  getWorkOrder: (companyId, workOrderId) =>
    http.get(`/api/manufacturing/companies/${companyId}/work-orders/${workOrderId}`).then((r) => r.data),
  createWorkOrder: (companyId, payload) => http.post(`/api/manufacturing/companies/${companyId}/work-orders`, payload).then((r) => r.data),
  updateWorkOrder: (companyId, workOrderId, payload) =>
    http.put(`/api/manufacturing/companies/${companyId}/work-orders/${workOrderId}`, payload).then((r) => r.data),
  deleteWorkOrder: (companyId, workOrderId) =>
    http.delete(`/api/manufacturing/companies/${companyId}/work-orders/${workOrderId}`).then((r) => r.data),
  completeWorkOrder: (companyId, workOrderId, payload) =>
    http.post(`/api/manufacturing/companies/${companyId}/work-orders/${workOrderId}/complete`, payload).then((r) => r.data),
  voidWorkOrder: (companyId, workOrderId, payload) =>
    http.post(`/api/manufacturing/companies/${companyId}/work-orders/${workOrderId}/void`, payload).then((r) => r.data),

  wipReport: (companyId) => http.get(`/api/manufacturing/companies/${companyId}/reports/wip`).then((r) => r.data),
  productionCost: (companyId, params) =>
    http.get(`/api/manufacturing/companies/${companyId}/reports/production-cost`, { params }).then((r) => r.data)
}

export const financeApi = {
  listGlAccounts: (companyId) => http.get(`/api/finance/companies/${companyId}/gl-accounts`).then((r) => r.data),
  createGlAccount: (companyId, payload) => http.post(`/api/finance/companies/${companyId}/gl-accounts`, payload).then((r) => r.data),
  seedDefaultGlAccounts: (companyId) => http.post(`/api/finance/companies/${companyId}/gl-accounts/seed-defaults`).then((r) => r.data),

  listFiscalYears: (companyId) => http.get(`/api/finance/companies/${companyId}/periods/fiscal-years`).then((r) => r.data),
  createFiscalYear: (companyId, payload) => http.post(`/api/finance/companies/${companyId}/periods/fiscal-years`, payload).then((r) => r.data),
  closeFiscalYear: (companyId, fiscalYearId) => http.post(`/api/finance/companies/${companyId}/periods/fiscal-years/${fiscalYearId}/close`).then((r) => r.data),
  openFiscalYear: (companyId, fiscalYearId) => http.post(`/api/finance/companies/${companyId}/periods/fiscal-years/${fiscalYearId}/open`).then((r) => r.data),
  listPeriods: (companyId, fiscalYearId) => http.get(`/api/finance/companies/${companyId}/periods/fiscal-years/${fiscalYearId}`).then((r) => r.data),
  closePeriod: (companyId, periodId) => http.post(`/api/finance/companies/${companyId}/periods/${periodId}/close`).then((r) => r.data),
  openPeriod: (companyId, periodId) => http.post(`/api/finance/companies/${companyId}/periods/${periodId}/open`).then((r) => r.data),

  agingReport: (companyId, params) => http.get(`/api/finance/companies/${companyId}/reports/aging`, { params }).then((r) => r.data),
  glSummaryReport: (companyId, params) => http.get(`/api/finance/companies/${companyId}/reports/gl-summary`, { params }).then((r) => r.data),
  trialBalanceReport: (companyId, params) => http.get(`/api/finance/companies/${companyId}/reports/trial-balance`, { params }).then((r) => r.data),
  profitLossReport: (companyId, params) => http.get(`/api/finance/companies/${companyId}/reports/profit-loss`, { params }).then((r) => r.data),
  balanceSheetReport: (companyId, params) => http.get(`/api/finance/companies/${companyId}/reports/balance-sheet`, { params }).then((r) => r.data)
}

export const hrApi = {
  listDepartments: () => http.get('/api/departments').then((r) => r.data),
  createDepartment: (payload) => http.post('/api/departments', payload).then((r) => r.data),
  updateDepartment: (id, payload) => http.put(`/api/departments/${id}`, payload).then((r) => r.data),
  deleteDepartment: (id) => http.delete(`/api/departments/${id}`).then((r) => r.data),

  listEmployees: () => http.get('/api/employees').then((r) => r.data),
  listEmployeesPaged: (params) => http.get('/api/employees/paged', { params }).then((r) => r.data),
  createEmployee: (payload) => http.post('/api/employees', payload).then((r) => r.data),
  updateEmployee: (id, payload) => http.put(`/api/employees/${id}`, payload).then((r) => r.data),
  deleteEmployee: (id) => http.delete(`/api/employees/${id}`).then((r) => r.data),
  toggleEmployeeStatus: (id) => http.put(`/api/employees/${id}/toggle-status`).then((r) => r.data)
}
