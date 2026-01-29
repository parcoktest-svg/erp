import { Layout, Typography } from 'antd'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Content
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24
        }}
      >
        <div style={{ width: 420, maxWidth: '100%' }}>
          <div style={{ marginBottom: 12 }}>
            <Typography.Title level={3} style={{ margin: 0 }}>
              ERP Garment
            </Typography.Title>
            <Typography.Text type="secondary">Enterprise Resource Planning</Typography.Text>
          </div>
          <Outlet />
        </div>
      </Layout.Content>
    </Layout>
  )
}
