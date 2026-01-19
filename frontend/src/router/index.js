import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import AuthLayout from '@/views/layouts/AuthLayout.vue'
import AppLayout from '@/views/layouts/AppLayout.vue'

import LoginView from '@/views/auth/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ModuleLandingView from '@/views/modules/ModuleLandingView.vue'
import CoreCompaniesView from '@/views/modules/core/CoreCompaniesView.vue'
import CoreOrgsView from '@/views/modules/core/CoreOrgsView.vue'
import UomsView from '@/views/modules/masterdata/UomsView.vue'
import BusinessPartnersView from '@/views/modules/masterdata/BusinessPartnersView.vue'
import CurrenciesView from '@/views/modules/masterdata/CurrenciesView.vue'
import ProductsView from '@/views/modules/masterdata/ProductsView.vue'
import PriceListsView from '@/views/modules/masterdata/PriceListsView.vue'
import WarehousesView from '@/views/modules/masterdata/WarehousesView.vue'
import PurchaseOrdersView from '@/views/modules/purchase/PurchaseOrdersView.vue'
import SalesOrdersView from '@/views/modules/sales/SalesOrdersView.vue'
import LocatorsView from '@/views/modules/inventory/LocatorsView.vue'
import OnHandView from '@/views/modules/inventory/OnHandView.vue'
import MovementsView from '@/views/modules/inventory/MovementsView.vue'
import AdjustmentsView from '@/views/modules/inventory/AdjustmentsView.vue'
import BomsView from '@/views/modules/manufacturing/BomsView.vue'
import WorkOrdersView from '@/views/modules/manufacturing/WorkOrdersView.vue'
import ManufacturingReportsView from '@/views/modules/manufacturing/ReportsView.vue'
import FinanceGlAccountsView from '@/views/modules/finance/GlAccountsView.vue'
import FinancePeriodsView from '@/views/modules/finance/PeriodsView.vue'
import FinanceReportsView from '@/views/modules/finance/ReportsView.vue'
import HrDepartmentsView from '@/views/modules/hr/DepartmentsView.vue'
import HrEmployeesView from '@/views/modules/hr/EmployeesView.vue'
import AdminUsersView from '@/views/modules/admin/UsersView.vue'
import ApiExplorerView from '@/views/tools/ApiExplorerView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: AuthLayout,
      children: [{ path: '', name: 'login', component: LoginView }]
    },
    {
      path: '/',
      component: AppLayout,
      children: [
        { path: '', name: 'dashboard', component: DashboardView },
        { path: 'modules/:module', name: 'module-landing', component: ModuleLandingView },
        { path: 'modules/core/companies', name: 'core-companies', component: CoreCompaniesView },
        { path: 'modules/core/orgs', name: 'core-orgs', component: CoreOrgsView },
        { path: 'modules/masterdata/uoms', name: 'md-uoms', component: UomsView },
        { path: 'modules/masterdata/business-partners', name: 'md-business-partners', component: BusinessPartnersView },
        { path: 'modules/masterdata/currencies', name: 'md-currencies', component: CurrenciesView },
        { path: 'modules/masterdata/products', name: 'md-products', component: ProductsView },
        { path: 'modules/masterdata/price-lists', name: 'md-price-lists', component: PriceListsView },
        { path: 'modules/masterdata/warehouses', name: 'md-warehouses', component: WarehousesView },
        { path: 'modules/purchase/purchase-orders', name: 'purchase-orders', component: PurchaseOrdersView },
        { path: 'modules/sales/sales-orders', name: 'sales-orders', component: SalesOrdersView },
        { path: 'modules/inventory/locators', name: 'inv-locators', component: LocatorsView },
        { path: 'modules/inventory/onhand', name: 'inv-onhand', component: OnHandView },
        { path: 'modules/inventory/movements', name: 'inv-movements', component: MovementsView },
        { path: 'modules/inventory/adjustments', name: 'inv-adjustments', component: AdjustmentsView },
        { path: 'modules/manufacturing/boms', name: 'mfg-boms', component: BomsView },
        { path: 'modules/manufacturing/work-orders', name: 'mfg-work-orders', component: WorkOrdersView },
        { path: 'modules/manufacturing/reports', name: 'mfg-reports', component: ManufacturingReportsView },
        { path: 'modules/finance/gl-accounts', name: 'fin-gl-accounts', component: FinanceGlAccountsView },
        { path: 'modules/finance/periods', name: 'fin-periods', component: FinancePeriodsView },
        { path: 'modules/finance/reports', name: 'fin-reports', component: FinanceReportsView },
        { path: 'modules/hr/departments', name: 'hr-departments', component: HrDepartmentsView },
        { path: 'modules/hr/employees', name: 'hr-employees', component: HrEmployeesView },
        { path: 'modules/admin/users', name: 'admin-users', component: AdminUsersView },
        { path: 'tools/api-explorer', name: 'api-explorer', component: ApiExplorerView }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  const isPublic = to.path === '/login'
  if (!isPublic && !auth.isAuthenticated) return '/login'
  if (isPublic && auth.isAuthenticated) return '/'
  return true
})

export default router
