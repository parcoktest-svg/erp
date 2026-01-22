import { Button, Card, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { coreApi, financeApi, masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import { getApiErrorMessage } from '@/utils/error'

type CompanyRow = { id: number; code?: string; name?: string }

function canCompleteInvoice(r: InvoiceRow) {
  return String(r.status || '') === 'DRAFTED'
}

function canVoidInvoice(r: InvoiceRow) {
  const s = String(r.status || '')
  const paid = Number(r.paidAmount || 0)
  return s !== 'VOIDED' && !(Number.isFinite(paid) && paid > 0)
}

type OrgRow = { id: number; code?: string; name?: string }

type BusinessPartnerRow = { id: number; code?: string; name?: string }

type ProductRow = { id: number; code?: string; name?: string }

type TaxRateRow = { id: number; name?: string; rate?: any }

type InvoiceLineDto = { id?: number; productId?: number; qty?: any; price?: any; lineNet?: any }

type InvoiceRow = {
  id: number
  orgId?: number
  businessPartnerId?: number
  salesOrderId?: number
  invoiceType?: 'AR' | 'AP'
  taxRateId?: number
  documentNo?: string
  status?: string
  invoiceDate?: string
  totalNet?: any
  totalTax?: any
  grandTotal?: any
  paidAmount?: any
  openAmount?: any
  lines?: InvoiceLineDto[]
  taxLines?: any[]
}

function toLocalDateString(d: any): string {
  if (!d) return ''
  return dayjs(d).format('YYYY-MM-DD')
}

export default function FinanceInvoicesView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [searchParams] = useSearchParams()
  const [salesOrderId, setSalesOrderId] = useState<number | null>(null)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [lookupLoading, setLookupLoading] = useState(false)
  const [orgs, setOrgs] = useState<OrgRow[]>([])
  const [bps, setBps] = useState<BusinessPartnerRow[]>([])
  const [products, setProducts] = useState<ProductRow[]>([])
  const [taxRates, setTaxRates] = useState<TaxRateRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<InvoiceRow[]>([])

  const [createOpen, setCreateOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [createForm] = Form.useForm()

  const [voidOpen, setVoidOpen] = useState(false)
  const [voiding, setVoiding] = useState(false)
  const [voidId, setVoidId] = useState<number | null>(null)
  const [voidForm] = Form.useForm()

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
      const [orgRes, bpRes, prodRes, taxRes] = await Promise.all([
        coreApi.listOrgs(cid),
        masterDataApi.listBusinessPartners(cid),
        masterDataApi.listProducts(cid),
        masterDataApi.listTaxRates(cid)
      ])
      setOrgs(orgRes || [])
      setBps(bpRes || [])
      setProducts(prodRes || [])
      setTaxRates(taxRes || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load lookups'))
      setOrgs([])
      setBps([])
      setProducts([])
      setTaxRates([])
    } finally {
      setLookupLoading(false)
    }
  }

  const load = async (cid: number) => {
    setLoading(true)
    try {
      const res = await financeApi.listInvoices(cid)
      const list: InvoiceRow[] = (res || []) as any
      if (salesOrderId) {
        setRows((list || []).filter((x: any) => Number(x?.salesOrderId) === Number(salesOrderId)))
      } else {
        setRows(list || [])
      }
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load invoices'))
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
    const so = searchParams.get('salesOrderId')
    if (so) {
      const n = Number(so)
      if (Number.isFinite(n)) setSalesOrderId(n)
    } else {
      setSalesOrderId(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    if (!companyId) return
    void loadLookups(companyId)
    void load(companyId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  useEffect(() => {
    if (!companyId) return
    void load(companyId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, salesOrderId])

  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: c.id, label: `${c.code || c.id} - ${c.name || ''}` })),
    [companies]
  )

  const orgOptions = useMemo(
    () => orgs.map((o) => ({ value: o.id, label: `${o.code || o.id} - ${o.name || ''}` })),
    [orgs]
  )

  const bpOptions = useMemo(
    () => bps.map((b) => ({ value: b.id, label: `${b.code || b.id} - ${b.name || ''}` })),
    [bps]
  )

  const productOptions = useMemo(
    () => products.map((p) => ({ value: p.id, label: `${p.code || p.id} - ${p.name || ''}` })),
    [products]
  )

  const taxRateOptions = useMemo(
    () =>
      (taxRates || []).map((t) => ({
        value: t.id,
        label: `${t.name || t.id}${t.rate != null ? ` (${t.rate}%)` : ''}`
      })),
    [taxRates]
  )

  const columns: ColumnsType<InvoiceRow> = [
    { title: 'Doc No', dataIndex: 'documentNo', width: 170 },
    { title: 'Type', dataIndex: 'invoiceType', width: 90 },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: (v: any) => {
        const s = String(v || '')
        if (s === 'DRAFTED') return <Tag color="default">Draft</Tag>
        if (s === 'COMPLETED') return <Tag color="green">Completed</Tag>
        if (s === 'VOIDED') return <Tag color="red">Voided</Tag>
        return <Tag>{s}</Tag>
      }
    },
    { title: 'Date', dataIndex: 'invoiceDate', width: 130 },
    { title: 'BP', dataIndex: 'businessPartnerId', width: 120 },
    { title: 'Total', dataIndex: 'grandTotal', width: 140 },
    { title: 'Paid', dataIndex: 'paidAmount', width: 140 },
    { title: 'Open', dataIndex: 'openAmount', width: 140 },
    {
      title: 'Actions',
      key: 'actions',
      width: 320,
      render: (_, r) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              Modal.info({
                title: `Invoice Lines - ${r.documentNo || r.id}`,
                width: 900,
                content: (
                  <Table
                    size="small"
                    rowKey={(x: any, idx) => String(x?.id || idx)}
                    pagination={false}
                    columns={[
                      { title: 'Product', dataIndex: 'productId' },
                      { title: 'Qty', dataIndex: 'qty', width: 120 },
                      { title: 'Price', dataIndex: 'price', width: 120 },
                      { title: 'Line Net', dataIndex: 'lineNet', width: 140 }
                    ]}
                    dataSource={r.lines || []}
                  />
                )
              })
            }}
          >
            Lines
          </Button>
          <Popconfirm
            title="Complete this invoice?"
            okText="Complete"
            cancelText="Cancel"
            disabled={!companyId || !canCompleteInvoice(r)}
            onConfirm={async () => {
              if (!companyId) return
              try {
                await financeApi.completeInvoice(companyId, r.id)
                message.success('Completed')
                await load(companyId)
              } catch (e: any) {
                message.error(getApiErrorMessage(e, 'Failed to complete invoice'))
              }
            }}
          >
            <Button size="small" type="primary" disabled={!companyId || !canCompleteInvoice(r)}>
              Complete
            </Button>
          </Popconfirm>
          <Button
            size="small"
            disabled={!canVoidInvoice(r)}
            onClick={() => {
              setVoidId(r.id)
              voidForm.resetFields()
              voidForm.setFieldsValue({ voidDate: dayjs(), reason: '' })
              setVoidOpen(true)
            }}
          >
            Void
          </Button>
        </Space>
      )
    }
  ]

  const resetCreate = () => {
    createForm.resetFields()
    createForm.setFieldsValue({
      orgId: null,
      invoiceType: 'AR',
      taxRateId: null,
      invoiceDate: dayjs(),
      lines: [{ productId: products[0]?.id ?? null, qty: 1, price: 0 }]
    })
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Invoices
            </Typography.Title>
            <Typography.Text type="secondary">Create/void AR/AP invoices and track open amounts.</Typography.Text>
          </div>
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
                resetCreate()
                setCreateOpen(true)
              }}
            >
              New Invoice
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
        <Table<InvoiceRow> rowKey="id" loading={loading} columns={columns} dataSource={rows} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        open={createOpen}
        title="Create Invoice"
        width={980}
        okText="Create"
        confirmLoading={saving}
        onCancel={() => setCreateOpen(false)}
        onOk={async () => {
          if (!companyId) {
            message.error('Company is required')
            return
          }
          try {
            setSaving(true)
            const v = await createForm.validateFields()
            const payload: any = {
              orgId: v.orgId ?? null,
              businessPartnerId: v.businessPartnerId != null ? Number(v.businessPartnerId) : null,
              invoiceType: v.invoiceType,
              taxRateId: v.taxRateId != null ? Number(v.taxRateId) : null,
              invoiceDate: toLocalDateString(v.invoiceDate),
              lines: (v.lines || []).map((ln: any) => ({
                productId: ln.productId != null ? Number(ln.productId) : null,
                qty: ln.qty != null ? Number(ln.qty) : null,
                price: ln.price != null ? Number(ln.price) : null
              }))
            }
            if (payload.orgId == null) delete payload.orgId
            if (payload.taxRateId == null) delete payload.taxRateId

            await financeApi.createInvoice(companyId, payload)
            message.success('Created')
            setCreateOpen(false)
            await load(companyId)
          } catch (e: any) {
            if (e?.errorFields) {
              message.error('Please complete required fields')
              return
            }
            message.error(getApiErrorMessage(e, 'Failed to create invoice'))
          } finally {
            setSaving(false)
          }
        }}
      >
        <Form form={createForm} layout="vertical">
          <Space wrap style={{ width: '100%' }}>
            <Form.Item name="orgId" label="Org (optional)" style={{ width: 260 }}>
              <Select allowClear showSearch optionFilterProp="label" loading={lookupLoading} options={orgOptions} />
            </Form.Item>
            <Form.Item name="invoiceType" label="Invoice Type" rules={[{ required: true }]} style={{ width: 180 }}>
              <Select options={[{ value: 'AR', label: 'AR' }, { value: 'AP', label: 'AP' }]} />
            </Form.Item>
            <Form.Item name="invoiceDate" label="Invoice Date" rules={[{ required: true }]} style={{ width: 220 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="taxRateId" label="Tax Rate (optional)" style={{ width: 260 }}>
              <Select allowClear showSearch optionFilterProp="label" loading={lookupLoading} options={taxRateOptions} />
            </Form.Item>
          </Space>

          <Form.Item name="businessPartnerId" label="Business Partner" rules={[{ required: true }]}>
            <Select showSearch optionFilterProp="label" loading={lookupLoading} options={bpOptions} />
          </Form.Item>

          <Typography.Title level={5}>Lines</Typography.Title>
          <Form.List name="lines">
            {(fields, { add, remove }) => (
              <Space direction="vertical" style={{ width: '100%' }} size={8}>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline" wrap style={{ width: '100%' }}>
                    <Form.Item {...field} name={[field.name, 'productId']} label="Product" rules={[{ required: true }]} style={{ width: 420 }}>
                      <Select showSearch optionFilterProp="label" loading={lookupLoading} options={productOptions} />
                    </Form.Item>
                    <Form.Item {...field} name={[field.name, 'qty']} label="Qty" rules={[{ required: true }]} style={{ width: 160 }}>
                      <InputNumber style={{ width: '100%' }} min={0.0001} />
                    </Form.Item>
                    <Form.Item {...field} name={[field.name, 'price']} label="Price" rules={[{ required: true }]} style={{ width: 180 }}>
                      <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Button danger onClick={() => remove(field.name)} disabled={fields.length <= 1}>
                      Remove
                    </Button>
                  </Space>
                ))}
                <Button onClick={() => add({ productId: products[0]?.id ?? null, qty: 1, price: 0 })}>Add Line</Button>
              </Space>
            )}
          </Form.List>
        </Form>
      </Modal>

      <Modal
        open={voidOpen}
        title="Void Invoice"
        okText="Void"
        okButtonProps={{ danger: true }}
        confirmLoading={voiding}
        onCancel={() => {
          setVoidOpen(false)
          setVoidId(null)
        }}
        onOk={async () => {
          if (!companyId) {
            message.error('Company is required')
            return
          }
          if (voidId == null) {
            message.error('Invoice id is missing')
            return
          }
          try {
            setVoiding(true)
            const v = await voidForm.validateFields()
            await financeApi.voidInvoice(companyId, voidId, {
              voidDate: toLocalDateString(v.voidDate),
              reason: v.reason || null
            })
            message.success('Voided')
            setVoidOpen(false)
            setVoidId(null)
            await load(companyId)
          } catch (e: any) {
            if (e?.errorFields) {
              message.error('Please complete required fields')
              return
            }
            message.error(getApiErrorMessage(e, 'Failed to void invoice'))
          } finally {
            setVoiding(false)
          }
        }}
      >
        <Form layout="vertical" form={voidForm}>
          <Form.Item name="voidDate" label="Void Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="reason" label="Reason">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}
