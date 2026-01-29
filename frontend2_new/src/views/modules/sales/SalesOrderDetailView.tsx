import { Button, Card, DatePicker, Descriptions, Form, Input, InputNumber, Modal, Select, Space, Table, Tabs, Typography, message } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import StatusBadge from '@/components/StatusBadge'
import DataTable from '@/components/DataTable'
import { financeApi, inventoryApi, manufacturingApi, masterDataApi, salesApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import { getApiErrorMessage } from '@/utils/error'

type SalesOrderRow = {
  id: number
  documentNo?: string
  status?: string
  orderDate?: string
  orderType?: string
  buyerPo?: string
  memo?: string
  totalNet?: any
  totalTax?: any
  grandTotal?: any
  lines?: any[]
  deliverySchedules?: any[]
}

export default function SalesOrderDetailView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const companyId = useContextStore((s) => s.companyId)

  const [activeTab, setActiveTab] = useState('lines')

  const [loading, setLoading] = useState(false)
  const [so, setSo] = useState<SalesOrderRow | null>(null)

  const [bomLoading, setBomLoading] = useState(false)
  const [bomRows, setBomRows] = useState<any[]>([])
  const [masterBomLoading, setMasterBomLoading] = useState(false)
  const [masterBoms, setMasterBoms] = useState<any[]>([])

  const [applyOpen, setApplyOpen] = useState(false)
  const [applyLineId, setApplyLineId] = useState<number | null>(null)
  const [applyBomId, setApplyBomId] = useState<number | null>(null)
  const [applySaving, setApplySaving] = useState(false)

  const [copyOpen, setCopyOpen] = useState(false)
  const [copyFromSoId, setCopyFromSoId] = useState<number | null>(null)
  const [copyOptionsLoading, setCopyOptionsLoading] = useState(false)
  const [copyOptions, setCopyOptions] = useState<any[]>([])
  const [copySaving, setCopySaving] = useState(false)

  const [docsLoading, setDocsLoading] = useState(false)
  const [shipments, setShipments] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])

  const [approveLoading, setApproveLoading] = useState(false)

  const [shipOpen, setShipOpen] = useState(false)
  const [shipSaving, setShipSaving] = useState(false)
  const [shipForm] = Form.useForm()
  const [locatorOptionsLoading, setLocatorOptionsLoading] = useState(false)
  const [locatorOptions, setLocatorOptions] = useState<any[]>([])

  const [invOpen, setInvOpen] = useState(false)
  const [invSaving, setInvSaving] = useState(false)
  const [invForm] = Form.useForm()
  const [taxRateOptionsLoading, setTaxRateOptionsLoading] = useState(false)
  const [taxRateOptions, setTaxRateOptions] = useState<any[]>([])

  const [voidOpen, setVoidOpen] = useState(false)
  const [voidSaving, setVoidSaving] = useState(false)
  const [voidForm] = Form.useForm()

  const load = async (cid: number, soId: number) => {
    setLoading(true)
    try {
      const res = await salesApi.getSalesOrder(cid, soId)
      setSo(res as SalesOrderRow)
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load sales order'))
      setSo(null)
    } finally {
      setLoading(false)
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

  const loadLocators = async (cid: number) => {
    setLocatorOptionsLoading(true)
    try {
      const res = await inventoryApi.listLocators(cid)
      setLocatorOptions(
        ((res || []) as any[]).map((x) => ({
          value: x.id,
          label: `${x.code || x.name || x.id}`
        }))
      )
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load locators'))
      setLocatorOptions([])
    } finally {
      setLocatorOptionsLoading(false)
    }
  }

  const loadDocuments = async (cid: number, soId: number) => {
    setDocsLoading(true)
    try {
      const [moves, invs] = await Promise.all([
        inventoryApi.listMovements(cid, { salesOrderId: soId, movementType: 'OUT' }),
        financeApi.listInvoices(cid, { salesOrderId: soId })
      ])
      setShipments((moves || []) as any[])
      setInvoices((invs || []) as any[])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load documents'))
      setShipments([])
      setInvoices([])
    } finally {
      setDocsLoading(false)
    }
  }

  const loadBoms = async (cid: number, soId: number) => {
    setBomLoading(true)
    try {
      const res = await salesApi.listSalesOrderBoms(cid, soId)
      setBomRows((res || []) as any[])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load BOM snapshots'))
      setBomRows([])
    } finally {
      setBomLoading(false)
    }
  }

  const loadMasterBoms = async (cid: number) => {
    setMasterBomLoading(true)
    try {
      const res = await manufacturingApi.listBoms(cid)
      setMasterBoms(((res || []) as any[]).filter((b) => b && b.active))
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load master BOMs'))
      setMasterBoms([])
    } finally {
      setMasterBomLoading(false)
    }
  }

  const loadCopyOptions = async (cid: number) => {
    setCopyOptionsLoading(true)
    try {
      const res = await salesApi.listSalesOrders(cid)
      setCopyOptions((res || []) as any[])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load sales orders'))
      setCopyOptions([])
    } finally {
      setCopyOptionsLoading(false)
    }
  }

  useEffect(() => {
    const soId = Number(id)
    if (!companyId || !soId) return
    void load(companyId, soId)
    void loadBoms(companyId, soId)
    void loadMasterBoms(companyId)
    void loadDocuments(companyId, soId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, id])

  const bomByLineId = useMemo(() => {
    const m = new Map<number, any>()
    for (const b of bomRows || []) {
      const lineId = Number((b as any).salesOrderLineId)
      if (!lineId) continue
      m.set(lineId, b)
    }
    return m
  }, [bomRows])

  const bomLineTableRows = useMemo(() => {
    const lines = (so?.lines || []) as any[]
    return lines.map((ln) => {
      const lineId = Number(ln.id)
      const snap = lineId ? bomByLineId.get(lineId) : null
      const snapLines = (snap?.lines || []) as any[]
      return {
        ...ln,
        _bomStatus: snapLines.length > 0 ? 'READY' : 'MISSING',
        _bomSource: snap?.sourceBomId ? `MASTER #${snap.sourceBomId} (v${snap.sourceBomVersion || '-'})` : snapLines.length > 0 ? 'MANUAL' : '-'
      }
    })
  }, [bomByLineId, so?.lines])

  const bomMissingCount = useMemo(() => {
    const rows = bomLineTableRows || []
    return rows.filter((r: any) => String(r?._bomStatus) !== 'READY').length
  }, [bomLineTableRows])

  const canApprove = String(so?.status || '') === 'DRAFTED'

  const canShip = ['APPROVED', 'PARTIALLY_COMPLETED'].includes(String(so?.status || ''))

  const hasShippedQty = useMemo(() => {
    const lines = (so?.lines || []) as any[]
    return lines.some((l) => Number(l?.shippedQty ?? 0) > 0)
  }, [so?.lines])

  const hasInvoice = (invoices || []).length > 0

  const canInvoice = ['APPROVED', 'PARTIALLY_COMPLETED', 'COMPLETED'].includes(String(so?.status || '')) && hasShippedQty && !hasInvoice

  const canVoid = !['VOIDED', 'COMPLETED', 'PARTIALLY_COMPLETED'].includes(String(so?.status || '')) && !hasShippedQty

  const lineColumns = [
    { title: 'Product', dataIndex: 'productId', width: 110 },
    { title: 'Qty', dataIndex: 'qty', width: 90, align: 'right' as const },
    { title: 'Style', dataIndex: 'style', width: 140 },
    { title: 'Color', dataIndex: 'color', width: 120 },
    { title: 'Size', dataIndex: 'size', width: 100 },
    { title: 'Delivery Date', dataIndex: 'deliveryDate', width: 130 },
    { title: 'Ship Mode', dataIndex: 'shipMode', width: 120 },
    { title: 'Factory', dataIndex: 'factory', width: 140 },
    { title: 'Remark', dataIndex: 'remark' }
  ]

  const scheduleColumns = [
    { title: 'Delivery Date', dataIndex: 'deliveryDate', width: 140 },
    { title: 'Ship Mode', dataIndex: 'shipMode', width: 140 },
    { title: 'Factory', dataIndex: 'factory', width: 160 },
    { title: 'Remark', dataIndex: 'remark' }
  ]

  const shipmentColumns = [
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
          title={`Sales Order ${so?.documentNo || ''}`.trim()}
          subtitle={so?.status ? `Status: ${so.status}` : undefined}
          onBack={() => navigate('/modules/sales/sales-orders')}
          extra={
            <Space wrap>
              {so?.status ? <StatusBadge status={so.status} /> : null}
              <Button
                onClick={async () => {
                  if (!companyId || !so?.id) return
                  if (!canShip) return

                  if (locatorOptions.length === 0) {
                    await loadLocators(companyId)
                  }

                  const lines = (so?.lines || []) as any[]
                  const defaultLines = lines
                    .map((ln) => {
                      const ordered = Number(ln.qty ?? 0)
                      const shipped = Number(ln.shippedQty ?? 0)
                      const remaining = Math.max(0, ordered - shipped)
                      return {
                        salesOrderLineId: ln.id,
                        productId: ln.productId,
                        orderedQty: ordered,
                        shippedQty: shipped,
                        remainingQty: remaining,
                        qty: remaining
                      }
                    })
                    .filter((x) => x.remainingQty > 0)

                  shipForm.setFieldsValue({
                    fromLocatorId: undefined,
                    movementDate: dayjs(),
                    description: undefined,
                    lines: defaultLines
                  })

                  setShipOpen(true)
                }}
                disabled={!canShip}
              >
                Create Shipment
              </Button>

              <Button
                onClick={async () => {
                  if (!companyId || !so?.id) return
                  if (!canInvoice) return

                  if (taxRateOptions.length === 0) {
                    await loadTaxRates(companyId)
                  }

                  invForm.setFieldsValue({
                    invoiceDate: dayjs(),
                    taxRateId: undefined
                  })
                  setInvOpen(true)
                }}
                disabled={!canInvoice}
              >
                Create Invoice
              </Button>

              <Button
                danger
                onClick={() => {
                  if (!companyId || !so?.id) return
                  if (!canVoid) return
                  voidForm.setFieldsValue({
                    voidDate: dayjs(),
                    reason: undefined
                  })
                  setVoidOpen(true)
                }}
                disabled={!canVoid}
              >
                Void
              </Button>

              <Button
                type="primary"
                loading={approveLoading}
                disabled={!canApprove}
                onClick={() => {
                  if (!companyId || !so?.id) return
                  if (bomMissingCount > 0) {
                    setActiveTab('bom')
                    message.error(`BOM snapshot is required for approval. Missing on ${bomMissingCount} line(s).`)
                    return
                  }
                  Modal.confirm({
                    title: 'Approve Sales Order?',
                    content: 'This will lock the order and prevent BOM edits. Continue?',
                    okText: 'Approve',
                    onOk: async () => {
                      try {
                        setApproveLoading(true)
                        await salesApi.approveSalesOrder(companyId, so.id)
                        message.success('Sales Order approved')
                        await load(companyId, so.id)
                        await loadDocuments(companyId, so.id)
                      } catch (e: any) {
                        message.error(getApiErrorMessage(e, 'Failed to approve sales order'))
                      } finally {
                        setApproveLoading(false)
                      }
                    }
                  })
                }}
              >
                Approve
              </Button>
            </Space>
          }
        />
      </Card>

      <Card loading={loading}>
        <Descriptions column={3} size="small" bordered>
          <Descriptions.Item label="Document No">{so?.documentNo || '-'}</Descriptions.Item>
          <Descriptions.Item label="Status">{so?.status ? <StatusBadge status={so.status} /> : '-'}</Descriptions.Item>
          <Descriptions.Item label="Order Date">{so?.orderDate || '-'}</Descriptions.Item>
          <Descriptions.Item label="Type">{so?.orderType || '-'}</Descriptions.Item>
          <Descriptions.Item label="Buyer PO">{so?.buyerPo || '-'}</Descriptions.Item>
          <Descriptions.Item label="Grand Total">{so?.grandTotal == null ? '-' : Number(so.grandTotal).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Memo" span={3}>
            {so?.memo || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card loading={loading}>
        <Tabs
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k)}
          items={[
            {
              key: 'lines',
              label: 'Lines',
              children: <DataTable rowKey={(r: any) => r.id || `${r.productId}-${r.style}-${r.color}-${r.size}`} dataSource={so?.lines || []} columns={lineColumns} />
            },
            {
              key: 'schedules',
              label: 'Delivery Schedules',
              children: (
                <DataTable
                  rowKey={(r: any) => r.id || `${r.deliveryDate}-${r.shipMode}-${r.factory}`}
                  dataSource={so?.deliverySchedules || []}
                  columns={scheduleColumns}
                />
              )
            },
            {
              key: 'bom',
              label: 'BOM',
              children: (
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <Space wrap style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Typography.Text type="secondary">
                      Approval requires BOM snapshot per line. Fill missing BOMs before approving.
                    </Typography.Text>
                    <Space wrap>
                      <Button
                        onClick={async () => {
                          if (!companyId || !so?.id) return
                          await loadBoms(companyId, so.id)
                        }}
                        loading={bomLoading}
                      >
                        Refresh
                      </Button>
                      <Button
                        onClick={async () => {
                          if (!companyId) return
                          setCopyFromSoId(null)
                          setCopyOpen(true)
                          if (copyOptions.length === 0) await loadCopyOptions(companyId)
                        }}
                      >
                        Copy BOM from SO
                      </Button>
                    </Space>
                  </Space>

                  <DataTable
                    rowKey={(r: any) => r.id}
                    loading={bomLoading}
                    dataSource={bomLineTableRows}
                    expandable={{
                      expandedRowRender: (r: any) => {
                        const snap = r?.id ? bomByLineId.get(Number(r.id)) : null
                        const lines = (snap?.lines || []) as any[]
                        return (
                          <DataTable
                            rowKey={(x: any, index?: number) => String(x.id || `${x.componentProductId}-${index ?? 0}`)}
                            pagination={false}
                            dataSource={lines}
                            columns={[
                              { title: 'Component Product', dataIndex: 'componentProductId', width: 150 },
                              { title: 'Qty', dataIndex: 'qty', width: 90, align: 'right' },
                              { title: 'Unit', dataIndex: 'unit', width: 100 },
                              { title: 'Description', dataIndex: 'description1' },
                              { title: 'Color', dataIndex: 'colorDescription2', width: 160 }
                            ]}
                          />
                        )
                      }
                    }}
                    columns={[
                      { title: 'Line ID', dataIndex: 'id', width: 90 },
                      { title: 'Product', dataIndex: 'productId', width: 120 },
                      { title: 'Style', dataIndex: 'style', width: 140 },
                      { title: 'Color', dataIndex: 'color', width: 120 },
                      { title: 'Size', dataIndex: 'size', width: 100 },
                      {
                        title: 'BOM Status',
                        dataIndex: '_bomStatus',
                        width: 120,
                        render: (v: any) => (String(v) === 'READY' ? <Typography.Text type="success">READY</Typography.Text> : <Typography.Text type="danger">MISSING</Typography.Text>)
                      },
                      { title: 'Source', dataIndex: '_bomSource', width: 200 },
                      {
                        title: 'Action',
                        key: 'action',
                        width: 160,
                        render: (_: any, r: any) => (
                          <Button
                            size="small"
                            onClick={() => {
                              const lineId = Number(r.id)
                              if (!lineId) return
                              setApplyLineId(lineId)
                              setApplyBomId(null)
                              setApplyOpen(true)
                            }}
                            disabled={String(so?.status || '') !== 'DRAFTED'}
                          >
                            Apply Master BOM
                          </Button>
                        )
                      }
                    ]}
                  />
                </Space>
              )
            },
            {
              key: 'docs',
              label: 'Documents',
              children: (
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <Space wrap style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Typography.Text type="secondary">Documents generated from this Sales Order.</Typography.Text>
                    <Button
                      onClick={async () => {
                        if (!companyId || !so?.id) return
                        await loadDocuments(companyId, so.id)
                      }}
                      loading={docsLoading}
                    >
                      Refresh
                    </Button>
                  </Space>

                  <Card size="small" title="Shipments (Inventory Movements OUT)" loading={docsLoading}>
                    <DataTable rowKey={(r: any) => r.id} dataSource={shipments} columns={shipmentColumns} pagination={{ pageSize: 5 }} />
                  </Card>

                  <Card size="small" title="Invoices" loading={docsLoading}>
                    <DataTable rowKey={(r: any) => r.id} dataSource={invoices} columns={invoiceColumns} pagination={{ pageSize: 5 }} />
                  </Card>
                </Space>
              )
            }
          ]}
        />
      </Card>

      <Modal
        open={shipOpen}
        title="Create Goods Shipment"
        width={1100}
        onCancel={() => {
          setShipOpen(false)
        }}
        onOk={async () => {
          if (!companyId || !so?.id) return
          try {
            setShipSaving(true)
            const v = await shipForm.validateFields()
            const payload: any = {
              fromLocatorId: v.fromLocatorId != null ? Number(v.fromLocatorId) : null,
              movementDate: v.movementDate ? dayjs(v.movementDate).format('YYYY-MM-DD') : null,
              description: v.description || null,
              lines: (v.lines || [])
                .map((ln: any) => ({
                  salesOrderLineId: ln.salesOrderLineId != null ? Number(ln.salesOrderLineId) : null,
                  qty: ln.qty != null ? Number(ln.qty) : null,
                  remainingQty: ln.remainingQty != null ? Number(ln.remainingQty) : null
                }))
                .filter((ln: any) => ln.salesOrderLineId != null && ln.qty != null && ln.qty > 0)
            }

            for (const ln of payload.lines) {
              if (ln.remainingQty != null && ln.qty > ln.remainingQty) {
                message.error('Shipment qty exceeds remaining qty')
                return
              }
            }

            payload.lines = payload.lines.map(({ remainingQty, ...rest }: any) => rest)

            const movement = await salesApi.createGoodsShipment(companyId, so.id, payload)
            message.success(`Created Goods Shipment ${movement?.documentNo || ''}`.trim())
            setShipOpen(false)
            await load(companyId, so.id)
            await loadDocuments(companyId, so.id)
          } catch (e: any) {
            if (e?.errorFields) {
              message.error('Please complete required fields')
              return
            }
            message.error(getApiErrorMessage(e, 'Failed to create goods shipment'))
          } finally {
            setShipSaving(false)
          }
        }}
        okButtonProps={{ loading: shipSaving }}
        destroyOnClose
      >
        <Form layout="vertical" form={shipForm}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item label="From Locator" name="fromLocatorId" rules={[{ required: true }]}>
              <Select showSearch options={locatorOptions} optionFilterProp="label" placeholder="Selection" loading={locatorOptionsLoading} />
            </Form.Item>
            <Form.Item label="Movement Date" name="movementDate" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} placeholder="DD-MM-YYYY" />
            </Form.Item>
          </div>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>

          <Typography.Title level={5}>Lines</Typography.Title>
          <Form.List name="lines">
            {(fields) => (
              <Table
                size="small"
                rowKey={(row: any) => String(row?.salesOrderLineId)}
                pagination={false}
                dataSource={fields.map((f) => ({ ...shipForm.getFieldValue('lines')?.[f.name], _idx: f.name }))}
                columns={[
                  { title: 'SO Line ID', dataIndex: 'salesOrderLineId', width: 120 },
                  { title: 'Product', dataIndex: 'productId', width: 120 },
                  { title: 'Ordered', dataIndex: 'orderedQty', width: 120 },
                  { title: 'Shipped', dataIndex: 'shippedQty', width: 120 },
                  { title: 'Remaining', dataIndex: 'remainingQty', width: 120 },
                  {
                    title: 'Ship Qty',
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
                        <Form.Item name={[r._idx, 'salesOrderLineId']} style={{ display: 'none' }}>
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
        open={invOpen}
        title="Create Invoice (AR)"
        onCancel={() => setInvOpen(false)}
        onOk={async () => {
          if (!companyId || !so?.id) return
          try {
            setInvSaving(true)
            const v = await invForm.validateFields()
            const payload: any = {
              invoiceDate: v.invoiceDate ? dayjs(v.invoiceDate).format('YYYY-MM-DD') : null,
              taxRateId: v.taxRateId != null ? Number(v.taxRateId) : null
            }
            const inv = await salesApi.createInvoiceFromSalesOrder(companyId, so.id, payload)
            message.success(`Created Invoice ${inv?.documentNo || ''}`.trim())
            setInvOpen(false)
            await loadDocuments(companyId, so.id)
            await load(companyId, so.id)
          } catch (e: any) {
            if (e?.errorFields) {
              message.error('Please complete required fields')
              return
            }
            message.error(getApiErrorMessage(e, 'Failed to create invoice'))
          } finally {
            setInvSaving(false)
          }
        }}
        okButtonProps={{ loading: invSaving }}
        destroyOnClose
      >
        <Form layout="vertical" form={invForm}>
          <Form.Item label="Invoice Date" name="invoiceDate" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} placeholder="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item label="Tax Rate" name="taxRateId">
            <Select
              allowClear
              showSearch
              options={taxRateOptions}
              optionFilterProp="label"
              placeholder="Optional"
              loading={taxRateOptionsLoading}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={voidOpen}
        title="Void Sales Order"
        onCancel={() => setVoidOpen(false)}
        onOk={async () => {
          if (!companyId || !so?.id) return
          try {
            setVoidSaving(true)
            const v = await voidForm.validateFields()
            const payload: any = {
              voidDate: v.voidDate ? dayjs(v.voidDate).format('YYYY-MM-DD') : null,
              reason: v.reason || null
            }
            await salesApi.voidSalesOrder(companyId, so.id, payload)
            message.success('Sales Order voided')
            setVoidOpen(false)
            await load(companyId, so.id)
            await loadDocuments(companyId, so.id)
          } catch (e: any) {
            if (e?.errorFields) {
              message.error('Please complete required fields')
              return
            }
            message.error(getApiErrorMessage(e, 'Failed to void sales order'))
          } finally {
            setVoidSaving(false)
          }
        }}
        okButtonProps={{ danger: true, loading: voidSaving }}
        okText="Void"
        destroyOnClose
      >
        <Form layout="vertical" form={voidForm}>
          <Form.Item label="Void Date" name="voidDate" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} placeholder="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item label="Reason" name="reason">
            <Input />
          </Form.Item>
          <Typography.Text type="secondary">
            Note: Sales Order cannot be voided if it has shipped quantity or is already completed.
          </Typography.Text>
        </Form>
      </Modal>

      <Modal
        title="Apply Master BOM"
        open={applyOpen}
        onCancel={() => {
          setApplyOpen(false)
          setApplyLineId(null)
          setApplyBomId(null)
        }}
        okText="Apply"
        okButtonProps={{ disabled: !applyLineId || !applyBomId, loading: applySaving }}
        onOk={async () => {
          if (!companyId || !so?.id || !applyLineId || !applyBomId) return
          try {
            setApplySaving(true)
            await salesApi.setSalesOrderLineBom(companyId, so.id, {
              salesOrderLineId: applyLineId,
              sourceBomId: applyBomId
            })
            message.success('BOM applied')
            await loadBoms(companyId, so.id)
            setApplyOpen(false)
            setApplyLineId(null)
            setApplyBomId(null)
          } catch (e: any) {
            message.error(getApiErrorMessage(e, 'Failed to apply BOM'))
          } finally {
            setApplySaving(false)
          }
        }}
      >
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Typography.Text type="secondary">Only allowed while Sales Order is DRAFTED.</Typography.Text>
          <div>
            <Typography.Text strong>Line</Typography.Text>
            <div>{applyLineId || '-'}</div>
          </div>
          <div>
            <Typography.Text strong>Master BOM</Typography.Text>
            <Select
              style={{ width: '100%' }}
              placeholder="Select master BOM"
              loading={masterBomLoading}
              value={applyBomId ?? undefined}
              options={masterBoms.map((b) => ({ value: b.id, label: `#${b.id} productId=${b.productId} v${b.version}${b.active ? '' : ' (inactive)'}` }))}
              onChange={(v) => setApplyBomId(v)}
              showSearch
              optionFilterProp="label"
            />
          </div>
        </Space>
      </Modal>

      <Modal
        title="Copy BOM from another Sales Order"
        open={copyOpen}
        onCancel={() => {
          setCopyOpen(false)
          setCopyFromSoId(null)
        }}
        okText="Copy"
        okButtonProps={{ disabled: !copyFromSoId, loading: copySaving }}
        onOk={async () => {
          if (!companyId || !so?.id || !copyFromSoId) return
          try {
            setCopySaving(true)
            await salesApi.copySalesOrderBoms(companyId, so.id, { fromSalesOrderId: copyFromSoId })
            message.success('BOM copied')
            await loadBoms(companyId, so.id)
            setCopyOpen(false)
            setCopyFromSoId(null)
          } catch (e: any) {
            message.error(getApiErrorMessage(e, 'Failed to copy BOM'))
          } finally {
            setCopySaving(false)
          }
        }}
      >
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Typography.Text type="secondary">
            Copy matches by product + style/color/size. Only allowed while Sales Order is DRAFTED.
          </Typography.Text>
          <Select
            style={{ width: '100%' }}
            placeholder="Select Sales Order to copy from"
            loading={copyOptionsLoading}
            value={copyFromSoId ?? undefined}
            options={copyOptions
              .filter((x) => x && x.id && String(x.id) !== String(so?.id))
              .map((x) => ({ value: x.id, label: `${x.documentNo || x.id} (${x.status || ''})` }))}
            onChange={(v) => setCopyFromSoId(v)}
            showSearch
            optionFilterProp="label"
          />
        </Space>
      </Modal>
    </Space>
  )
}
