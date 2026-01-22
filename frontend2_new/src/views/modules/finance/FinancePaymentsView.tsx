import { Button, Card, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { coreApi, financeApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import { getApiErrorMessage } from '@/utils/error'

type CompanyRow = { id: number; code?: string; name?: string }

type InvoiceRow = {
  id: number
  documentNo?: string
  invoiceType?: string
  status?: string
  openAmount?: any
  businessPartnerId?: number
}

type PaymentRow = {
  id: number
  invoiceId?: number
  paymentDate?: string
  amount?: any
  description?: string
  status?: string
}

function toLocalDateString(d: any): string {
  if (!d) return ''
  return dayjs(d).format('YYYY-MM-DD')
}

export default function FinancePaymentsView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [lookupLoading, setLookupLoading] = useState(false)
  const [invoices, setInvoices] = useState<InvoiceRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<PaymentRow[]>([])

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
      const invRes = await financeApi.listInvoices(cid)
      setInvoices(invRes || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load invoices'))
      setInvoices([])
    } finally {
      setLookupLoading(false)
    }
  }

  const load = async (cid: number) => {
    setLoading(true)
    try {
      const res = await financeApi.listPayments(cid)
      setRows(res || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load payments'))
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

  const invoiceOptions = useMemo(
    () =>
      (invoices || []).map((i) => ({
        value: i.id,
        label: `${i.documentNo || i.id} (${i.invoiceType || ''}) Open=${i.openAmount ?? ''}`
      })),
    [invoices]
  )

  const columns: ColumnsType<PaymentRow> = [
    { title: 'ID', dataIndex: 'id', width: 90 },
    { title: 'Invoice', dataIndex: 'invoiceId', width: 120 },
    { title: 'Status', dataIndex: 'status', width: 120, render: (v: any) => <Tag>{String(v || '')}</Tag> },
    { title: 'Date', dataIndex: 'paymentDate', width: 130 },
    { title: 'Amount', dataIndex: 'amount', width: 140 },
    { title: 'Description', dataIndex: 'description' },
    {
      title: 'Actions',
      key: 'actions',
      width: 160,
      render: (_, r) => (
        <Button
          size="small"
          onClick={() => {
            setVoidId(r.id)
            voidForm.resetFields()
            voidForm.setFieldsValue({ voidDate: dayjs(), reason: '' })
            setVoidOpen(true)
          }}
        >
          Void
        </Button>
      )
    }
  ]

  const resetCreate = () => {
    createForm.resetFields()
    createForm.setFieldsValue({ invoiceId: invoices[0]?.id ?? null, paymentDate: dayjs(), amount: 0, description: '' })
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Payments
            </Typography.Title>
            <Typography.Text type="secondary">Create/void payments and link to invoices.</Typography.Text>
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
              New Payment
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
        <Table<PaymentRow> rowKey="id" loading={loading} columns={columns} dataSource={rows} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        open={createOpen}
        title="Create Payment"
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
              invoiceId: v.invoiceId != null ? Number(v.invoiceId) : null,
              paymentDate: toLocalDateString(v.paymentDate),
              amount: v.amount != null ? Number(v.amount) : null,
              description: v.description || null
            }
            await financeApi.createPayment(companyId, payload)
            message.success('Created')
            setCreateOpen(false)
            await Promise.all([loadLookups(companyId), load(companyId)])
          } catch (e: any) {
            if (e?.errorFields) {
              message.error('Please complete required fields')
              return
            }
            message.error(getApiErrorMessage(e, 'Failed to create payment'))
          } finally {
            setSaving(false)
          }
        }}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="invoiceId" label="Invoice" rules={[{ required: true }]}>
            <Select showSearch optionFilterProp="label" loading={lookupLoading} options={invoiceOptions} />
          </Form.Item>
          <Space wrap style={{ width: '100%' }}>
            <Form.Item name="paymentDate" label="Payment Date" rules={[{ required: true }]} style={{ width: 260 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="amount" label="Amount" rules={[{ required: true }]} style={{ width: 260 }}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Space>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={voidOpen}
        title="Void Payment"
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
            message.error('Payment id is missing')
            return
          }
          try {
            setVoiding(true)
            const v = await voidForm.validateFields()
            await financeApi.voidPayment(companyId, voidId, {
              voidDate: toLocalDateString(v.voidDate),
              reason: v.reason || null
            })
            message.success('Voided')
            setVoidOpen(false)
            setVoidId(null)
            await Promise.all([loadLookups(companyId), load(companyId)])
          } catch (e: any) {
            if (e?.errorFields) {
              message.error('Please complete required fields')
              return
            }
            message.error(getApiErrorMessage(e, 'Failed to void payment'))
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
