import { Button, Card, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { coreApi, masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'

type CompanyRow = {
  id: number
  code?: string
  name?: string
}

type CurrencyRow = {
  id: number
  code?: string
  name?: string
  precisionValue?: number
  active?: boolean
}

export default function CurrenciesView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<CurrencyRow[]>([])

  const [q, setQ] = useState('')

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<CurrencyRow | null>(null)
  const [form] = Form.useForm()

  const loadCompanies = async () => {
    setCompanyLoading(true)
    try {
      const res = await coreApi.listCompanies()
      setCompanies((res || []) as CompanyRow[])
      if (!companyId && Array.isArray(res) && res.length > 0) {
        setCompanyId((res[0] as any).id ?? null)
      }
    } catch (e: any) {
      message.error(e?.message || 'Failed to load companies')
    } finally {
      setCompanyLoading(false)
    }
  }

  const load = async (cid: number) => {
    setLoading(true)
    try {
      const res = await masterDataApi.listCurrencies(cid)
      setRows((res || []) as CurrencyRow[])
    } catch (e: any) {
      message.error(e?.message || 'Failed to load currencies')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCompanies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (companyId) void load(companyId)
  }, [companyId])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    if (!qq) return rows
    return rows.filter((r) => `${r.code || ''} ${r.name || ''}`.toLowerCase().includes(qq))
  }, [q, rows])

  const columns: ColumnsType<CurrencyRow> = useMemo(
    () => [
      { title: 'ID', dataIndex: 'id', width: 90 },
      { title: 'Code', dataIndex: 'code', width: 140 },
      { title: 'Name', dataIndex: 'name' },
      { title: 'Precision', dataIndex: 'precisionValue', width: 110 },
      {
        title: 'Active',
        dataIndex: 'active',
        width: 100,
        render: (v: boolean) => (v ? <Tag color="green">YES</Tag> : <Tag color="red">NO</Tag>)
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 180,
        render: (_, r) => (
          <Space>
            <Button
              size="small"
              onClick={() => {
                setEditing(r)
                setOpen(true)
                form.setFieldsValue({ code: r.code, name: r.name, precisionValue: r.precisionValue, active: r.active })
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete currency?"
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={async () => {
                if (!companyId) return
                try {
                  await masterDataApi.deleteCurrency(companyId, r.id)
                  message.success('Deleted')
                  await load(companyId)
                } catch (e: any) {
                  message.error(e?.message || 'Failed to delete')
                }
              }}
            >
              <Button size="small" danger>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        )
      }
    ],
    [companyId, form]
  )

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Currencies
          </Typography.Title>
          <Space>
            <Button onClick={() => loadCompanies()} loading={companyLoading}>
              Refresh Companies
            </Button>
            <Button onClick={() => companyId && load(companyId)} disabled={!companyId} loading={loading}>
              Refresh
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setEditing(null)
                setOpen(true)
                form.setFieldsValue({ active: true, precisionValue: 2 })
              }}
              disabled={!companyId}
            >
              New
            </Button>
          </Space>
        </Space>
      </Card>

      <Card>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Space wrap>
            <div style={{ minWidth: 320 }}>
              <Typography.Text strong>Company</Typography.Text>
              <Select
                style={{ width: '100%' }}
                loading={companyLoading}
                value={companyId ?? undefined}
                placeholder="Select company"
                options={companies.map((c) => ({ value: c.id, label: `${c.code || c.id} - ${c.name || ''}` }))}
                onChange={(v) => setCompanyId(v)}
              />
            </div>

            <div style={{ minWidth: 260 }}>
              <Typography.Text strong>Search</Typography.Text>
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="code/name" allowClear />
            </div>
          </Space>

          <Table<CurrencyRow> rowKey="id" loading={loading} columns={columns} dataSource={filtered} pagination={{ pageSize: 10 }} />
        </Space>
      </Card>

      <Modal
        title={editing ? 'Edit Currency' : 'Create Currency'}
        open={open}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
          form.resetFields()
        }}
        onOk={async () => {
          if (!companyId) return
          try {
            const values = await form.validateFields()
            if (editing) {
              await masterDataApi.updateCurrency(companyId, editing.id, values)
              message.success('Updated')
            } else {
              await masterDataApi.createCurrency(companyId, values)
              message.success('Created')
            }
            setOpen(false)
            setEditing(null)
            form.resetFields()
            await load(companyId)
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(e?.message || 'Save failed')
          }
        }}
        okText={editing ? 'Save' : 'Create'}
      >
        <Form layout="vertical" form={form} initialValues={{ active: true, precisionValue: 2 }}>
          <Form.Item name="code" label="Code" rules={[{ required: true, message: 'Code is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="precisionValue" label="Precision" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}
