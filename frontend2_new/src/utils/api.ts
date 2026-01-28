import { http } from './http'

export const authApi = {
  signup: (payload: any) => http.post('/auth/signup', payload).then((r) => r.data),
  signin: (payload: any) => http.post('/auth/signin', payload).then((r) => r.data)
}

export const adminApi = {
  createUser: (payload: any) => http.post('/admin/create-user-management', payload).then((r) => r.data),
  updateUser: (id: any, payload: any) => http.put(`/admin/update-user/${id}`, payload).then((r) => r.data),
  resetPassword: (id: any, payload: any) => http.put(`/admin/reset-password/${id}`, payload).then((r) => r.data),
  changeStatus: (id: any) => http.put(`/admin/change-status/${id}`).then((r) => r.data),
  deleteUser: (id: any) => http.delete(`/admin/delete-user/${id}`).then((r) => r.data),
  listUsers: (params?: any) => http.get('/admin/all-users', { params }).then((r) => r.data)
}

export const genericApi = {
  request: ({ method, url, params, data, headers }: any) =>
    http.request({ method, url, params, data, headers }).then((r) => ({ status: r.status, data: r.data, headers: r.headers }))
}

export const coreApi = {
  listCompanies: () => http.get('/api/core/companies').then((r) => r.data),
  createCompany: (payload: any) => http.post('/api/core/companies', payload).then((r) => r.data),
  listOrgs: (companyId: any) => http.get(`/api/core/companies/${companyId}/orgs`).then((r) => r.data),
  createOrg: (companyId: any, payload: any) => http.post(`/api/core/companies/${companyId}/orgs`, payload).then((r) => r.data)
}

