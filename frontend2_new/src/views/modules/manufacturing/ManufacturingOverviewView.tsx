import { Card, Space, Typography } from 'antd'

export default function ManufacturingOverviewView() {
  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Typography.Title level={4} style={{ margin: 0 }}>
          Manufacturing
        </Typography.Title>
        <Typography.Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
          Overview
        </Typography.Paragraph>
      </Card>
    </Space>
  )
}
