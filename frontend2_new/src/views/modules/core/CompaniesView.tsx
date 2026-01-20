import { Button, Card, Form, Input, Modal, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { coreApi } from '@/utils/api'

type CompanyRow = {
  id: number
  code?: string
  name?: string
  active?: boolean
}

export default function CompaniesView() {
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<CompanyRow[]>([])

  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  const load = async () => {
    setLoading(true)
    try {
      const res = await coreApi.listCompanies()
      setRows((res || []) as CompanyRow[])
    } catch (e: any) {
      message.error(e?.message || 'Failed to load companies')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const columns: ColumnsType<CompanyRow> = useMemo(
    () => [
      { title: 'ID', dataIndex: 'id', width: 90 },
      { title: 'Code', dataIndex: 'code', width: 160 },
      { title: 'Name', dataIndex: 'name' },
      {
        title: 'Status',
        dataIndex: 'active',
        width: 120,
        render: (v: boolean) => (v ? <Tag color="green">ACTIVE</Tag> : <Tag color="red">INACTIVE</Tag>)
      }
    ],
    []
  )

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Companies
          </Typography.Title>
          <Space>
            <Button onClick={() => load()} loading={loading}>
              Refresh
            </Button>
            <Button type="primary" onClick={() => setOpen(true)}>
              New Company
            </Button>
          </Space>
        </Space>
      </Card>

      <Card>
        <Table<CompanyRow>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={rows}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Create Company"
        open={open}
        onCancel={() => {
          setOpen(false)
          form.resetFields()
        }}
        onOk={async () => {
          try {
            const values = await form.validateFields()
            await coreApi.createCompany(values)
            message.success('Company created')
            setOpen(false)
            form.resetFields()
            await load()
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(e?.message || 'Failed to create company')
          }
        }}
        okText="Create"
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="code" label="Code" rules={[{ required: true, message: 'Code is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}