export const masterDataApi = {
  listUoms: (companyId: any) => http.get(`/api/masterdata/companies/${companyId}/uoms`).then((r) => r.data),
  createUom: (companyId: any, payload: any) => http.post(`/api/masterdata/companies/${companyId}/uoms`, payload).then((r) => r.data),
  updateUom: (companyId: any, uomId: any, payload: any) =>
    http.put(`/api/masterdata/companies/${companyId}/uoms/${uomId}`, payload).then((r) => r.data),
  deleteUom: (companyId: any, uomId: any) => http.delete(`/api/masterdata/companies/${companyId}/uoms/${uomId}`).then((r) => r.data),

  listCurrencies: (companyId: any) => http.get(`/api/masterdata/companies/${companyId}/currencies`).then((r) => r.data),
  createCurrency: (companyId: any, payload: any) => http.post(`/api/masterdata/companies/${companyId}/currencies`, payload).then((r) => r.data),
  updateCurrency: (companyId: any, currencyId: any, payload: any) =>
    http.put(`/api/masterdata/companies/${companyId}/currencies/${currencyId}`, payload).then((r) => r.data),
  deleteCurrency: (companyId: any, currencyId: any) =>
    http.delete(`/api/masterdata/companies/${companyId}/currencies/${currencyId}`).then((r) => r.data),

  listProducts: (companyId: any, params?: any) => http.get(`/api/masterdata/companies/${companyId}/products`, { params }).then((r) => r.data),
  createProduct: (companyId: any, payload: any) => http.post(`/api/masterdata/companies/${companyId}/products`, payload).then((r) => r.data),
  updateProduct: (companyId: any, productId: any, payload: any) =>
    http.put(`/api/masterdata/companies/${companyId}/products/${productId}`, payload).then((r) => r.data),
  deleteProduct: (companyId: any, productId: any) =>
    http.delete(`/api/masterdata/companies/${companyId}/products/${productId}`).then((r) => r.data),

  listWarehouses: (companyId: any) => http.get(`/api/masterdata/companies/${companyId}/warehouses`).then((r) => r.data),
  createWarehouse: (companyId: any, payload: any) => http.post(`/api/masterdata/companies/${companyId}/warehouses`, payload).then((r) => r.data),
  updateWarehouse: (companyId: any, warehouseId: any, payload: any) =>
    http.put(`/api/masterdata/companies/${companyId}/warehouses/${warehouseId}`, payload).then((r) => r.data),
  deleteWarehouse: (companyId: any, warehouseId: any) =>
    http.delete(`/api/masterdata/companies/${companyId}/warehouses/${warehouseId}`).then((r) => r.data),

  listBusinessPartners: (companyId: any) => http.get(`/api/masterdata/companies/${companyId}/business-partners`).then((r) => r.data),
  createBusinessPartner: (companyId: any, payload: any) =>
    http.post(`/api/masterdata/companies/${companyId}/business-partners`, payload).then((r) => r.data),
  updateBusinessPartner: (companyId: any, businessPartnerId: any, payload: any) =>
    http.put(`/api/masterdata/companies/${companyId}/business-partners/${businessPartnerId}`, payload).then((r) => r.data),
  deleteBusinessPartner: (companyId: any, businessPartnerId: any) =>
    http.delete(`/api/masterdata/companies/${companyId}/business-partners/${businessPartnerId}`).then((r) => r.data)
,
  listPriceLists: (companyId: any) => http.get(`/api/masterdata/companies/${companyId}/price-lists`).then((r) => r.data),
  createPriceList: (companyId: any, payload: any) => http.post(`/api/masterdata/companies/${companyId}/price-lists`, payload).then((r) => r.data),
  updatePriceList: (companyId: any, priceListId: any, payload: any) =>
    http.put(`/api/masterdata/companies/${companyId}/price-lists/${priceListId}`, payload).then((r) => r.data),
  deletePriceList: (companyId: any, priceListId: any) =>
    http.delete(`/api/masterdata/companies/${companyId}/price-lists/${priceListId}`).then((r) => r.data),

  listPriceListVersions: (priceListId: any) => http.get(`/api/masterdata/price-lists/${priceListId}/versions`).then((r) => r.data),
  createPriceListVersion: (priceListId: any, payload: any) =>
    http.post(`/api/masterdata/price-lists/${priceListId}/versions`, payload).then((r) => r.data),

  listProductPrices: (priceListVersionId: any) =>
    http.get(`/api/masterdata/price-list-versions/${priceListVersionId}/product-prices`).then((r) => r.data),
  upsertProductPrice: (priceListVersionId: any, payload: any) =>
    http.post(`/api/masterdata/price-list-versions/${priceListVersionId}/product-prices`, payload).then((r) => r.data),

  listTaxRates: (companyId: any) => http.get(`/api/masterdata/companies/${companyId}/tax-rates`).then((r) => r.data)
}

