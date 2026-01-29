import { Button, Card, DatePicker, Descriptions, Form, Input, InputNumber, Modal, Select, Space, Table, Tabs, Typography, message } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import StatusBadge from '@/components/StatusBadge'
import DataTable from '@/components/DataTable'
import { financeApi, inventoryApi, masterDataApi, purchaseApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import { getApiErrorMessage } from '@/utils/error'

type PurchaseOrderRow = {
  id: number
  documentNo?: string
  status?: string
  orderDate?: string
  vendorId?: number
  orgId?: number | null
  totalNet?: any
  totalTax?: any
  grandTotal?: any
  lines?: any[]
}

export default function PurchaseOrderDetailView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const companyId = useContextStore((s) => s.companyId)

  const [loading, setLoading] = useState(false)
  const [po, setPo] = useState<PurchaseOrderRow | null>(null)

  const [docsLoading, setDocsLoading] = useState(false)
  const [receipts, setReceipts] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])

  const [approveLoading, setApproveLoading] = useState(false)

  const [receiptOpen, setReceiptOpen] = useState(false)
  const [receiptSaving, setReceiptSaving] = useState(false)
  const [receiptForm] = Form.useForm()

  const [receiptResultOpen, setReceiptResultOpen] = useState(false)
  const [createdReceiptMovement, setCreatedReceiptMovement] = useState<any | null>(null)
  const [receiptCompleting, setReceiptCompleting] = useState(false)

  const [billOpen, setBillOpen] = useState(false)
  const [billSaving, setBillSaving] = useState(false)
  const [billForm] = Form.useForm()

  const [voidOpen, setVoidOpen] = useState(false)
  const [voidSaving, setVoidSaving] = useState(false)
  const [voidForm] = Form.useForm()

  const [locatorOptionsLoading, setLocatorOptionsLoading] = useState(false)
  const [locatorOptions, setLocatorOptions] = useState<any[]>([])

  const [taxRateOptionsLoading, setTaxRateOptionsLoading] = useState(false)
  const [taxRateOptions, setTaxRateOptions] = useState<any[]>([])

  const load = async (cid: number, poId: number) => {
    setLoading(true)
    try {
      const res = await purchaseApi.getPurchaseOrder(cid, poId)
      setPo(res as PurchaseOrderRow)
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load purchase order'))
      setPo(null)
    } finally {
      setLoading(false)
    }

  }

  const loadLocators = async (cid: number) => {
    setLocatorOptionsLoading(true)
    try {
      const res = await inventoryApi.listLocators(cid)
      setLocatorOptions(
        ((res || []) as any[]).map((x) => ({
          value: x.id,
          label: `${x.code || x.id} - ${x.name || ''}`.trim()
        }))
      )
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load locators'))
      setLocatorOptions([])
    } finally {
      setLocatorOptionsLoading(false)
    }
  }

  const loadTaxRates = async (cid: number) => {
    setTaxRateOptionsLoading(true)
    try {
      const res = await masterDataApi.listTaxRates(cid)
      setTaxRateOptions(
        ((res || []) as any[]).map((x) => ({
          value: x.id,
          label: `${x.name || x.id}`
        }))
      )
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load tax rates'))
      setTaxRateOptions([])
    } finally {
      setTaxRateOptionsLoading(false)
    }
  }

  const loadDocuments = async (cid: number, poId: number) => {
    setDocsLoading(true)
    try {
      const [moves, invs] = await Promise.all([
        inventoryApi.listMovements(cid, { purchaseOrderId: poId, movementType: 'IN' }),
        financeApi.listInvoices(cid, { purchaseOrderId: poId })
      ])
      setReceipts((moves || []) as any[])
      setInvoices((invs || []) as any[])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load documents'))
      setReceipts([])
      setInvoices([])
    } finally {
      setDocsLoading(false)
    }
  }

  useEffect(() => {
    const poId = Number(id)
    if (!companyId || !poId) return
    void load(companyId, poId)
    void loadDocuments(companyId, poId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, id])

  const canApprove = String(po?.status || '') === 'DRAFTED'
  const canVoid = ['DRAFTED', 'APPROVED'].includes(String(po?.status || ''))
  const canReceipt = ['APPROVED', 'PARTIALLY_COMPLETED'].includes(String(po?.status || ''))

  const hasRemainingToReceive = (po?.lines || []).some((l: any) => {
    const ordered = Number(l?.qty ?? 0)
    const received = Number(l?.receivedQty ?? 0)
    return ordered - received > 0
  })

  const hasRemainingToInvoice = (po?.lines || []).some((l: any) => {
    const received = Number(l?.receivedQty ?? 0)
    const invoiced = Number(l?.invoicedQty ?? 0)
    return received - invoiced > 0
  })

  const canCreateReceipt = canReceipt && hasRemainingToReceive
  const canCreateInvoice = ['APPROVED', 'PARTIALLY_COMPLETED', 'COMPLETED'].includes(String(po?.status || '')) && hasRemainingToInvoice

  const lineColumns = [
    { title: 'Product', dataIndex: 'productId', width: 120 },
    { title: 'Qty', dataIndex: 'qty', width: 90, align: 'right' as const },
    { title: 'Received', dataIndex: 'receivedQty', width: 100, align: 'right' as const },
    { title: 'Invoiced', dataIndex: 'invoicedQty', width: 100, align: 'right' as const },
    { title: 'Price', dataIndex: 'price', width: 120, align: 'right' as const },
    { title: 'Line Net', dataIndex: 'lineNet', width: 120, align: 'right' as const }
  ]

  const receiptColumns = [
    { title: 'Document No', dataIndex: 'documentNo', width: 180 },
    { title: 'Status', dataIndex: 'status', width: 140 },
    { title: 'Type', dataIndex: 'movementType', width: 100 },
    { title: 'Date', dataIndex: 'movementDate', width: 120 },
    { title: 'Description', dataIndex: 'description' }
  ]

  const invoiceColumns = [
    { title: 'Document No', dataIndex: 'documentNo', width: 180 },
    { title: 'Type', dataIndex: 'invoiceType', width: 90 },
    { title: 'Status', dataIndex: 'status', width: 120 },
    { title: 'Date', dataIndex: 'invoiceDate', width: 120 },
    { title: 'Grand Total', dataIndex: 'grandTotal', width: 140, align: 'right' as const, render: (v: any) => (v == null ? '-' : Number(v).toLocaleString()) }
  ]

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card loading={loading}>
        <PageHeader
          title={`Purchase Order ${po?.documentNo || ''}`.trim()}
          subtitle={po?.status ? `Status: ${po.status}` : undefined}
          onBack={() => navigate('/modules/purchase/purchase-orders')}
          extra={
            <Space wrap>
              {po?.status ? <StatusBadge status={po.status} /> : null}

              <Button
                type="primary"
                loading={approveLoading}
                disabled={!canApprove}
                onClick={() => {
                  if (!companyId || !po?.id) return
                  Modal.confirm({
                    title: 'Approve Purchase Order?',
                    okText: 'Approve',
                    onOk: async () => {
                      try {
                        setApproveLoading(true)
                        await purchaseApi.approvePurchaseOrder(companyId, po.id)
                        message.success('Purchase Order approved')
                        await load(companyId, po.id)
                      } catch (e: any) {
                        message.error(getApiErrorMessage(e, 'Failed to approve purchase order'))
                      } finally {
                        setApproveLoading(false)
                      }
                    }
                  })
                }}
              >
                Approve
              </Button>

              <Button
                disabled={!canCreateReceipt}
                onClick={async () => {
                  if (!companyId || !po?.id) return
                  if (!canCreateReceipt) return
                  if (locatorOptions.length === 0) await loadLocators(companyId)

                  const defaultLines = (po?.lines || [])
                    .map((ln: any) => {
                      const ordered = Number(ln?.qty ?? 0)
                      const received = Number(ln?.receivedQty ?? 0)
                      const remaining = Math.max(0, ordered - received)
                      return {
                        purchaseOrderLineId: ln.id,
                        productId: ln.productId,
                        orderedQty: ordered,
                        receivedQty: received,
                        remainingQty: remaining,
                        qty: remaining
                      }
                    })
                    .filter((x: any) => x.remainingQty > 0)

                  receiptForm.setFieldsValue({
                    toLocatorId: undefined,
                    movementDate: dayjs(),
                    description: undefined,
                    lines: defaultLines
                  })
                  setReceiptOpen(true)
                }}
              >
                Create Receipt
              </Button>

              <Button
                disabled={!canCreateInvoice}
                onClick={async () => {
                  if (!companyId || !po?.id) return
                  if (!canCreateInvoice) return
                  if (taxRateOptions.length === 0) await loadTaxRates(companyId)

                  const defaultLines = (po?.lines || [])
                    .map((ln: any) => {
                      const received = Number(ln?.receivedQty ?? 0)
                      const invoiced = Number(ln?.invoicedQty ?? 0)
                      const remaining = Math.max(0, received - invoiced)
                      return {
                        purchaseOrderLineId: ln.id,
                        productId: ln.productId,
                        receivedQty: received,
                        invoicedQty: invoiced,
                        remainingQty: remaining,
                        qty: remaining
                      }
                    })
                    .filter((x: any) => x.remainingQty > 0)

                  billForm.setFieldsValue({
                    invoiceDate: dayjs(),
                    taxRateId: undefined,
                    lines: defaultLines
                  })
                  setBillOpen(true)
                }}
              >
                Create Invoice
              </Button>

              <Button
                danger
                disabled={!canVoid}
                onClick={() => {
                  if (!companyId || !po?.id) return
                  if (!canVoid) return
                  voidForm.setFieldsValue({ voidDate: dayjs(), reason: undefined })
                  setVoidOpen(true)
                }}
              >
                Void
              </Button>
            </Space>
          }
        />
      </Card>

      <Card loading={loading}>
        <Descriptions column={3} size="small" bordered>
          <Descriptions.Item label="Document No">{po?.documentNo || '-'}</Descriptions.Item>
          <Descriptions.Item label="Status">{po?.status ? <StatusBadge status={po.status} /> : '-'}</Descriptions.Item>
          <Descriptions.Item label="Order Date">{po?.orderDate || '-'}</Descriptions.Item>
          <Descriptions.Item label="Vendor Id">{po?.vendorId ?? '-'}</Descriptions.Item>
          <Descriptions.Item label="Org Id">{po?.orgId ?? '-'}</Descriptions.Item>
          <Descriptions.Item label="Grand Total">{po?.grandTotal == null ? '-' : Number(po.grandTotal).toLocaleString()}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card loading={loading}>
        <Tabs
          items={[
            {
              key: 'lines',
              label: 'Lines',
              children: <DataTable rowKey={(r: any) => r.id || `${r.productId}`} dataSource={po?.lines || []} columns={lineColumns} />
            },
            {
              key: 'receipt',
              label: 'Receipts (GRN)',
              children: (
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <Space wrap style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Typography.Text type="secondary">Goods receipts generated from this Purchase Order.</Typography.Text>
                    <Button
                      onClick={async () => {
                        if (!companyId || !po?.id) return
                        await loadDocuments(companyId, po.id)
                      }}
                      loading={docsLoading}
                    >
                      Refresh
                    </Button>
                  </Space>
                  <DataTable rowKey={(r: any) => r.id} loading={docsLoading} dataSource={receipts} columns={receiptColumns} pagination={{ pageSize: 5 }} />
                </Space>
              )
            },
            {
              key: 'invoice',
              label: 'Invoices',
              children: (
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <Space wrap style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Typography.Text type="secondary">AP invoices linked to this Purchase Order.</Typography.Text>
                    <Button
                      onClick={async () => {
                        if (!companyId || !po?.id) return
                        await loadDocuments(companyId, po.id)
                      }}
                      loading={docsLoading}
                    >
                      Refresh
                    </Button>
                  </Space>
                  <DataTable rowKey={(r: any) => r.id} loading={docsLoading} dataSource={invoices} columns={invoiceColumns} pagination={{ pageSize: 5 }} />
                </Space>
              )
            }
          ]}
        />
      </Card>

      <Modal
        open={receiptOpen}
        title="Create Goods Receipt (GRN)"
        width={900}
        onCancel={() => setReceiptOpen(false)}
        onOk={async () => {
          if (!companyId || !po?.id) return
          try {
            setReceiptSaving(true)
            const v = await receiptForm.validateFields()
            const payload: any = {
              toLocatorId: v.toLocatorId != null ? Number(v.toLocatorId) : null,
              movementDate: v.movementDate ? dayjs(v.movementDate).format('YYYY-MM-DD') : null,
              description: v.description || null,
              lines: (v.lines || [])
                .map((ln: any) => ({
                  purchaseOrderLineId: ln.purchaseOrderLineId != null ? Number(ln.purchaseOrderLineId) : null,
                  qty: ln.qty != null ? Number(ln.qty) : null,
                  remainingQty: ln.remainingQty != null ? Number(ln.remainingQty) : null
                }))
                .filter((ln: any) => ln.purchaseOrderLineId != null && ln.qty != null && ln.qty > 0)
            }

            for (const ln of payload.lines) {
              if (ln.remainingQty != null && ln.qty > ln.remainingQty) {
                message.error('Receipt qty exceeds remaining qty')
                return
              }
            }

            payload.lines = payload.lines.map(({ remainingQty, ...rest }: any) => rest)
            const mv = await purchaseApi.createGoodsReceipt(companyId, po.id, payload)
            message.success(`Goods receipt created ${mv?.documentNo || ''}`.trim())
            setCreatedReceiptMovement(mv)
            setReceiptResultOpen(true)
            setReceiptOpen(false)
            await load(companyId, po.id)
            await loadDocuments(companyId, po.id)
          } catch (e: any) {
            if (e?.errorFields) {
              message.error('Please complete required fields')
              return
            }
            message.error(getApiErrorMessage(e, 'Failed to create goods receipt'))
          } finally {
            setReceiptSaving(false)
          }
        }}
        okText="Create"
        okButtonProps={{ loading: receiptSaving }}
        destroyOnClose
      >
        <Form layout="vertical" form={receiptForm}>
          <Space wrap style={{ width: '100%' }}>
            <Form.Item name="toLocatorId" label="To Locator" rules={[{ required: true }]} style={{ width: 360 }}>
              <Select
                loading={locatorOptionsLoading}
                placeholder="Select locator"
                showSearch
                optionFilterProp="label"
                options={locatorOptions}
              />
            </Form.Item>

            <Form.Item name="movementDate" label="Movement Date" rules={[{ required: true }]} style={{ width: 240 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>

          <Typography.Title level={5}>Receipt Lines</Typography.Title>
          <Form.List name="lines">
            {(fields) => (
              <Table
                size="small"
                rowKey={(row: any) => String(row?.purchaseOrderLineId)}
                pagination={false}
                dataSource={fields.map((f) => ({ ...receiptForm.getFieldValue('lines')?.[f.name], _idx: f.name }))}
                columns={[
                  { title: 'PO Line ID', dataIndex: 'purchaseOrderLineId', width: 120 },
                  { title: 'Product', dataIndex: 'productId', width: 120 },
                  { title: 'Ordered', dataIndex: 'orderedQty', width: 120 },
                  { title: 'Received', dataIndex: 'receivedQty', width: 120 },
                  { title: 'Remaining', dataIndex: 'remainingQty', width: 120 },
                  {
                    title: 'Receive Qty',
                    key: 'qty',
                    width: 200,
                    render: (_: any, r: any) => (
                      <Form.Item name={[r._idx, 'qty']} style={{ marginBottom: 0 }} rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} max={Number(r.remainingQty ?? 0)} placeholder="0" />
                      </Form.Item>
                    )
                  },
                  {
                    title: '',
                    key: 'hidden',
                    width: 1,
                    render: (_: any, r: any) => (
                      <>
                        <Form.Item name={[r._idx, 'purchaseOrderLineId']} style={{ display: 'none' }}>
                          <Input />
                        </Form.Item>
                        <Form.Item name={[r._idx, 'remainingQty']} style={{ display: 'none' }}>
                          <Input />
                        </Form.Item>
                      </>
                    )
                  }
                ]}
              />
            )}
          </Form.List>
        </Form>
      </Modal>

      <Modal
        open={receiptResultOpen}
        title="Goods Receipt Created"
        footer={
          <Space wrap style={{ justifyContent: 'flex-end', width: '100%' }}>
            <Button
              type="primary"
              loading={receiptCompleting}
              disabled={!companyId || !createdReceiptMovement?.id || String(createdReceiptMovement?.status || '') !== 'DRAFTED'}
              onClick={async () => {
                if (!companyId || !createdReceiptMovement?.id) return
                try {
                  setReceiptCompleting(true)
                  await inventoryApi.completeMovement(companyId, createdReceiptMovement.id)
                  message.success('Goods receipt completed')
                  setReceiptResultOpen(false)
                  setCreatedReceiptMovement(null)
                  await load(companyId, po?.id as any)
                  await loadDocuments(companyId, po?.id as any)
                } catch (e: any) {
                  message.error(getApiErrorMessage(e, 'Failed to complete goods receipt'))
                } finally {
                  setReceiptCompleting(false)
                }
              }}
            >
              Complete Now
            </Button>
            <Button
              onClick={() => {
                setReceiptResultOpen(false)
                setCreatedReceiptMovement(null)
              }}
            >
              Close
            </Button>
          </Space>
        }
        onCancel={() => {
          setReceiptResultOpen(false)
          setCreatedReceiptMovement(null)
        }}
        destroyOnClose
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Typography.Text>
            Document No: <b>{createdReceiptMovement?.documentNo || '-'}</b>
          </Typography.Text>
          <Typography.Text type="secondary">Status: {createdReceiptMovement?.status || '-'}</Typography.Text>
        </Space>
      </Modal>

      <Modal
        open={billOpen}
        title="Create Vendor Invoice (AP)"
        width={900}
        onCancel={() => setBillOpen(false)}
        onOk={async () => {
          if (!companyId || !po?.id) return
          try {
            setBillSaving(true)
            const v = await billForm.validateFields()
            const payload: any = {
              invoiceDate: v.invoiceDate ? dayjs(v.invoiceDate).format('YYYY-MM-DD') : null,
              taxRateId: v.taxRateId != null ? Number(v.taxRateId) : null,
              lines: (v.lines || [])
                .map((ln: any) => ({
                  purchaseOrderLineId: ln.purchaseOrderLineId != null ? Number(ln.purchaseOrderLineId) : null,
                  qty: ln.qty != null ? Number(ln.qty) : null,
                  remainingQty: ln.remainingQty != null ? Number(ln.remainingQty) : null
                }))
                .filter((ln: any) => ln.purchaseOrderLineId != null && ln.qty != null && ln.qty > 0)
            }

            for (const ln of payload.lines) {
              if (ln.remainingQty != null && ln.qty > ln.remainingQty) {
                message.error('Invoice qty exceeds received not yet invoiced')
                return
              }
            }

            payload.lines = payload.lines.map(({ remainingQty, ...rest }: any) => rest)
            if (!payload.taxRateId) delete payload.taxRateId

            const inv = await purchaseApi.createPurchaseInvoice(companyId, po.id, payload)
            message.success(`Vendor invoice created ${inv?.documentNo || ''}`.trim())
            setBillOpen(false)
            await load(companyId, po.id)
            await loadDocuments(companyId, po.id)
          } catch (e: any) {
            if (e?.errorFields) {
              message.error('Please complete required fields')
              return
            }
            message.error(getApiErrorMessage(e, 'Failed to create vendor invoice'))
          } finally {
            setBillSaving(false)
          }
        }}
        okText="Create"
        okButtonProps={{ loading: billSaving }}
        destroyOnClose
      >
        <Form layout="vertical" form={billForm}>
          <Space wrap style={{ width: '100%' }}>
            <Form.Item name="invoiceDate" label="Invoice Date" rules={[{ required: true }]} style={{ width: 240 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="taxRateId" label="Tax Rate" style={{ width: 360 }}>
              <Select
                allowClear
                loading={taxRateOptionsLoading}
                placeholder="Optional"
                showSearch
                optionFilterProp="label"
                options={taxRateOptions}
              />
            </Form.Item>
          </Space>

          <Typography.Title level={5}>Invoice Lines</Typography.Title>
          <Form.List name="lines">
            {(fields) => (
              <Table
                size="small"
                rowKey={(row: any) => String(row?.purchaseOrderLineId)}
                pagination={false}
                dataSource={fields.map((f) => ({ ...billForm.getFieldValue('lines')?.[f.name], _idx: f.name }))}
                columns={[
                  { title: 'PO Line ID', dataIndex: 'purchaseOrderLineId', width: 120 },
                  { title: 'Product', dataIndex: 'productId', width: 120 },
                  { title: 'Received', dataIndex: 'receivedQty', width: 120 },
                  { title: 'Invoiced', dataIndex: 'invoicedQty', width: 120 },
                  { title: 'Remaining', dataIndex: 'remainingQty', width: 120 },
                  {
                    title: 'Invoice Qty',
                    key: 'qty',
                    width: 200,
                    render: (_: any, r: any) => (
                      <Form.Item name={[r._idx, 'qty']} style={{ marginBottom: 0 }} rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} max={Number(r.remainingQty ?? 0)} placeholder="0" />
                      </Form.Item>
                    )
                  },
                  {
                    title: '',
                    key: 'hidden',
                    width: 1,
                    render: (_: any, r: any) => (
                      <>
                        <Form.Item name={[r._idx, 'purchaseOrderLineId']} style={{ display: 'none' }}>
                          <Input />
                        </Form.Item>
                        <Form.Item name={[r._idx, 'remainingQty']} style={{ display: 'none' }}>
                          <Input />
                        </Form.Item>
                      </>
                    )
                  }
                ]}
              />
            )}
          </Form.List>
        </Form>
      </Modal>

      <Modal
        open={voidOpen}
        title="Void Purchase Order"
        onCancel={() => setVoidOpen(false)}
        onOk={async () => {
          if (!companyId || !po?.id) return
          try {
            setVoidSaving(true)
            const v = await voidForm.validateFields()
            await purchaseApi.voidPurchaseOrder(companyId, po.id, {
              voidDate: v.voidDate ? dayjs(v.voidDate).format('YYYY-MM-DD') : null,
              reason: v.reason || null
            })
            message.success('Purchase Order voided')
            setVoidOpen(false)
            await load(companyId, po.id)
            await loadDocuments(companyId, po.id)
          } catch (e: any) {
            if (e?.errorFields) {
              message.error('Please complete required fields')
              return
            }
            message.error(getApiErrorMessage(e, 'Failed to void purchase order'))
          } finally {
            setVoidSaving(false)
          }
        }}
        okText="Void"
        okButtonProps={{ danger: true, loading: voidSaving }}
        destroyOnClose
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
