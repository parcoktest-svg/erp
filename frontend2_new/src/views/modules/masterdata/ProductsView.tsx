import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { coreApi, masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'

type CompanyRow = {
  id: number
  code?: string
  name?: string
}

type UomRow = {
  id: number
  code?: string
  name?: string
}

type ProductRow = {
  id: number
  code?: string
  name?: string
  uomId?: number
  active?: boolean
}

export default function ProductsView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [uomLoading, setUomLoading] = useState(false)
  const [uoms, setUoms] = useState<UomRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<ProductRow[]>([])

  const [q, setQ] = useState('')

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ProductRow | null>(null)
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

  const loadUoms = async (cid: number) => {
    setUomLoading(true)
    try {
      const res = await masterDataApi.listUoms(cid)
      setUoms((res || []) as UomRow[])
    } catch (e: any) {
      message.error(e?.message || 'Failed to load UoMs')
    } finally {
      setUomLoading(false)
    }
  }

  const load = async (cid: number) => {
    setLoading(true)
    try {
      const res = await masterDataApi.listProducts(cid)
      setRows((res || []) as ProductRow[])
    } catch (e: any) {
      message.error(e?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCompanies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!companyId) return
    void loadUoms(companyId)
    void load(companyId)
  }, [companyId])

  const uomLabelById = useMemo(() => {
    const m = new Map<number, string>()
    for (const u of uoms) m.set(u.id, `${u.code || u.id} - ${u.name || ''}`)
    return m
  }, [uoms])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    if (!qq) return rows
    return rows.filter((r) => `${r.code || ''} ${r.name || ''}`.toLowerCase().includes(qq))
  }, [q, rows])

  const columns: ColumnsType<ProductRow> = useMemo(
    () => [
      { title: 'ID', dataIndex: 'id', width: 90 },
      { title: 'Code', dataIndex: 'code', width: 160 },
      { title: 'Name', dataIndex: 'name' },
      {
        title: 'UoM',
        dataIndex: 'uomId',
        width: 220,
        render: (v: number) => uomLabelById.get(v) || v
      },
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
                form.setFieldsValue({ code: r.code, name: r.name, uomId: r.uomId, active: r.active })
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete product?"
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={async () => {
                if (!companyId) return
                try {
                  await masterDataApi.deleteProduct(companyId, r.id)
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
    [companyId, form, uomLabelById]
  )

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Products
          </Typography.Title>
          <Space>
            <Button onClick={() => loadCompanies()} loading={companyLoading}>
              Refresh Companies
            </Button>
            <Button onClick={() => companyId && loadUoms(companyId)} disabled={!companyId} loading={uomLoading}>
              Refresh UoMs
            </Button>
            <Button onClick={() => companyId && load(companyId)} disabled={!companyId} loading={loading}>
              Refresh
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setEditing(null)
                setOpen(true)
                form.setFieldsValue({ active: true })
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

          <Table<ProductRow> rowKey="id" loading={loading} columns={columns} dataSource={filtered} pagination={{ pageSize: 10 }} />
        </Space>
      </Card>

      <Modal
        title={editing ? 'Edit Product' : 'Create Product'}
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
              await masterDataApi.updateProduct(companyId, editing.id, values)
              message.success('Updated')
            } else {
              await masterDataApi.createProduct(companyId, values)
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
        <Form layout="vertical" form={form} initialValues={{ active: true }}>
          <Form.Item name="code" label="Code" rules={[{ required: true, message: 'Code is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="uomId" label="UoM" rules={[{ required: true, message: 'UoM is required' }]}>
            <Select
              loading={uomLoading}
              placeholder="Select UoM"
              options={uoms.map((u) => ({ value: u.id, label: `${u.code || u.id} - ${u.name || ''}` }))}
            />
          </Form.Item>
          <Form.Item name="active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}