export const salesApi = {
  listSalesOrders: (companyId: any) => http.get(`/api/sales/companies/${companyId}/sales-orders`).then((r) => r.data),
  createSalesOrder: (companyId: any, payload: any) => http.post(`/api/sales/companies/${companyId}/sales-orders`, payload).then((r) => r.data),
  updateSalesOrder: (companyId: any, salesOrderId: any, payload: any) =>
    http.put(`/api/sales/companies/${companyId}/sales-orders/${salesOrderId}`, payload).then((r) => r.data),
  deleteSalesOrder: (companyId: any, salesOrderId: any) => http.delete(`/api/sales/companies/${companyId}/sales-orders/${salesOrderId}`).then((r) => r.data),
  getSalesOrder: (companyId: any, salesOrderId: any) =>
    http.get(`/api/sales/companies/${companyId}/sales-orders/${salesOrderId}`).then((r) => r.data),

  lineLookups: (companyId: any) => http.get(`/api/sales/companies/${companyId}/sales-orders/line-lookups`).then((r) => r.data),

  approveSalesOrder: (companyId: any, salesOrderId: any) =>
    http.post(`/api/sales/companies/${companyId}/sales-orders/${salesOrderId}/approve`).then((r) => r.data),
  voidSalesOrder: (companyId: any, salesOrderId: any, payload: any) =>
    http.post(`/api/sales/companies/${companyId}/sales-orders/${salesOrderId}/void`, payload).then((r) => r.data),

  createInvoiceFromSalesOrder: (companyId: any, salesOrderId: any, payload: any) =>
    http.post(`/api/sales/companies/${companyId}/sales-orders/${salesOrderId}/invoices`, payload).then((r) => r.data),

  listSalesOrderBoms: (companyId: any, salesOrderId: any) =>
    http.get(`/api/sales/companies/${companyId}/sales-orders/${salesOrderId}/boms`).then((r) => r.data),
  setSalesOrderLineBom: (companyId: any, salesOrderId: any, payload: any) =>
    http.put(`/api/sales/companies/${companyId}/sales-orders/${salesOrderId}/boms`, payload).then((r) => r.data),
  copySalesOrderBoms: (companyId: any, salesOrderId: any, payload: any) =>
    http.post(`/api/sales/companies/${companyId}/sales-orders/${salesOrderId}/boms/copy`, payload).then((r) => r.data),

  createGoodsShipment: (companyId: any, salesOrderId: any, payload: any) =>
    http.post(`/api/sales/companies/${companyId}/sales-orders/${salesOrderId}/goods-shipments`, payload).then((r) => r.data)
}

export const purchaseApi = {
  listPurchaseOrders: (companyId: any) => http.get(`/api/purchase/companies/${companyId}/purchase-orders`).then((r) => r.data),
  createPurchaseOrder: (companyId: any, payload: any) => http.post(`/api/purchase/companies/${companyId}/purchase-orders`, payload).then((r) => r.data),
  updatePurchaseOrder: (companyId: any, purchaseOrderId: any, payload: any) =>
    http.put(`/api/purchase/companies/${companyId}/purchase-orders/${purchaseOrderId}`, payload).then((r) => r.data),
  deletePurchaseOrder: (companyId: any, purchaseOrderId: any) =>
    http.delete(`/api/purchase/companies/${companyId}/purchase-orders/${purchaseOrderId}`).then((r) => r.data),
  approvePurchaseOrder: (companyId: any, purchaseOrderId: any) =>
    http.post(`/api/purchase/companies/${companyId}/purchase-orders/${purchaseOrderId}/approve`).then((r) => r.data),
  voidPurchaseOrder: (companyId: any, purchaseOrderId: any, payload: any) =>
    http.post(`/api/purchase/companies/${companyId}/purchase-orders/${purchaseOrderId}/void`, payload).then((r) => r.data),
  createGoodsReceipt: (companyId: any, purchaseOrderId: any, payload: any) =>
    http.post(`/api/purchase/companies/${companyId}/purchase-orders/${purchaseOrderId}/goods-receipts`, payload).then((r) => r.data),
  createPurchaseInvoice: (companyId: any, purchaseOrderId: any, payload: any) =>
    http.post(`/api/purchase/companies/${companyId}/purchase-orders/${purchaseOrderId}/invoices`, payload).then((r) => r.data)
}

