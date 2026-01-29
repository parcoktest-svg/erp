import { BrowserRouter } from 'react-router-dom'
 import { ConfigProvider, theme } from 'antd'
import AppRoutes from '@/router/AppRoutes'

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          borderRadius: 10,
          colorPrimary: '#1677ff',
          colorBgLayout: '#f6f8fb',
          colorBgContainer: '#ffffff',
          colorTextBase: '#0f172a',
          colorTextSecondary: '#475569',
          fontSize: 14
        },
        components: {
          Layout: {
            headerBg: '#ffffff',
            bodyBg: '#f6f8fb'
          },
          Table: {
            headerBg: '#f8fafc',
            headerColor: '#0f172a',
            headerSplitColor: '#e2e8f0',
            borderColor: '#e2e8f0',
            rowHoverBg: '#f1f5f9'
          },
          Card: {
            colorBgContainer: '#ffffff'
          }
        }
      }}
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ConfigProvider>
  )
}
