import { Tag } from 'antd'

export type DocumentStatus =
  | 'DRAFTED'
  | 'APPROVED'
  | 'PARTIALLY_COMPLETED'
  | 'COMPLETED'
  | 'VOIDED'
  | string

type StatusBadgeProps = {
  status?: DocumentStatus | null
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const s = String(status || '').toUpperCase()
  if (!s) return <Tag>UNKNOWN</Tag>

  if (s === 'DRAFTED') return <Tag color="default">DRAFT</Tag>
  if (s === 'APPROVED') return <Tag color="blue">APPROVED</Tag>
  if (s === 'PARTIALLY_COMPLETED') return <Tag color="gold">PARTIAL</Tag>
  if (s === 'COMPLETED') return <Tag color="green">COMPLETED</Tag>
  if (s === 'VOIDED') return <Tag color="red">VOIDED</Tag>

  return <Tag>{s}</Tag>
}
