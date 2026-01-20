import { Button, Card, Form, Input, Modal, Select, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { coreApi, inventoryApi, masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import { getApiErrorMessage } from '@/utils/error'

type CompanyRow = { id: number; code?: string; name?: string }

type OrgRow = { id: number; code?: string; name?: string }

type WarehouseRow = { id: number; code?: string; name?: string }

type LocatorRow = { id: number; code?: string; name?: string; active?: boolean; warehouse?: any; org?: any }

export default function LocatorsView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [lookupLoading, setLookupLoading] = useState(false)
  const [orgs, setOrgs] = useState<OrgRow[]>([])
  const [warehouses, setWarehouses] = useState<WarehouseRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<LocatorRow[]>([])

  const [warehouseFilterId, setWarehouseFilterId] = useState<number | undefined>(undefined)

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

  const loadLookups = async (cid: number) => {
    setLookupLoading(true)
    try {
      const [orgRes, whRes] = await Promise.all([coreApi.listOrgs(cid), masterDataApi.listWarehouses(cid)])
      setOrgs(orgRes || [])
      setWarehouses(whRes || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load lookups'))
      setOrgs([])
      setWarehouses([])
    } finally {
      setLookupLoading(false)
    }
  }

  const load = async (cid: number, whId?: number) => {
    setLoading(true)
    try {
      const params = whId ? { warehouseId: whId } : undefined
      const res = await inventoryApi.listLocators(cid, params)
      setRows(res || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load locators'))
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
    void loadLookups(companyId)
    void load(companyId, warehouseFilterId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  useEffect(() => {
    if (!companyId) return
    void load(companyId, warehouseFilterId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warehouseFilterId])

  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: c.id, label: `${c.code || c.id} - ${c.name || ''}` })),
    [companies]
  )

  const orgOptions = useMemo(
    () => orgs.map((o) => ({ value: o.id, label: `${o.code || o.id} - ${o.name || ''}` })),
    [orgs]
  )

  const warehouseOptions = useMemo(
    () => warehouses.map((w: any) => ({ value: w.id, label: `${w.code || w.id} - ${w.name || ''}` })),
    [warehouses]
  )

  const columns: ColumnsType<LocatorRow> = [
    { title: 'ID', dataIndex: 'id', width: 90 },
    { title: 'Code', dataIndex: 'code', width: 160 },
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse',
      width: 260,
      render: (w: any) => (w?.code ? `${w.code} - ${w.name || ''}` : w?.id || '-')
    },
    {
      title: 'Org',
      dataIndex: 'org',
      width: 220,
      render: (o: any) => (o?.code ? `${o.code} - ${o.name || ''}` : o?.id || '-')
    },
    {
      title: 'Active',
      dataIndex: 'active',
      width: 100,
      render: (v: any) => (v ? <Tag color="green">YES</Tag> : <Tag color="red">NO</Tag>)
    }
  ]

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Locators
          </Typography.Title>
          <Space>
            <Button onClick={() => companyId && loadLookups(companyId)} disabled={!companyId} loading={lookupLoading}>
              Refresh Lookups
            </Button>
            <Button onClick={() => companyId && load(companyId, warehouseFilterId)} disabled={!companyId} loading={loading}>
              Refresh
            </Button>
            <Button
              type="primary"
              disabled={!companyId}
              onClick={() => {
                form.resetFields()
                form.setFieldsValue({ orgId: null, warehouseId: warehouseFilterId })
                setOpen(true)
              }}
            >
              New Locator
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

          <div style={{ minWidth: 320 }}>
            <Typography.Text strong>Warehouse Filter</Typography.Text>
            <Select
              style={{ width: '100%' }}
              allowClear
              loading={lookupLoading}
              value={warehouseFilterId}
              placeholder="All warehouses"
              options={warehouseOptions}
              onChange={(v) => setWarehouseFilterId(v)}
            />
          </div>
        </Space>
      </Card>

      <Card>
        <Table rowKey="id" loading={loading} columns={columns} dataSource={rows} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        open={open}
        title="Create Locator"
        onCancel={() => setOpen(false)}
        onOk={async () => {
          if (!companyId) return
          try {
            const values = await form.validateFields()
            const payload: any = {
              warehouseId: values.warehouseId,
              orgId: values.orgId ?? null,
              code: values.code,
              name: values.name
            }
            if (!payload.orgId) delete payload.orgId

            await inventoryApi.createLocator(companyId, payload)
            message.success('Created')
            setOpen(false)
            await load(companyId, warehouseFilterId)
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(getApiErrorMessage(e, 'Failed to create locator'))
          }
        }}
        okText="Create"
      >
        <Form form={form} layout="vertical" initialValues={{ orgId: null }}>
          <Form.Item name="warehouseId" label="Warehouse" rules={[{ required: true }]}>
            <Select showSearch optionFilterProp="label" loading={lookupLoading} options={warehouseOptions} />
          </Form.Item>

          <Form.Item name="orgId" label="Org (optional)">
            <Select allowClear showSearch optionFilterProp="label" loading={lookupLoading} options={orgOptions} />
          </Form.Item>

          <Form.Item name="code" label="Code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}
