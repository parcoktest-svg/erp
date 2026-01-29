import { Table } from 'antd'
import type { TableProps } from 'antd'

export default function DataTable<RecordType extends object>(props: TableProps<RecordType>) {
  return (
    <Table<RecordType>
      size="middle"
      bordered
      scroll={{ x: true }}
      pagination={{ pageSize: 10, showSizeChanger: true, ...(props.pagination as any) }}
      {...props}
    />
  )
}
