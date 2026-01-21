import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message
} from 'antd'
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

type AdjustmentLineDto = {
  id?: number
  productId?: number
  locatorId?: number
  quantityOnHandBefore?: any
  quantityAdjusted?: any
  quantityOnHandAfter?: any
  adjustmentAmount?: any
  notes?: string
  productCode?: string
  productName?: string
  locatorCode?: string
  locatorName?: string
}

type AdjustmentRow = {
  id: number
  documentNo?: string
  status?: string
  adjustmentDate?: string
  description?: string
  orgId?: number | null
  journalEntryId?: number | null
  lines?: AdjustmentLineDto[]
}

function toLocalDateString(d: any): string {
  if (!d) return ''
  return dayjs(d).format('YYYY-MM-DD')
}

export default function AdjustmentsView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [lookupLoading, setLookupLoading] = useState(false)
  const [orgs, setOrgs] = useState<OrgRow[]>([])
  const [locators, setLocators] = useState<LocatorRow[]>([])
  const [products, setProducts] = useState<ProductRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<AdjustmentRow[]>([])

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AdjustmentRow | null>(null)
  const [saving, setSaving] = useState(false)
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
      const res = await inventoryApi.listAdjustments(cid)
      setRows(res || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load adjustments'))
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

  const productLabelById = useMemo(() => {
    const m = new Map<number, string>()
    for (const p of products) m.set(p.id, `${p.code || p.id} - ${p.name || ''}`)
    return m
  }, [products])

  const locatorLabelById = useMemo(() => {
    const m = new Map<number, string>()
    for (const l of locators) m.set(l.id, `${l.code || l.id} - ${l.name || ''}`)
    return m
  }, [locators])

  const columns: ColumnsType<AdjustmentRow> = [
    { title: 'Doc No', dataIndex: 'documentNo', width: 180 },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 150,
      render: (v: any) => {
        const s = String(v || '')
        if (s === 'DRAFTED') return <Tag>Drafted</Tag>
        if (s === 'COMPLETED') return <Tag color="green">Completed</Tag>
        if (s === 'VOIDED') return <Tag color="red">Voided</Tag>
        return <Tag>{s}</Tag>
      }
    },
    { title: 'Date', dataIndex: 'adjustmentDate', width: 130 },
    { title: 'Description', dataIndex: 'description' },
    {
      title: 'Actions',
      key: 'actions',
      width: 440,
      render: (_, r) => {
        const status = String(r.status || '')
        const canEdit = status === 'DRAFTED'
        const canDelete = status === 'DRAFTED'
        const canComplete = status === 'DRAFTED'
        const canVoid = status === 'DRAFTED'

        return (
          <Space wrap>
            <Button
              size="small"
              disabled={!canEdit}
              onClick={() => {
                setEditing(r)
                form.resetFields()
                form.setFieldsValue({
                  orgId: r.orgId ?? null,
                  adjustmentDate: r.adjustmentDate ? dayjs(r.adjustmentDate) : dayjs(),
                  description: r.description || '',
                  lines: (r.lines || []).map((ln) => ({
                    productId: ln.productId,
                    locatorId: ln.locatorId,
                    quantityAdjusted: ln.quantityAdjusted,
                    adjustmentAmount: ln.adjustmentAmount,
                    notes: ln.notes || ''
                  }))
                })
                if (!(r.lines || []).length) {
                  form.setFieldsValue({
                    lines: [{ productId: products[0]?.id ?? null, locatorId: locators[0]?.id ?? null, quantityAdjusted: 0, adjustmentAmount: 0 }]
                  })
                }
                setOpen(true)
              }}
            >
              Edit
            </Button>

            <Popconfirm
              title="Delete adjustment?"
              okText="Delete"
              okButtonProps={{ danger: true }}
              disabled={!canDelete}
              onConfirm={async () => {
                if (!companyId) return
                try {
                  await inventoryApi.deleteAdjustment(companyId, r.id)
                  message.success('Deleted')
                  await load(companyId)
                } catch (e: any) {
                  message.error(getApiErrorMessage(e, 'Failed to delete adjustment'))
                }
              }}
            >
              <Button size="small" danger disabled={!canDelete}>
                Delete
              </Button>
            </Popconfirm>

            <Popconfirm
              title="Complete adjustment?"
              okText="Complete"
              disabled={!canComplete}
              onConfirm={async () => {
                if (!companyId) return
                try {
                  await inventoryApi.completeAdjustment(companyId, r.id)
                  message.success('Completed')
                  await load(companyId)
                } catch (e: any) {
                  message.error(getApiErrorMessage(e, 'Failed to complete adjustment'))
                }
              }}
            >
              <Button size="small" type="primary" disabled={!canComplete}>
                Complete
              </Button>
            </Popconfirm>

            <Popconfirm
              title="Void adjustment?"
              okText="Void"
              okButtonProps={{ danger: true }}
              disabled={!canVoid}
              onConfirm={async () => {
                if (!companyId) return
                try {
                  await inventoryApi.voidAdjustment(companyId, r.id)
                  message.success('Voided')
                  await load(companyId)
                } catch (e: any) {
                  message.error(getApiErrorMessage(e, 'Failed to void adjustment'))
                }
              }}
            >
              <Button size="small" disabled={!canVoid}>
                Void
              </Button>
            </Popconfirm>

            <Button
              size="small"
              onClick={() => {
                Modal.info({
                  title: `Lines - ${r.documentNo || r.id}`,
                  width: 980,
                  content: (
                    <Table
                      size="small"
                      rowKey={(x: any, idx) => String(x?.id || idx)}
                      pagination={false}
                      columns={[
                        {
                          title: 'Product',
                          dataIndex: 'productId',
                          render: (v: any, ln: any) => ln?.productCode ? `${ln.productCode} - ${ln.productName || ''}` : productLabelById.get(Number(v)) || v
                        },
                        {
                          title: 'Locator',
                          dataIndex: 'locatorId',
                          render: (v: any, ln: any) => ln?.locatorCode ? `${ln.locatorCode} - ${ln.locatorName || ''}` : locatorLabelById.get(Number(v)) || v
                        },
                        { title: 'On Hand Before', dataIndex: 'quantityOnHandBefore', width: 140 },
                        { title: 'Qty Adjusted', dataIndex: 'quantityAdjusted', width: 130 },
                        { title: 'On Hand After', dataIndex: 'quantityOnHandAfter', width: 140 },
                        { title: 'Amount', dataIndex: 'adjustmentAmount', width: 120 },
                        { title: 'Notes', dataIndex: 'notes' }
                      ]}
                      dataSource={r.lines || []}
                    />
                  )
                })
              }}
            >
              Lines
            </Button>
          </Space>
        )
      }
    }
  ]

  const resetNew = () => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({
      orgId: null,
      adjustmentDate: dayjs(),
      description: '',
      lines: [{ productId: products[0]?.id ?? null, locatorId: locators[0]?.id ?? null, quantityAdjusted: 0, adjustmentAmount: 0, notes: '' }]
    })
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Inventory Adjustments
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
                resetNew()
                setOpen(true)
              }}
            >
              New Adjustment
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
        <Table<AdjustmentRow> rowKey="id" loading={loading} columns={columns} dataSource={rows} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        open={open}
        title={editing ? `Edit Adjustment - ${editing.documentNo || editing.id}` : 'Create Adjustment'}
        width={980}
        onCancel={() => setOpen(false)}
        onOk={async () => {
          if (!companyId) {
            message.error('Company is required')
            return
          }
          try {
            setSaving(true)
            const values = await form.validateFields()
            const payload: any = {
              adjustmentDate: toLocalDateString(values.adjustmentDate),
              description: values.description || null,
              orgId: values.orgId ?? null,
              lines: (values.lines || []).map((l: any) => ({
                productId: l.productId != null ? Number(l.productId) : null,
                locatorId: l.locatorId != null ? Number(l.locatorId) : null,
                quantityAdjusted: l.quantityAdjusted != null ? Number(l.quantityAdjusted) : null,
                adjustmentAmount: l.adjustmentAmount != null ? Number(l.adjustmentAmount) : null,
                notes: l.notes || null
              }))
            }
            if (payload.orgId == null) delete payload.orgId

            if (editing) {
              await inventoryApi.updateAdjustment(companyId, editing.id, payload)
              message.success('Updated')
            } else {
              await inventoryApi.createAdjustment(companyId, payload)
              message.success('Created')
            }
            setOpen(false)
            await load(companyId)
          } catch (e: any) {
            if (e?.errorFields) {
              message.error('Please complete required fields')
              return
            }
            // eslint-disable-next-line no-console
            console.error('Adjustment save failed:', e)
            message.error(getApiErrorMessage(e, editing ? 'Failed to update adjustment' : 'Failed to create adjustment'))
          } finally {
            setSaving(false)
          }
        }}
        okText={editing ? 'Update' : 'Create'}
        confirmLoading={saving}
      >
        <Form layout="vertical" form={form}>
          <Space wrap style={{ width: '100%' }}>
            <Form.Item name="orgId" label="Org (optional)" style={{ width: 260 }}>
              <Select allowClear showSearch optionFilterProp="label" loading={lookupLoading} options={orgOptions} />
            </Form.Item>

            <Form.Item name="adjustmentDate" label="Adjustment Date" rules={[{ required: true }]} style={{ width: 220 }}>
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
                      style={{ width: 340 }}
                    >
                      <Select showSearch optionFilterProp="label" loading={lookupLoading} options={productOptions} />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'locatorId']}
                      label="Locator"
                      rules={[{ required: true }]}
                      style={{ width: 260 }}
                    >
                      <Select showSearch optionFilterProp="label" loading={lookupLoading} options={locatorOptions} />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'quantityAdjusted']}
                      label="Qty Adjusted"
                      rules={[{ required: true }]}
                      style={{ width: 140 }}
                    >
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'adjustmentAmount']}
                      label="Amount"
                      rules={[{ required: true }]}
                      style={{ width: 140 }}
                    >
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item {...field} name={[field.name, 'notes']} label="Notes" style={{ width: 260 }}>
                      <Input />
                    </Form.Item>

                    <Button danger onClick={() => remove(field.name)} disabled={fields.length <= 1}>
                      Remove
                    </Button>
                  </Space>
                ))}

                <Button
                  onClick={() =>
                    add({ productId: products[0]?.id ?? null, locatorId: locators[0]?.id ?? null, quantityAdjusted: 0, adjustmentAmount: 0 })
                  }
                >
                  Add Line
                </Button>
              </Space>
            )}
          </Form.List>
        </Form>
      </Modal>
    </Space>
  )
}