export const inventoryApi = {
  listLocators: (companyId: any, params?: any) => http.get(`/api/inventory/companies/${companyId}/locators`, { params }).then((r) => r.data),
  createLocator: (companyId: any, payload: any) => http.post(`/api/inventory/companies/${companyId}/locators`, payload).then((r) => r.data),

  getOnHand: (companyId: any, params: any) => http.get(`/api/inventory/companies/${companyId}/onhand`, { params }).then((r) => r.data),
  getOnHandByLocator: (companyId: any, params: any) =>
    http.get(`/api/inventory/companies/${companyId}/onhand/by-locator`, { params }).then((r) => r.data),

  listMovements: (companyId: any, params?: any) => http.get(`/api/inventory/companies/${companyId}/movements`, { params }).then((r) => r.data),
  createMovement: (companyId: any, payload: any) => http.post(`/api/inventory/companies/${companyId}/movements`, payload).then((r) => r.data),
  completeMovement: (companyId: any, movementId: any) =>
    http.post(`/api/inventory/companies/${companyId}/movements/${movementId}/complete`).then((r) => r.data),
  voidMovement: (companyId: any, movementId: any) =>
    http.post(`/api/inventory/companies/${companyId}/movements/${movementId}/void`).then((r) => r.data),

  listAdjustments: (companyId: any) => http.get(`/api/inventory/companies/${companyId}/adjustments`).then((r) => r.data),
  createAdjustment: (companyId: any, payload: any) => http.post(`/api/inventory/companies/${companyId}/adjustments`, payload).then((r) => r.data),
  updateAdjustment: (companyId: any, adjustmentId: any, payload: any) =>
    http.put(`/api/inventory/companies/${companyId}/adjustments/${adjustmentId}`, payload).then((r) => r.data),
  deleteAdjustment: (companyId: any, adjustmentId: any) =>
    http.delete(`/api/inventory/companies/${companyId}/adjustments/${adjustmentId}`).then((r) => r.data),
  completeAdjustment: (companyId: any, adjustmentId: any) =>
    http.post(`/api/inventory/companies/${companyId}/adjustments/${adjustmentId}/complete`).then((r) => r.data),
  voidAdjustment: (companyId: any, adjustmentId: any) =>
    http.post(`/api/inventory/companies/${companyId}/adjustments/${adjustmentId}/void`).then((r) => r.data)
}

export const manufacturingApi = {
  listBoms: (companyId: any) => http.get(`/api/manufacturing/companies/${companyId}/boms`).then((r) => r.data),
  getBom: (companyId: any, bomId: any) => http.get(`/api/manufacturing/companies/${companyId}/boms/${bomId}`).then((r) => r.data),
  createBom: (companyId: any, payload: any) => http.post(`/api/manufacturing/companies/${companyId}/boms`, payload).then((r) => r.data),
  updateBom: (companyId: any, bomId: any, payload: any) =>
    http.put(`/api/manufacturing/companies/${companyId}/boms/${bomId}`, payload).then((r) => r.data),
  deleteBom: (companyId: any, bomId: any) => http.delete(`/api/manufacturing/companies/${companyId}/boms/${bomId}`).then((r) => r.data),

  listWorkOrders: (companyId: any) => http.get(`/api/manufacturing/companies/${companyId}/work-orders`).then((r) => r.data),
  getWorkOrder: (companyId: any, workOrderId: any) =>
    http.get(`/api/manufacturing/companies/${companyId}/work-orders/${workOrderId}`).then((r) => r.data),
  createWorkOrder: (companyId: any, payload: any) => http.post(`/api/manufacturing/companies/${companyId}/work-orders`, payload).then((r) => r.data),
  updateWorkOrder: (companyId: any, workOrderId: any, payload: any) =>
    http.put(`/api/manufacturing/companies/${companyId}/work-orders/${workOrderId}`, payload).then((r) => r.data),
  deleteWorkOrder: (companyId: any, workOrderId: any) =>
    http.delete(`/api/manufacturing/companies/${companyId}/work-orders/${workOrderId}`).then((r) => r.data),
  completeWorkOrder: (companyId: any, workOrderId: any, payload: any) =>
    http.post(`/api/manufacturing/companies/${companyId}/work-orders/${workOrderId}/complete`, payload).then((r) => r.data),
  voidWorkOrder: (companyId: any, workOrderId: any, payload: any) =>
    http.post(`/api/manufacturing/companies/${companyId}/work-orders/${workOrderId}/void`, payload).then((r) => r.data),

  wipReport: (companyId: any) => http.get(`/api/manufacturing/companies/${companyId}/reports/wip`).then((r) => r.data),
  productionCost: (companyId: any, params: any) =>
    http.get(`/api/manufacturing/companies/${companyId}/reports/production-cost`, { params }).then((r) => r.data)
}

