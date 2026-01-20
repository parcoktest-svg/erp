import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: 420, maxWidth: '100%' }}>
          <Outlet />
        </div>
      </Layout.Content>
    </Layout>
  )
}
