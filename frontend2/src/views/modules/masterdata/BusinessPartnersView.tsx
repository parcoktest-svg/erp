import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import CompanyOrgBar from '@/views/modules/common/CompanyOrgBar'

type PartnerType = 'CUSTOMER' | 'VENDOR' | 'BOTH'

type BusinessPartnerRow = {
  id: number
  code?: string
  name?: string
  type?: PartnerType
  email?: string
  phone?: string
  active?: boolean
}

export default function BusinessPartnersView() {
  const companyId = useContextStore((s) => s.companyId)

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<BusinessPartnerRow[]>([])

  const [q, setQ] = useState('')
  const [typeFilter, setTypeFilter] = useState<PartnerType | undefined>(undefined)

  const [createOpen, setCreateOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [createForm] = Form.useForm()

  const [editOpen, setEditOpen] = useState(false)
  const [editSaving, setEditSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm] = Form.useForm()

  async function load() {
    if (!companyId) {
      setRows([])
      return
    }
    setLoading(true)
    try {
      setRows((await masterDataApi.listBusinessPartners(companyId)) || [])
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || 'Failed')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return (rows || []).filter((r) => {
      if (typeFilter && r.type !== typeFilter) return false
      if (!qq) return true
      return (
        String(r.name || '').toLowerCase().includes(qq) ||
        String(r.email || '').toLowerCase().includes(qq) ||
        String(r.phone || '').toLowerCase().includes(qq)
      )
    })
  }, [q, rows, typeFilter])

  function openCreate() {
    createForm.setFieldsValue({ type: 'CUSTOMER', name: '', email: '', phone: '' })
    setCreateOpen(true)
  }

  function openEdit(row: BusinessPartnerRow) {
    if (!row?.id) return
    setEditingId(row.id)
    editForm.setFieldsValue({
      type: row.type || 'CUSTOMER',
      name: row.name || '',
      email: row.email || '',
      phone: row.phone || '',
      active: Boolean(row.active)
    })
    setEditOpen(true)
  }

  async function saveCreate() {
    if (!companyId) return
    const values = await createForm.validateFields()
    setSaving(true)
    try {
      await masterDataApi.createBusinessPartner(companyId, {
        type: values.type,
        name: values.name,
        email: String(values.email || '').trim() || null,
        phone: String(values.phone || '').trim() || null
      })
      message.success('Business Partner created')
      setCreateOpen(false)
      await load()
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || 'Failed')
    } finally {
      setSaving(false)
    }
  }

  async function saveEdit() {
    if (!companyId || !editingId) return
    const values = await editForm.validateFields()
    setEditSaving(true)
    try {
      await masterDataApi.updateBusinessPartner(companyId, editingId, {
        type: values.type,
        name: values.name,
        email: String(values.email || '').trim() || null,
        phone: String(values.phone || '').trim() || null,
        active: Boolean(values.active)
      })
      message.success('Business Partner updated')
      setEditOpen(false)
      await load()
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || 'Failed')
    } finally {
      setEditSaving(false)
    }
  }

  async function onDelete(row: BusinessPartnerRow) {
    if (!companyId || !row?.id) return
    try {
      await masterDataApi.deleteBusinessPartner(companyId, row.id)
      message.success('Business Partner deleted')
      await load()
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || 'Failed')
    }
  }

  const columns: ColumnsType<BusinessPartnerRow> = [
    { title: 'ID', dataIndex: 'id', width: 90 },
    { title: 'Name', dataIndex: 'name', width: 260 },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 120,
      render: (v) => <Tag>{String(v || '')}</Tag>
    },
    { title: 'Email', dataIndex: 'email', width: 240 },
    { title: 'Phone', dataIndex: 'phone', width: 160 },
    {
      title: 'Active',
      dataIndex: 'active',
      width: 100,
      render: (v) => <Tag color={v ? 'green' : 'default'}>{v ? 'Yes' : 'No'}</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      width: 220,
      render: (_, r) => (
        <Space>
          <Button size="small" disabled={!companyId} onClick={() => openEdit(r)}>
            Edit
          </Button>
          <Popconfirm
            title={`Delete Business Partner "${r.name || ''}"?`}
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => onDelete(r)}
            disabled={!companyId}
          >
            <Button size="small" danger disabled={!companyId}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>Business Partners</div>
              <div style={{ color: '#606266' }}>Customer, Vendor, atau keduanya (BOTH).</div>
            </div>
            <Button type="primary" disabled={!companyId} onClick={openCreate}>
              Create Business Partner
            </Button>
          </div>

          <CompanyOrgBar showOrg={false} />
        </div>
      </Card>

      <Card>
        {!companyId ? <Tag color="orange">Pilih company dulu.</Tag> : null}

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name/email/phone"
            allowClear
            style={{ maxWidth: 360 }}
          />
          <Select
            allowClear
            placeholder="Filter type"
            style={{ width: 220 }}
            value={typeFilter}
            options={[
              { label: 'CUSTOMER', value: 'CUSTOMER' },
              { label: 'VENDOR', value: 'VENDOR' },
              { label: 'BOTH', value: 'BOTH' }
            ]}
            onChange={(v) => setTypeFilter(v)}
          />
          <Button onClick={() => void load()} disabled={!companyId}>
            Refresh
          </Button>
        </div>

        <Table rowKey="id" dataSource={filtered} columns={columns} loading={loading} scroll={{ x: 1100 }} />
      </Card>

      <Modal
        open={createOpen}
        title="Create Business Partner"
        width={640}
        onCancel={() => setCreateOpen(false)}
        onOk={() => void saveCreate()}
        okButtonProps={{ loading: saving }}
      >
        <Form form={createForm} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: 'CUSTOMER', value: 'CUSTOMER' },
                  { label: 'VENDOR', value: 'VENDOR' },
                  { label: 'BOTH', value: 'BOTH' }
                ]}
              />
            </Form.Item>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. PT Vendor A" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="email" label="Email">
              <Input placeholder="optional" />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input placeholder="optional" />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal
        open={editOpen}
        title={
          <Space>
            <Typography.Text>Edit Business Partner</Typography.Text>
            {editingId ? <Tag>#{editingId}</Tag> : null}
          </Space>
        }
        width={640}
        onCancel={() => setEditOpen(false)}
        onOk={() => void saveEdit()}
        okButtonProps={{ loading: editSaving }}
      >
        <Form form={editForm} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: 'CUSTOMER', value: 'CUSTOMER' },
                  { label: 'VENDOR', value: 'VENDOR' },
                  { label: 'BOTH', value: 'BOTH' }
                ]}
              />
            </Form.Item>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. PT Vendor A" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="email" label="Email">
              <Input placeholder="optional" />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input placeholder="optional" />
            </Form.Item>
          </div>

          <Form.Item name="active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
