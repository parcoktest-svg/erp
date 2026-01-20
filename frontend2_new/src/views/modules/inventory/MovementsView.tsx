import { Button, Card, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { coreApi, inventoryApi, masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import { getApiErrorMessage } from '@/utils/error'

type CompanyRow = { id: number; code?: string; name?: string }

type OrgRow = { id: number; code?: string; name?: string }

type LocatorRow = { id: number; code?: string; name?: string }

type ProductRow = { id: number; code?: string; name?: string }

type MovementRow = {
  id: number
  documentNo?: string
  status?: string
  movementType?: 'IN' | 'OUT' | 'TRANSFER'
  movementDate?: string
  description?: string
  lines?: any[]
}

function toLocalDateString(d: any): string {
  if (!d) return ''
  return dayjs(d).format('YYYY-MM-DD')
}

export default function MovementsView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [lookupLoading, setLookupLoading] = useState(false)
  const [orgs, setOrgs] = useState<OrgRow[]>([])
  const [locators, setLocators] = useState<LocatorRow[]>([])
  const [products, setProducts] = useState<ProductRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<MovementRow[]>([])

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
      const [orgRes, locRes, prodRes] = await Promise.all([
        coreApi.listOrgs(cid),
        inventoryApi.listLocators(cid),
        masterDataApi.listProducts(cid)
      ])
      setOrgs(orgRes || [])
      setLocators(locRes || [])
      setProducts(prodRes || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load lookups'))
      setOrgs([])
      setLocators([])
      setProducts([])
    } finally {
      setLookupLoading(false)
    }
  }

  const load = async (cid: number) => {
    setLoading(true)
    try {
      const res = await inventoryApi.listMovements(cid)
      setRows(res || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load movements'))
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
    void load(companyId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: c.id, label: `${c.code || c.id} - ${c.name || ''}` })),
    [companies]
  )

  const orgOptions = useMemo(
    () => orgs.map((o) => ({ value: o.id, label: `${o.code || o.id} - ${o.name || ''}` })),
    [orgs]
  )

  const locatorOptions = useMemo(
    () => locators.map((l) => ({ value: l.id, label: `${l.code || l.id} - ${l.name || ''}` })),
    [locators]
  )

  const productOptions = useMemo(
    () => products.map((p) => ({ value: p.id, label: `${p.code || p.id} - ${p.name || ''}` })),
    [products]
  )

  const columns: ColumnsType<MovementRow> = [
    { title: 'Doc No', dataIndex: 'documentNo', width: 180 },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 140,
      render: (v: any) => {
        const s = String(v || '')
        if (s === 'DRAFTED') return <Tag>Drafted</Tag>
        if (s === 'COMPLETED') return <Tag color="green">Completed</Tag>
        if (s === 'VOIDED') return <Tag color="red">Voided</Tag>
        return <Tag>{s}</Tag>
      }
    },
    { title: 'Type', dataIndex: 'movementType', width: 120 },
    { title: 'Date', dataIndex: 'movementDate', width: 130 },
    { title: 'Description', dataIndex: 'description' }
  ]

  const lineColumns: ColumnsType<any> = [
    {
      title: 'Product',
      dataIndex: 'product',
      render: (p: any) => (p?.code ? `${p.code} - ${p.name || ''}` : p?.id || '-')
    },
    { title: 'Qty', dataIndex: 'qty', width: 120 },
    {
      title: 'From',
      dataIndex: 'fromLocator',
      render: (l: any) => (l?.code ? `${l.code} - ${l.name || ''}` : l?.id || '-')
    },
    {
      title: 'To',
      dataIndex: 'toLocator',
      render: (l: any) => (l?.code ? `${l.code} - ${l.name || ''}` : l?.id || '-')
    }
  ]

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Inventory Movements
          </Typography.Title>
          <Space>
            <Button onClick={() => companyId && loadLookups(companyId)} disabled={!companyId} loading={lookupLoading}>
              Refresh Lookups
            </Button>
            <Button onClick={() => companyId && load(companyId)} disabled={!companyId} loading={loading}>
              Refresh
            </Button>
            <Button
              type="primary"
              disabled={!companyId}
              onClick={() => {
                form.resetFields()
                form.setFieldsValue({
                  movementType: 'IN',
                  movementDate: dayjs(),
                  orgId: null,
                  lines: [{ productId: products[0]?.id ?? null, qty: 1, fromLocatorId: null, toLocatorId: null }]
                })
                setOpen(true)
              }}
            >
              New Movement
            </Button>
          </Space>
        </Space>
      </Card>

      <Card>
        <Space wrap style={{ width: '100%' }}>
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
        <Table<MovementRow>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={rows}
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (r) => (
              <Table
                size="small"
                rowKey={(x: any, idx) => String(x?.id || idx)}
                pagination={false}
                columns={lineColumns}
                dataSource={r.lines || []}
              />
            )
          }}
        />
      </Card>

      <Modal
        open={open}
        title="Create Inventory Movement"
        width={980}
        onCancel={() => setOpen(false)}
        onOk={async () => {
          if (!companyId) return
          try {
            const values = await form.validateFields()
            const movementType = values.movementType

            const payload: any = {
              movementType,
              movementDate: toLocalDateString(values.movementDate),
              description: values.description || null,
              orgId: values.orgId ?? null,
              lines: (values.lines || []).map((l: any) => ({
                productId: l.productId,
                qty: l.qty,
                fromLocatorId: l.fromLocatorId ?? null,
                toLocatorId: l.toLocatorId ?? null
              }))
            }
            if (!payload.orgId) delete payload.orgId

            await inventoryApi.createMovement(companyId, payload)
            message.success('Created')
            setOpen(false)
            await load(companyId)
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(getApiErrorMessage(e, 'Failed to create movement'))
          }
        }}
        okText="Create"
      >
        <Form layout="vertical" form={form}>
          <Space wrap style={{ width: '100%' }}>
            <Form.Item name="orgId" label="Org (optional)" style={{ width: 260 }}>
              <Select allowClear showSearch optionFilterProp="label" loading={lookupLoading} options={orgOptions} />
            </Form.Item>

            <Form.Item name="movementType" label="Movement Type" rules={[{ required: true }]} style={{ width: 220 }}>
              <Select
                options={[
                  { value: 'IN', label: 'IN' },
                  { value: 'OUT', label: 'OUT' },
                  { value: 'TRANSFER', label: 'TRANSFER' }
                ]}
              />
            </Form.Item>

            <Form.Item name="movementDate" label="Movement Date" rules={[{ required: true }]} style={{ width: 220 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="description" label="Description" style={{ width: 420 }}>
              <Input />
            </Form.Item>
          </Space>

          <Typography.Title level={5}>Lines</Typography.Title>
          <Form.List name="lines">
            {(fields, { add, remove }) => (
              <Space direction="vertical" style={{ width: '100%' }} size={8}>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline" wrap style={{ width: '100%' }}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'productId']}
                      label="Product"
                      rules={[{ required: true }]}
                      style={{ width: 360 }}
                    >
                      <Select showSearch optionFilterProp="label" loading={lookupLoading} options={productOptions} />
                    </Form.Item>

                    <Form.Item {...field} name={[field.name, 'qty']} label="Qty" rules={[{ required: true }]} style={{ width: 140 }}>
                      <InputNumber style={{ width: '100%' }} min={0.0001} />
                    </Form.Item>

                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const mt = form.getFieldValue('movementType')
                        const needFrom = mt === 'OUT' || mt === 'TRANSFER'
                        const needTo = mt === 'IN' || mt === 'TRANSFER'

                        return (
                          <>
                            <Form.Item
                              {...field}
                              name={[field.name, 'fromLocatorId']}
                              label="From Locator"
                              rules={needFrom ? [{ required: true }] : []}
                              style={{ width: 240 }}
                            >
                              <Select
                                allowClear={!needFrom}
                                showSearch
                                optionFilterProp="label"
                                loading={lookupLoading}
                                options={locatorOptions}
                                disabled={!needFrom}
                              />
                            </Form.Item>

                            <Form.Item
                              {...field}
                              name={[field.name, 'toLocatorId']}
                              label="To Locator"
                              rules={needTo ? [{ required: true }] : []}
                              style={{ width: 240 }}
                            >
                              <Select
                                allowClear={!needTo}
                                showSearch
                                optionFilterProp="label"
                                loading={lookupLoading}
                                options={locatorOptions}
                                disabled={!needTo}
                              />
                            </Form.Item>
                          </>
                        )
                      }}
                    </Form.Item>

                    <Button danger onClick={() => remove(field.name)} disabled={fields.length <= 1}>
                      Remove
                    </Button>
                  </Space>
                ))}

                <Button onClick={() => add({ productId: products[0]?.id ?? null, qty: 1 })}>Add Line</Button>
              </Space>
            )}
          </Form.List>
        </Form>
      </Modal>
    </Space>
  )
}
