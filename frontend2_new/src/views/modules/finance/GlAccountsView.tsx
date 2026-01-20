import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { coreApi, financeApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import { getApiErrorMessage } from '@/utils/error'

type CompanyRow = { id: number; code?: string; name?: string }

type GlAccountRow = { id: number; code?: string; name?: string; type?: string; active?: boolean }

export default function GlAccountsView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<GlAccountRow[]>([])

  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  const loadCompanies = async () => {
    setCompanyLoading(true)
    try {
      const res = await coreApi.listCompanies()
      setCompanies(res || [])
      if (!companyId && Array.isArray(res) && res.length > 0) setCompanyId(res[0]?.id)
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load companies'))
    } finally {
      setCompanyLoading(false)
    }
  }

  const load = async (cid: number) => {
    setLoading(true)
    try {
      const res = await financeApi.listGlAccounts(cid)
      setRows(res || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load GL accounts'))
      setRows([])
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
    void load(companyId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: c.id, label: `${c.code || c.id} - ${c.name || ''}` })),
    [companies]
  )

  const columns: ColumnsType<GlAccountRow> = [
    { title: 'Code', dataIndex: 'code', width: 160 },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Type', dataIndex: 'type', width: 140 },
    {
      title: 'Active',
      dataIndex: 'active',
      width: 110,
      render: (v: any) => (v ? <Tag color="green">YES</Tag> : <Tag color="red">NO</Tag>)
    }
  ]

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            GL Accounts
          </Typography.Title>
          <Space>
            <Button onClick={() => companyId && load(companyId)} disabled={!companyId} loading={loading}>
              Refresh
            </Button>
            <Popconfirm
              title="Seed default GL accounts?"
              okText="Seed"
              onConfirm={async () => {
                if (!companyId) return
                try {
                  await financeApi.seedDefaultGlAccounts(companyId)
                  message.success('Seeded')
                  await load(companyId)
                } catch (e: any) {
                  message.error(getApiErrorMessage(e, 'Failed to seed default GL accounts'))
                }
              }}
            >
              <Button disabled={!companyId}>Seed Defaults</Button>
            </Popconfirm>
            <Button
              type="primary"
              disabled={!companyId}
              onClick={() => {
                form.resetFields()
                form.setFieldsValue({ active: true, type: 'ASSET' })
                setOpen(true)
              }}
            >
              New GL Account
            </Button>
          </Space>
        </Space>
      </Card>

      <Card>
        <Space wrap>
          <div style={{ minWidth: 320 }}>
            <Typography.Text strong>Company</Typography.Text>
            <Select
              style={{ width: '100%' }}
              loading={companyLoading}
              value={companyId ?? undefined}
              placeholder="Select company"
              options={companyOptions}
              onChange={(v) => setCompanyId(v)}
            />
          </div>
        </Space>
      </Card>

      <Card>
        <Table<GlAccountRow> rowKey="id" loading={loading} columns={columns} dataSource={rows} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        open={open}
        title="Create GL Account"
        onCancel={() => setOpen(false)}
        okText="Create"
        onOk={async () => {
          if (!companyId) return
          try {
            const values = await form.validateFields()
            const payload: any = {
              code: values.code,
              name: values.name,
              type: values.type,
              active: Boolean(values.active)
            }
            await financeApi.createGlAccount(companyId, payload)
            message.success('Created')
            setOpen(false)
            await load(companyId)
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(getApiErrorMessage(e, 'Failed to create GL account'))
          }
        }}
      >
        <Form form={form} layout="vertical" initialValues={{ active: true, type: 'ASSET' }}>
          <Form.Item name="code" label="Code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'ASSET', label: 'ASSET' },
                { value: 'LIABILITY', label: 'LIABILITY' },
                { value: 'EQUITY', label: 'EQUITY' },
                { value: 'REVENUE', label: 'REVENUE' },
                { value: 'EXPENSE', label: 'EXPENSE' }
              ]}
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
