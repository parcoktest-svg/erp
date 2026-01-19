import { Layout, Menu } from 'antd'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

const { Header, Sider, Content } = Layout

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  const items = [
    { key: '/', label: <Link to="/">Dashboard</Link> },
    { key: '/modules/core/companies', label: <Link to="/modules/core/companies">Companies</Link> },
    { key: '/modules/core/orgs', label: <Link to="/modules/core/orgs">Orgs</Link> },
    { key: '/modules/masterdata/products', label: <Link to="/modules/masterdata/products">Products</Link> },
    { key: '/modules/masterdata/warehouses', label: <Link to="/modules/masterdata/warehouses">Warehouses</Link> },
    { key: '/modules/inventory/onhand', label: <Link to="/modules/inventory/onhand">On-hand</Link> },
    { key: '/modules/sales/sales-orders', label: <Link to="/modules/sales/sales-orders">Sales Orders</Link> },
    { key: '/modules/purchase/purchase-orders', label: <Link to="/modules/purchase/purchase-orders">Purchase Orders</Link> },
    { key: '/tools/api-explorer', label: <Link to="/tools/api-explorer">API Explorer</Link> }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" width={260} style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: 16, fontWeight: 700 }}>ERP</div>
        <Menu mode="inline" selectedKeys={[location.pathname]} items={items} />
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
