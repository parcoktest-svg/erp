import { Card, Typography } from 'antd'

export default function DashboardView() {
  return (
    <Card>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        Dashboard
      </Typography.Title>
      <Typography.Paragraph style={{ marginBottom: 0 }}>
        Welcome to ERP.
      </Typography.Paragraph>
    </Card>
  )
}
