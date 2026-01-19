import { Card, Typography } from 'antd'

export default function DashboardView() {
  return (
    <Card>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        Dashboard
      </Typography.Title>
      <Typography.Paragraph>Frontend2 (React) skeleton is running.</Typography.Paragraph>
    </Card>
  )
}
