import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { coreApi, masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import { getApiErrorMessage } from '@/utils/error'

type PartnerType = 'CUSTOMER' | 'VENDOR' | 'BOTH'

type CompanyRow = {
  id: number
  code?: string
  name?: string
  active?: boolean
}

type BusinessPartnerRow = {
  id: number
  name?: string
  type?: PartnerType
  email?: string
  phone?: string
  active?: boolean
}

export default function BusinessPartnersView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<BusinessPartnerRow[]>([])

  const [q, setQ] = useState('')
  const [typeFilter, setTypeFilter] = useState<PartnerType | undefined>(undefined)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<BusinessPartnerRow | null>(null)
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
      message.error(getApiErrorMessage(e, 'Failed to load companies'))
    } finally {
      setCompanyLoading(false)
    }
  }

  const load = async (cid: number) => {
    setLoading(true)
    try {
      const res = await masterDataApi.listBusinessPartners(cid)
      setRows((res || []) as BusinessPartnerRow[])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load business partners'))
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
    return rows.filter((r) => {
      if (typeFilter && r.type !== typeFilter) return false
      if (!qq) return true
      const s = `${r.name || ''} ${r.email || ''} ${r.phone || ''}`.toLowerCase()
      return s.includes(qq)
    })
  }, [q, rows, typeFilter])

  const columns: ColumnsType<BusinessPartnerRow> = useMemo(
    () => [
      { title: 'ID', dataIndex: 'id', width: 90 },
      { title: 'Name', dataIndex: 'name' },
      {
        title: 'Type',
        dataIndex: 'type',
        width: 140,
        render: (v: PartnerType) => {
          if (v === 'CUSTOMER') return <Tag color="blue">CUSTOMER</Tag>
          if (v === 'VENDOR') return <Tag color="purple">VENDOR</Tag>
          return <Tag color="geekblue">BOTH</Tag>
        }
      },
      { title: 'Email', dataIndex: 'email', width: 220 },
      { title: 'Phone', dataIndex: 'phone', width: 160 },
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
                form.setFieldsValue({
                  name: r.name,
                  type: r.type,
                  email: r.email,
                  phone: r.phone,
                  active: r.active
                })
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete business partner?"
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={async () => {
                if (!companyId) return
                try {
                  await masterDataApi.deleteBusinessPartner(companyId, r.id)
                  message.success('Deleted')
                  await load(companyId)
                } catch (e: any) {
                  message.error(getApiErrorMessage(e, 'Failed to delete'))
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
            Business Partners
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
                form.setFieldsValue({ active: true, type: 'CUSTOMER' })
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
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="name/email/phone" allowClear />
            </div>

            <div style={{ minWidth: 200 }}>
              <Typography.Text strong>Type</Typography.Text>
              <Select
                value={typeFilter}
                onChange={(v) => setTypeFilter(v)}
                allowClear
                placeholder="All"
                options={[
                  { value: 'CUSTOMER', label: 'CUSTOMER' },
                  { value: 'VENDOR', label: 'VENDOR' },
                  { value: 'BOTH', label: 'BOTH' }
                ]}
                style={{ width: '100%' }}
              />
            </div>
          </Space>

          <Table<BusinessPartnerRow>
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={filtered}
            pagination={{ pageSize: 10 }}
          />
        </Space>
      </Card>

      <Modal
        title={editing ? 'Edit Business Partner' : 'Create Business Partner'}
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
            const payload = {
              name: values.name,
              type: values.type,
              email: values.email,
              phone: values.phone,
              active: values.active ?? true
            }

            if (editing) {
              await masterDataApi.updateBusinessPartner(companyId, editing.id, payload)
              message.success('Updated')
            } else {
              await masterDataApi.createBusinessPartner(companyId, payload)
              message.success('Created')
            }

            setOpen(false)
            setEditing(null)
            form.resetFields()
            await load(companyId)
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(getApiErrorMessage(e, 'Failed to save'))
          }
        }}
        okText={editing ? 'Save' : 'Create'}
      >
        <Form layout="vertical" form={form} initialValues={{ active: true, type: 'CUSTOMER' }}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Type is required' }]}>
            <Select
              options={[
                { value: 'CUSTOMER', label: 'CUSTOMER' },
                { value: 'VENDOR', label: 'VENDOR' },
                { value: 'BOTH', label: 'BOTH' }
              ]}
            />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item name="active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}
