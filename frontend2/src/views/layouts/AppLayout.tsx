import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

const { Header, Sider, Content } = Layout

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  const items: MenuProps['items'] = [
    { key: '/', label: 'Dashboard' },
    {
      key: 'core',
      label: 'Core',
      children: [
        { key: '/modules/core/companies', label: 'Companies' },
        { key: '/modules/core/orgs', label: 'Orgs' }
      ]
    },
    {
      key: 'masterdata',
      label: 'Master Data',
      children: [
        { key: '/modules/masterdata/uoms', label: 'UOMs' },
        { key: '/modules/masterdata/business-partners', label: 'Business Partners' },
        { key: '/modules/masterdata/currencies', label: 'Currencies' },
        { key: '/modules/masterdata/products', label: 'Products' },
        { key: '/modules/masterdata/price-lists', label: 'Price Lists' },
        { key: '/modules/masterdata/warehouses', label: 'Warehouses' }
      ]
    },
    {
      key: 'inventory',
      label: 'Inventory',
      children: [
        { key: '/modules/inventory/locators', label: 'Locators' },
        { key: '/modules/inventory/onhand', label: 'On-hand' },
        { key: '/modules/inventory/movements', label: 'Movements' },
        { key: '/modules/inventory/adjustments', label: 'Adjustments' }
      ]
    },
    {
      key: 'purchase',
      label: 'Purchase',
      children: [{ key: '/modules/purchase/purchase-orders', label: 'Purchase Orders' }]
    },
    {
      key: 'sales',
      label: 'Sales',
      children: [{ key: '/modules/sales/sales-orders', label: 'Sales Orders' }]
    },
    {
      key: 'manufacturing',
      label: 'Manufacturing',
      children: [
        { key: '/modules/manufacturing/boms', label: 'BOMs' },
        { key: '/modules/manufacturing/work-orders', label: 'Work Orders' },
        { key: '/modules/manufacturing/reports', label: 'Reports' }
      ]
    },
    {
      key: 'finance',
      label: 'Finance',
      children: [
        { key: '/modules/finance/gl-accounts', label: 'GL Accounts' },
        { key: '/modules/finance/periods', label: 'Periods' },
        { key: '/modules/finance/reports', label: 'Reports' }
      ]
    },
    {
      key: 'hr',
      label: 'HR',
      children: [
        { key: '/modules/hr', label: 'Overview' },
        { key: '/modules/hr/departments', label: 'Departments' },
        { key: '/modules/hr/employees', label: 'Employees' }
      ]
    },
    {
      key: 'admin',
      label: 'Admin',
      children: [{ key: '/modules/admin/users', label: 'Users' }]
    },
    {
      key: 'tools',
      label: 'Tools',
      children: [{ key: '/tools/api-explorer', label: 'API Explorer' }]
    }
  ]

  function flattenKeys(input: MenuProps['items']): string[] {
    const out: string[] = []
    const walk = (arr: MenuProps['items']) => {
      ;(arr || []).forEach((it: any) => {
        if (!it) return
        if (typeof it.key === 'string' && it.key.startsWith('/')) out.push(it.key)
        if (it.children) walk(it.children)
      })
    }
    walk(input)
    return out
  }

  const navigableKeys = flattenKeys(items)

  const selectedKey = (() => {
    const path = location.pathname
    const exact = navigableKeys.find((k) => k === path)
    if (exact) return exact
    const prefixes = navigableKeys.filter((k) => k !== '/' && path.startsWith(k))
    if (prefixes.length) {
      prefixes.sort((a, b) => b.length - a.length)
      return prefixes[0]
    }
    if (path === '/') return '/'
    return undefined
  })()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" width={260} style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: 16, fontWeight: 700 }}>ERP</div>
        <Menu
          mode="inline"
          selectedKeys={selectedKey ? [selectedKey] : []}
          items={items}
          onClick={(e) => {
            if (typeof e.key === 'string') navigate(e.key)
          }}
        />
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end' }}>
          <a
            onClick={(e) => {
              e.preventDefault()
              logout()
              navigate('/login')
            }}
          >
            Logout
          </a>
        </Header>
        <Content style={{ padding: 16 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
