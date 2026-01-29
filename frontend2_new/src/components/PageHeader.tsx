import { Button, Space, Typography } from 'antd'
import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  subtitle?: string
  extra?: ReactNode
  onBack?: () => void
}

export default function PageHeader({ title, subtitle, extra, onBack }: PageHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
      <Space direction="vertical" size={0}>
        <Space align="center">
          {onBack ? <Button onClick={onBack}>Back</Button> : null}
          <Typography.Title level={4} style={{ margin: 0 }}>
            {title}
          </Typography.Title>
        </Space>
        {subtitle ? <Typography.Text type="secondary">{subtitle}</Typography.Text> : null}
      </Space>
      {extra ? <div>{extra}</div> : null}
    </div>
  )
}