export const financeApi = {
  listGlAccounts: (companyId: any) => http.get(`/api/finance/companies/${companyId}/gl-accounts`).then((r) => r.data),
  createGlAccount: (companyId: any, payload: any) => http.post(`/api/finance/companies/${companyId}/gl-accounts`, payload).then((r) => r.data),
  seedDefaultGlAccounts: (companyId: any) => http.post(`/api/finance/companies/${companyId}/gl-accounts/seed-defaults`).then((r) => r.data),

  listFiscalYears: (companyId: any) => http.get(`/api/finance/companies/${companyId}/periods/fiscal-years`).then((r) => r.data),
  createFiscalYear: (companyId: any, payload: any) => http.post(`/api/finance/companies/${companyId}/periods/fiscal-years`, payload).then((r) => r.data),
  closeFiscalYear: (companyId: any, fiscalYearId: any) =>
    http.post(`/api/finance/companies/${companyId}/periods/fiscal-years/${fiscalYearId}/close`).then((r) => r.data),
  openFiscalYear: (companyId: any, fiscalYearId: any) =>
    http.post(`/api/finance/companies/${companyId}/periods/fiscal-years/${fiscalYearId}/open`).then((r) => r.data),
  listPeriods: (companyId: any, fiscalYearId: any) =>
    http.get(`/api/finance/companies/${companyId}/periods/fiscal-years/${fiscalYearId}`).then((r) => r.data),
  closePeriod: (companyId: any, periodId: any) => http.post(`/api/finance/companies/${companyId}/periods/${periodId}/close`).then((r) => r.data),
  openPeriod: (companyId: any, periodId: any) => http.post(`/api/finance/companies/${companyId}/periods/${periodId}/open`).then((r) => r.data),

  agingReport: (companyId: any, params: any) => http.get(`/api/finance/companies/${companyId}/reports/aging`, { params }).then((r) => r.data),
  glSummaryReport: (companyId: any, params: any) =>
    http.get(`/api/finance/companies/${companyId}/reports/gl-summary`, { params }).then((r) => r.data),
  trialBalanceReport: (companyId: any, params: any) =>
    http.get(`/api/finance/companies/${companyId}/reports/trial-balance`, { params }).then((r) => r.data),
  profitLossReport: (companyId: any, params: any) =>
    http.get(`/api/finance/companies/${companyId}/reports/profit-loss`, { params }).then((r) => r.data),
  balanceSheetReport: (companyId: any, params: any) =>
    http.get(`/api/finance/companies/${companyId}/reports/balance-sheet`, { params }).then((r) => r.data),

  listInvoices: (companyId: any) => http.get(`/api/finance/companies/${companyId}/invoices`).then((r) => r.data),
  createInvoice: (companyId: any, payload: any) => http.post(`/api/finance/companies/${companyId}/invoices`, payload).then((r) => r.data),
  completeInvoice: (companyId: any, invoiceId: any) =>
    http.post(`/api/finance/companies/${companyId}/invoices/${invoiceId}/complete`).then((r) => r.data),
  voidInvoice: (companyId: any, invoiceId: any, payload: any) =>
    http.post(`/api/finance/companies/${companyId}/invoices/${invoiceId}/void`, payload).then((r) => r.data),

  listPayments: (companyId: any, params?: any) => http.get(`/api/finance/companies/${companyId}/payments`, { params }).then((r) => r.data),
  createPayment: (companyId: any, payload: any) => http.post(`/api/finance/companies/${companyId}/payments`, payload).then((r) => r.data),
  voidPayment: (companyId: any, paymentId: any, payload: any) =>
    http.post(`/api/finance/companies/${companyId}/payments/${paymentId}/void`, payload).then((r) => r.data),

  createPaymentAllocation: (companyId: any, payload: any) =>
    http.post(`/api/finance/companies/${companyId}/payment-allocations`, payload).then((r) => r.data),
  listPaymentAllocations: (companyId: any, params?: any) =>
    http.get(`/api/finance/companies/${companyId}/payment-allocations`, { params }).then((r) => r.data),

  listBankAccounts: (companyId: any) => http.get(`/api/finance/companies/${companyId}/banks/accounts`).then((r) => r.data),
  createBankAccount: (companyId: any, payload: any) => http.post(`/api/finance/companies/${companyId}/banks/accounts`, payload).then((r) => r.data),
  listBankStatements: (companyId: any) => http.get(`/api/finance/companies/${companyId}/banks/statements`).then((r) => r.data),
  getBankStatement: (companyId: any, statementId: any) =>
    http.get(`/api/finance/companies/${companyId}/banks/statements/${statementId}`).then((r) => r.data),
  createBankStatement: (companyId: any, payload: any) => http.post(`/api/finance/companies/${companyId}/banks/statements`, payload).then((r) => r.data),
  reconcileBankStatementLine: (companyId: any, statementId: any, lineId: any, payload?: any) =>
    http.post(`/api/finance/companies/${companyId}/banks/statements/${statementId}/lines/${lineId}/reconcile`, payload).then((r) => r.data),
  suggestPaymentsForBankStatementLine: (companyId: any, statementId: any, lineId: any, params?: any) =>
    http.get(`/api/finance/companies/${companyId}/banks/statements/${statementId}/lines/${lineId}/suggest-payments`, { params }).then((r) => r.data),

  listBudgets: (companyId: any) => http.get(`/api/finance/companies/${companyId}/budgets`).then((r) => r.data),
  listBudgetsByFiscalYear: (companyId: any, fiscalYearId: any) =>
    http.get(`/api/finance/companies/${companyId}/budgets/fiscal-year/${fiscalYearId}`).then((r) => r.data),
  createBudget: (companyId: any, payload: any) => http.post(`/api/finance/companies/${companyId}/budgets`, payload).then((r) => r.data),
  completeBudget: (companyId: any, budgetId: any) => http.post(`/api/finance/companies/${companyId}/budgets/${budgetId}/complete`).then((r) => r.data),
  voidBudget: (companyId: any, budgetId: any) => http.post(`/api/finance/companies/${companyId}/budgets/${budgetId}/void`).then((r) => r.data),
  budgetVsActual: (companyId: any, budgetId: any) =>
    http.get(`/api/finance/companies/${companyId}/budgets/${budgetId}/budget-vs-actual`).then((r) => r.data),

  listJournals: (companyId: any) => http.get(`/api/finance/companies/${companyId}/journals`).then((r) => r.data)
}

export const hrApi = {
  listDepartments: () => http.get('/api/departments').then((r) => r.data),
  createDepartment: (payload: any) => http.post('/api/departments', payload).then((r) => r.data),
  updateDepartment: (id: any, payload: any) => http.put(`/api/departments/${id}`, payload).then((r) => r.data),
  deleteDepartment: (id: any) => http.delete(`/api/departments/${id}`).then((r) => r.data),

  listEmployees: () => http.get('/api/employees').then((r) => r.data),
  listEmployeesPaged: (params?: any) => http.get('/api/employees/paged', { params }).then((r) => r.data),
  createEmployee: (payload: any) => http.post('/api/employees', payload).then((r) => r.data),
  updateEmployee: (id: any, payload: any) => http.put(`/api/employees/${id}`, payload).then((r) => r.data),
  deleteEmployee: (id: any) => http.delete(`/api/employees/${id}`).then((r) => r.data),
  toggleEmployeeStatus: (id: any) => http.put(`/api/employees/${id}/toggle-status`).then((r) => r.data)
}
