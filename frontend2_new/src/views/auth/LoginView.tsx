import { Button, Card, Form, Input, Typography, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

export default function LoginView() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  return (
    <Card>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        Login
      </Typography.Title>
      <Form
        layout="vertical"
        onFinish={async (values) => {
          try {
            await login(values)
            navigate('/', { replace: true })
          } catch (e: any) {
            message.error(e?.message || 'Login failed')
          }
        }}
      >
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input autoComplete="username" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Sign In
        </Button>
      </Form>
    </Card>
  )
}
