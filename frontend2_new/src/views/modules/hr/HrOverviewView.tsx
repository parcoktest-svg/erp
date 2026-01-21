import { Card, Space, Typography } from 'antd'

export default function HrOverviewView() {
  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Typography.Title level={4} style={{ margin: 0 }}>
          HR
        </Typography.Title>
        <Typography.Text type="secondary">Manage departments and employees.</Typography.Text>
      </Card>
    </Space>
  )
}
