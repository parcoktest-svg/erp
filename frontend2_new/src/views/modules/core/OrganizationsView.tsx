import { Button, Card, Form, Input, Modal, Select, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { coreApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'

type CompanyRow = {
  id: number
  code?: string
  name?: string
  active?: boolean
}

type OrgRow = {
  id: number
  companyId?: number
  code?: string
  name?: string
  active?: boolean
}

export default function OrganizationsView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<OrgRow[]>([])

  const [open, setOpen] = useState(false)
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

  const loadOrgs = async (cid: number) => {
    setLoading(true)
    try {
      const res = await coreApi.listOrgs(cid)
      setRows((res || []) as OrgRow[])
    } catch (e: any) {
      message.error(e?.message || 'Failed to load organizations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCompanies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (companyId) void loadOrgs(companyId)
  }, [companyId])

  const columns: ColumnsType<OrgRow> = useMemo(
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
            Organizations
          </Typography.Title>
          <Space>
            <Button onClick={() => loadCompanies()} loading={companyLoading}>
              Refresh Companies
            </Button>
            <Button onClick={() => companyId && loadOrgs(companyId)} disabled={!companyId} loading={loading}>
              Refresh Orgs
            </Button>
            <Button type="primary" onClick={() => setOpen(true)} disabled={!companyId}>
              New Org
            </Button>
          </Space>
        </Space>
      </Card>

      <Card>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <div>
            <Typography.Text strong>Company</Typography.Text>
          </div>
          <Select
            style={{ width: 420, maxWidth: '100%' }}
            loading={companyLoading}
            value={companyId ?? undefined}
            placeholder="Select company"
            options={companies.map((c) => ({ value: c.id, label: `${c.code || c.id} - ${c.name || ''}` }))}
            onChange={(v) => setCompanyId(v)}
          />

          <Table<OrgRow>
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={rows}
            pagination={{ pageSize: 10 }}
          />
        </Space>
      </Card>

      <Modal
        title="Create Organization"
        open={open}
        onCancel={() => {
          setOpen(false)
          form.resetFields()
        }}
        onOk={async () => {
          if (!companyId) return
          try {
            const values = await form.validateFields()
            await coreApi.createOrg(companyId, values)
            message.success('Organization created')
            setOpen(false)
            form.resetFields()
            await loadOrgs(companyId)
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(e?.message || 'Failed to create organization')
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
