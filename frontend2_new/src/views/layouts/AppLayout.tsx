import { Button, Layout, Menu, Space, Typography } from 'antd'
import type { MenuProps } from 'antd'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

const { Sider, Content, Header } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function item(label: ReactNode, key: string, children?: MenuItem[]): MenuItem {
  return { key, label, children } as MenuItem
}

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const role = useAuthStore((s) => s.role)
  const logout = useAuthStore((s) => s.logout)

  const items: MenuItem[] = useMemo(
    () => [
      item('Core Setup', 'core', [
        item('Companies', '/modules/core/companies'),
        item('Organizations', '/modules/core/orgs')
      ]),
      item('Master Data', 'masterdata', [
        item('UoMs', '/modules/masterdata/uoms'),
        item('Business Partners', '/modules/masterdata/business-partners'),
        item('Currencies', '/modules/masterdata/currencies'),
        item('Products', '/modules/masterdata/products'),
        item('Warehouses', '/modules/masterdata/warehouses')
      ]),
      item('Purchase', 'purchase', [item('Purchase Orders', '/modules/purchase/purchase-orders')]),
      item('Sales', 'sales', [item('Sales Orders', '/modules/sales/sales-orders'), item('Goods Shipments', '/modules/sales/goods-shipments')]),
      item('Inventory', 'inventory', [
        item('Locators', '/modules/inventory/locators'),
        item('On Hand', '/modules/inventory/onhand'),
        item('Movements', '/modules/inventory/movements'),
        item('Adjustments', '/modules/inventory/adjustments')
      ]),
      item('Manufacturing', 'manufacturing', [
        item('Overview', '/modules/manufacturing'),
        item('BOMs', '/modules/manufacturing/boms'),
        item('Work Orders', '/modules/manufacturing/work-orders'),
        item('Reports', '/modules/manufacturing/reports')
      ]),
      item('Finance', 'finance', [
        item('Overview', '/modules/finance'),
        item('GL Accounts', '/modules/finance/gl-accounts'),
        item('Invoices', '/modules/finance/invoices'),
        item('Payments', '/modules/finance/payments'),
        item('Banks', '/modules/finance/banks'),
        item('Budgets', '/modules/finance/budgets'),
        item('Journals', '/modules/finance/journals'),
        item('Periods', '/modules/finance/periods'),
        item('Reports', '/modules/finance/reports')
      ]),
      item('HR', 'hr', [
        item('Overview', '/modules/hr'),
        item('Departments', '/modules/hr/departments'),
        item('Employees', '/modules/hr/employees')
      ]),
      item('Admin', 'admin', [item('User Management', '/modules/admin/users')]),
      item('Tools', 'tools', [item('Overview', '/tools')])
    ],
    []
  )

  const selectedKeys = useMemo(() => {
    const path = location.pathname
    const flatKeys: string[] = []
    const walk = (arr: MenuItem[]) => {
      for (const it of arr) {
        if (!it) continue
        const k = String((it as any).key)
        if (k.startsWith('/')) flatKeys.push(k)
        const children = (it as any).children as MenuItem[] | undefined
        if (children) walk(children)
      }
    }
    walk(items)
    const best = flatKeys
      .filter((k) => path === k || path.startsWith(k + '/'))
      .sort((a, b) => b.length - a.length)[0]
    return best ? [best] : []
  }, [items, location.pathname])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={240} theme="light">
        <div style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            ERP Garment
          </Typography.Title>
          <Typography.Text type="secondary">Enterprise Resource Planning</Typography.Text>
        </div>
        <Menu
          mode="inline"
          items={items}
          selectedKeys={selectedKeys}
          onClick={({ key }) => {
            if (String(key).startsWith('/')) navigate(String(key))
          }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography.Text strong>ERP Garment</Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Modern Enterprise ERP
            </Typography.Text>
          </div>

          <Space>
            <Typography.Text type="secondary">{role ? `Role: ${role}` : ''}</Typography.Text>
            <Button
              onClick={() => {
                logout()
                navigate('/login', { replace: true })
              }}
            >
              Logout
            </Button>
          </Space>
        </Header>
        <Content style={{ padding: 16 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
