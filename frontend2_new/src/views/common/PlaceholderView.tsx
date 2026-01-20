import { Card, Typography } from 'antd'

export default function PlaceholderView({ title }: { title: string }) {
  return (
    <Card>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        {title}
      </Typography.Title>
      <Typography.Paragraph style={{ marginBottom: 0 }}>
        Coming soon.
      </Typography.Paragraph>
    </Card>
  )
}
