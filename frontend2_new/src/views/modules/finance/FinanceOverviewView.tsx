import { Card, Space, Typography } from 'antd'

export default function FinanceOverviewView() {
  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Typography.Title level={4} style={{ margin: 0 }}>
          Finance
        </Typography.Title>
        <Typography.Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
          Overview
        </Typography.Paragraph>
      </Card>
    </Space>
  )
}
