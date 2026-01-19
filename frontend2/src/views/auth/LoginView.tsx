import { Button, Card, Form, Input, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

export default function LoginView() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [loading, setLoading] = useState(false)

  return (
    <Card style={{ width: 420 }}>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        Login
      </Typography.Title>

      <Form
        layout="vertical"
        onFinish={async (values) => {
          setLoading(true)
          try {
            await login({ email: values.email, password: values.password })
            navigate('/')
          } finally {
            setLoading(false)
          }
        }}
      >
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Sign In
        </Button>
      </Form>
    </Card>
  )
}
