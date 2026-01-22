import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

import AuthLayout from '@/views/layouts/AuthLayout'
import AppLayout from '@/views/layouts/AppLayout'

import LoginView from '@/views/auth/LoginView'
import DashboardView from '@/views/DashboardView'
import PlaceholderView from '@/views/common/PlaceholderView'

import CompaniesView from '@/views/modules/core/CompaniesView'
import OrganizationsView from '@/views/modules/core/OrganizationsView'

import UomsView from '@/views/modules/masterdata/UomsView'
import BusinessPartnersView from '@/views/modules/masterdata/BusinessPartnersView'
import CurrenciesView from '@/views/modules/masterdata/CurrenciesView'
import ProductsView from '@/views/modules/masterdata/ProductsView'
import WarehousesView from '@/views/modules/masterdata/WarehousesView'

import PurchaseOrdersView from '@/views/modules/purchase/PurchaseOrdersView'
import SalesOrdersView from '@/views/modules/sales/SalesOrdersView'
import GoodsShipmentsView from '@/views/modules/sales/GoodsShipmentsView'

import LocatorsView from '@/views/modules/inventory/LocatorsView'
import OnHandView from '@/views/modules/inventory/OnHandView'
import MovementsView from '@/views/modules/inventory/MovementsView'
import AdjustmentsView from '@/views/modules/inventory/AdjustmentsView'

import ManufacturingOverviewView from '@/views/modules/manufacturing/ManufacturingOverviewView'
import BomsView from '@/views/modules/manufacturing/BomsView'
import WorkOrdersView from '@/views/modules/manufacturing/WorkOrdersView'
import ManufacturingReportsView from '@/views/modules/manufacturing/ManufacturingReportsView'

import FinanceOverviewView from '@/views/modules/finance/FinanceOverviewView'
import GlAccountsView from '@/views/modules/finance/GlAccountsView'
import FinancePeriodsView from '@/views/modules/finance/FinancePeriodsView'
import FinanceReportsView from '@/views/modules/finance/FinanceReportsView'
import FinanceInvoicesView from '@/views/modules/finance/FinanceInvoicesView'
import FinancePaymentsView from '@/views/modules/finance/FinancePaymentsView'
import FinanceBanksView from '@/views/modules/finance/FinanceBanksView'
import FinanceBudgetsView from '@/views/modules/finance/FinanceBudgetsView'
import FinanceJournalsView from '@/views/modules/finance/FinanceJournalsView'

import HrOverviewView from '@/views/modules/hr/HrOverviewView'
import HrDepartmentsView from '@/views/modules/hr/DepartmentsView'
import HrEmployeesView from '@/views/modules/hr/EmployeesView'

import AdminUsersView from '@/views/modules/admin/UsersView'

function RequireAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

function RedirectIfAuthed() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/" replace />
  return <Outlet />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<RedirectIfAuthed />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginView />} />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardView />} />

          <Route path="/modules/core" element={<PlaceholderView title="Core Setup" />} />
          <Route path="/modules/masterdata" element={<PlaceholderView title="Master Data" />} />
          <Route path="/modules/purchase" element={<PlaceholderView title="Purchase" />} />
          <Route path="/modules/sales" element={<PlaceholderView title="Sales" />} />
          <Route path="/modules/inventory" element={<PlaceholderView title="Inventory" />} />
          <Route path="/modules/manufacturing" element={<ManufacturingOverviewView />} />
          <Route path="/modules/finance" element={<FinanceOverviewView />} />
          <Route path="/modules/hr/departments" element={<HrDepartmentsView />} />
          <Route path="/modules/hr/employees" element={<HrEmployeesView />} />
          <Route path="/modules/hr" element={<HrOverviewView />} />
          <Route path="/modules/admin" element={<PlaceholderView title="Admin" />} />
          <Route path="/tools" element={<PlaceholderView title="Tools" />} />

          <Route path="/modules/core/companies" element={<CompaniesView />} />
          <Route path="/modules/core/orgs" element={<OrganizationsView />} />

          <Route path="/modules/masterdata/uoms" element={<UomsView />} />
          <Route path="/modules/masterdata/business-partners" element={<BusinessPartnersView />} />
          <Route path="/modules/masterdata/currencies" element={<CurrenciesView />} />
          <Route path="/modules/masterdata/products" element={<ProductsView />} />
          <Route path="/modules/masterdata/warehouses" element={<WarehousesView />} />

          <Route path="/modules/purchase/purchase-orders" element={<PurchaseOrdersView />} />
          <Route path="/modules/sales/sales-orders" element={<SalesOrdersView />} />
          <Route path="/modules/sales/goods-shipments" element={<GoodsShipmentsView />} />

          <Route path="/modules/inventory/locators" element={<LocatorsView />} />
          <Route path="/modules/inventory/onhand" element={<OnHandView />} />
          <Route path="/modules/inventory/movements" element={<MovementsView />} />
          <Route path="/modules/inventory/adjustments" element={<AdjustmentsView />} />

          <Route path="/modules/manufacturing/boms" element={<BomsView />} />
          <Route path="/modules/manufacturing/work-orders" element={<WorkOrdersView />} />
          <Route path="/modules/manufacturing/reports" element={<ManufacturingReportsView />} />

          <Route path="/modules/finance/gl-accounts" element={<GlAccountsView />} />
          <Route path="/modules/finance/periods" element={<FinancePeriodsView />} />
          <Route path="/modules/finance/reports" element={<FinanceReportsView />} />

          <Route path="/modules/finance/invoices" element={<FinanceInvoicesView />} />
          <Route path="/modules/finance/payments" element={<FinancePaymentsView />} />
          <Route path="/modules/finance/banks" element={<FinanceBanksView />} />
          <Route path="/modules/finance/budgets" element={<FinanceBudgetsView />} />
          <Route path="/modules/finance/journals" element={<FinanceJournalsView />} />

          <Route path="/modules/admin/users" element={<AdminUsersView />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
