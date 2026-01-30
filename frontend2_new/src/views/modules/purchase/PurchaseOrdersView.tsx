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
import { useNavigate } from 'react-router-dom'
import { coreApi, inventoryApi, masterDataApi, purchaseApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import { getApiErrorMessage } from '@/utils/error'

type CompanyRow = {
  id: number
  code?: string
  name?: string
}

type OrgRow = {
  id: number
  code?: string
  name?: string
}

type VendorRow = {
  id: number
  name?: string
  type?: 'CUSTOMER' | 'VENDOR' | 'BOTH'
}

type ProductRow = {
  id: number
  code?: string
  name?: string
}

type TaxRateRow = { id: number; name?: string; rate?: any }

type PriceListRow = {
  id: number
  name?: string
}

type PriceListVersionRow = {
  id: number
  name?: string
  validFrom?: string
}

type PurchaseOrderLineRow = {
  id?: number
  productId?: number
  uomId?: number
  qty?: number
  price?: number
  lineNet?: number
  receivedQty?: number
  invoicedQty?: number
}

type PurchaseOrderRow = {
  id: number
  orgId?: number | null
  vendorId?: number
  priceListVersionId?: number
  documentNo?: string
  status?: string
  orderDate?: string
  totalNet?: number
  totalTax?: number
  grandTotal?: number
  lines?: PurchaseOrderLineRow[]
}

type LocatorRow = {
  id: number
  code?: string
  name?: string
}

type MovementRow = {
  id: number
  documentNo?: string
  status?: string
}

function toLocalDateString(d: any): string {
  if (!d) return ''
  return dayjs(d).format('YYYY-MM-DD')
}

export default function PurchaseOrdersView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const navigate = useNavigate()

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [orgLoading, setOrgLoading] = useState(false)
  const [orgs, setOrgs] = useState<OrgRow[]>([])

  const [vendorLoading, setVendorLoading] = useState(false)
  const [vendors, setVendors] = useState<VendorRow[]>([])

  const [productLoading, setProductLoading] = useState(false)
  const [products, setProducts] = useState<ProductRow[]>([])

  const [taxRates, setTaxRates] = useState<TaxRateRow[]>([])

  const [priceListVersionLoading, setPriceListVersionLoading] = useState(false)
  const [priceListVersions, setPriceListVersions] = useState<PriceListVersionRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<PurchaseOrderRow[]>([])

  const [filterDocNo, setFilterDocNo] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterVendorId, setFilterVendorId] = useState<number | null>(null)
  const [filterDateRange, setFilterDateRange] = useState<any>(null)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<PurchaseOrderRow | null>(null)
  const [form] = Form.useForm()

  const [receiptOpen, setReceiptOpen] = useState(false)
  const [receiptPo, setReceiptPo] = useState<PurchaseOrderRow | null>(null)
  const [receiptForm] = Form.useForm()
  const [locatorLoading, setLocatorLoading] = useState(false)
  const [locators, setLocators] = useState<LocatorRow[]>([])

  const [createdReceiptMovement, setCreatedReceiptMovement] = useState<MovementRow | null>(null)
  const [receiptResultOpen, setReceiptResultOpen] = useState(false)
  const [receiptCompleting, setReceiptCompleting] = useState(false)

  const [voidOpen, setVoidOpen] = useState(false)
  const [voidPo, setVoidPo] = useState<PurchaseOrderRow | null>(null)
  const [voiding, setVoiding] = useState(false)
  const [voidForm] = Form.useForm()

  const [billOpen, setBillOpen] = useState(false)
  const [billPo, setBillPo] = useState<PurchaseOrderRow | null>(null)
  const [billing, setBilling] = useState(false)
  const [billForm] = Form.useForm()

  const loadCompanies = async () => {
    setCompanyLoading(true)
    try {
      const res = await coreApi.listCompanies()
      setCompanies((res || []) as CompanyRow[])
      if (!companyId && Array.isArray(res) && res.length > 0) {
        setCompanyId((res[0] as any).id ?? null)
      }
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load companies'))
    } finally {
      setCompanyLoading(false)
    }
  }

  const loadLookups = async (cid: number) => {
    setOrgLoading(true)
    setVendorLoading(true)
    setProductLoading(true)
    try {
      const [orgRes, vendorRes, productRes, priceListRes, taxRes] = await Promise.all([
        coreApi.listOrgs(cid),
        masterDataApi.listBusinessPartners(cid),
        masterDataApi.listProducts(cid),
        masterDataApi.listPriceLists(cid),
        masterDataApi.listTaxRates(cid)
      ])

      setOrgs((orgRes || []) as OrgRow[])

      const vAll = (vendorRes || []) as VendorRow[]
      setVendors(vAll.filter((v) => v.type === 'VENDOR' || v.type === 'BOTH'))

      setProducts((productRes || []) as ProductRow[])
      const pls = (priceListRes || []) as PriceListRow[]

      setTaxRates((taxRes || []) as TaxRateRow[])

      setPriceListVersionLoading(true)
      try {
        const versionLists = await Promise.all(pls.map((pl: any) => masterDataApi.listPriceListVersions(pl.id)))
        const flat = versionLists.flat().filter(Boolean)
        setPriceListVersions(flat as PriceListVersionRow[])
      } finally {
        setPriceListVersionLoading(false)
      }
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load master data lookups'))
    } finally {
      setOrgLoading(false)
      setVendorLoading(false)
      setProductLoading(false)
    }
  }

  const load = async (cid: number) => {
    setLoading(true)
    try {
      const res = await purchaseApi.listPurchaseOrders(cid)
      setRows((res || []) as PurchaseOrderRow[])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load purchase orders'))
    } finally {
      setLoading(false)
    }
  }

  const loadLocators = async (cid: number) => {
    setLocatorLoading(true)
    try {
      const res = await inventoryApi.listLocators(cid)
      setLocators((res || []) as LocatorRow[])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load locators'))
    } finally {
      setLocatorLoading(false)
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
  }, [companyId])

  const vendorLabelById = useMemo(() => {
    const m = new Map<number, string>()
    for (const v of vendors) m.set(v.id, v.name || String(v.id))
    return m
  }, [vendors])

  const productLabelById = useMemo(() => {
    const m = new Map<number, string>()
    for (const p of products) m.set(p.id, `${p.code || p.id} - ${p.name || ''}`)
    return m
  }, [products])

  const orgLabelById = useMemo(() => {
    const m = new Map<number, string>()
    for (const o of orgs) m.set(o.id, `${o.code || o.id} - ${o.name || ''}`)
    return m
  }, [orgs])

  const orgOptions = useMemo(
    () => orgs.map((o) => ({ value: o.id, label: `${o.code || o.id} - ${o.name || ''}` })),
    [orgs]
  )

  const vendorOptions = useMemo(
    () => (vendors || []).map((v: any) => ({ value: v.id, label: `${v.name || v.id}` })),
    [vendors]
  )

  const filteredRows = useMemo(() => {
    const docQ = String(filterDocNo || '').trim().toLowerCase()
    const statusQ = filterStatus ? String(filterStatus) : ''
    const vendorId = filterVendorId
    const start = filterDateRange?.[0] ? dayjs(filterDateRange[0]).startOf('day') : null
    const end = filterDateRange?.[1] ? dayjs(filterDateRange[1]).endOf('day') : null

    return (rows || []).filter((r: any) => {
      if (docQ) {
        const dn = String(r?.documentNo || '').toLowerCase()
        if (!dn.includes(docQ)) return false
      }
      if (statusQ) {
        if (String(r?.status || '') !== statusQ) return false
      }
      if (vendorId != null) {
        if (Number(r?.vendorId) !== Number(vendorId)) return false
      }
      if (start || end) {
        const od = r?.orderDate ? dayjs(r.orderDate) : null
        if (!od) return false
        if (start && od.isBefore(start)) return false
        if (end && od.isAfter(end)) return false
      }
      return true
    })
  }, [filterDateRange, filterDocNo, filterStatus, filterVendorId, rows])

  const summary = useMemo(() => {
    const list = filteredRows || []
    const total = list.reduce((acc: number, r: any) => acc + (Number(r?.grandTotal) || 0), 0)
    return {
      count: list.length,
      grandTotal: total
    }
  }, [filteredRows])

  const columns: ColumnsType<PurchaseOrderRow> = useMemo(
    () => [
      {
        title: 'Doc No',
        dataIndex: 'documentNo',
        width: 160,
        render: (v: any, r: PurchaseOrderRow) => (
          <Typography.Link
            onClick={(e) => {
              e.preventDefault()
              navigate(`/modules/purchase/purchase-orders/${r.id}`)
            }}
          >
            {v || r.id}
          </Typography.Link>
        )
      },
      {
        title: 'Status',
        dataIndex: 'status',
        width: 150,
        render: (v: string) => {
          const s = String(v || '')
          if (s === 'DRAFTED') return <Tag>Drafted</Tag>
          if (s === 'APPROVED') return <Tag color="blue">Approved</Tag>
          if (s === 'PARTIALLY_COMPLETED') return <Tag color="gold">Partially Completed</Tag>
          if (s === 'COMPLETED') return <Tag color="green">Completed</Tag>
          if (s === 'VOIDED') return <Tag color="red">Voided</Tag>
          return <Tag>{s}</Tag>
        }
      },
      { title: 'Order Date', dataIndex: 'orderDate', width: 130 },
      {
        title: 'Vendor',
        dataIndex: 'vendorId',
        render: (v: number) => vendorLabelById.get(v) || v
      },
      {
        title: 'Org',
        dataIndex: 'orgId',
        width: 220,
        render: (v: number | null) => (v ? orgLabelById.get(v) || v : '-')
      },
      {
        title: 'Grand Total',
        dataIndex: 'grandTotal',
        width: 140,
        align: 'right',
        render: (v: any) => (v == null ? '-' : Number(v).toLocaleString())
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 360,
        render: (_, r) => {
          const status = String(r.status || '')
          const canEdit = status === 'DRAFTED'
          const canApprove = status === 'DRAFTED'
          const canDelete = status === 'DRAFTED'
          const canGoodsReceipt = status === 'APPROVED' || status === 'PARTIALLY_COMPLETED'
          const canVoid = status === 'DRAFTED' || status === 'APPROVED'
          const canBill = status !== 'DRAFTED' && status !== 'VOIDED'
          const hasBillable = (r.lines || []).some((ln) => {
            const received = Number(ln.receivedQty || 0)
            const invoiced = Number((ln as any).invoicedQty || 0)
            return received - invoiced > 0
          })

          return (
            <Space wrap>
              <Button
                size="small"
                disabled={!canEdit}
                onClick={() => {
                  setEditing(r)
                  setOpen(true)

                  form.setFieldsValue({
                    orgId: r.orgId ?? null,
                    vendorId: r.vendorId,
                    orderDate: r.orderDate ? dayjs(r.orderDate) : null,
                    priceListVersionId: r.priceListVersionId,
                    lines: (r.lines || []).map((ln) => ({ productId: ln.productId, qty: ln.qty }))
                  })
                }}
              >
                Edit
              </Button>

              <Popconfirm
                title="Approve purchase order?"
                okText="Approve"
                onConfirm={async () => {
                  if (!companyId) return
                  try {
                    await purchaseApi.approvePurchaseOrder(companyId, r.id)
                    message.success('Approved')
                    await load(companyId)
                  } catch (e: any) {
                    message.error(getApiErrorMessage(e, 'Failed to approve'))
                  }
                }}
                disabled={!canApprove}
              >
                <Button size="small" type="primary" disabled={!canApprove}>
                  Approve
                </Button>
              </Popconfirm>

              <Button
                size="small"
                disabled={!canGoodsReceipt}
                onClick={async () => {
                  setReceiptPo(r)
                  setReceiptOpen(true)
                  receiptForm.resetFields()

                  if (companyId) await loadLocators(companyId)

                  const defaultLines = (r.lines || [])
                    .filter((ln) => {
                      const qty = Number(ln.qty || 0)
                      const received = Number(ln.receivedQty || 0)
                      return qty - received > 0
                    })
                    .map((ln) => {
                      const qty = Number(ln.qty || 0)
                      const received = Number(ln.receivedQty || 0)
                      return {
                        purchaseOrderLineId: ln.id,
                        qty: qty - received
                      }
                    })

                  receiptForm.setFieldsValue({
                    movementDate: dayjs(),
                    description: `Goods Receipt for PO ${r.documentNo || r.id}`,
                    toLocatorId: undefined,
                    lines: defaultLines
                  })
                }}
              >
                Goods Receipt
              </Button>

              <Popconfirm
                title="Delete purchase order?"
                okText="Delete"
                okButtonProps={{ danger: true }}
                onConfirm={async () => {
                  if (!companyId) return
                  try {
                    await purchaseApi.deletePurchaseOrder(companyId, r.id)
                    message.success('Deleted')
                    await load(companyId)
                  } catch (e: any) {
                    message.error(getApiErrorMessage(e, 'Failed to delete'))
                  }
                }}
                disabled={!canDelete}
              >
                <Button size="small" danger disabled={!canDelete}>
                  Delete
                </Button>
              </Popconfirm>

              <Button
                size="small"
                danger
                disabled={!canVoid}
                onClick={() => {
                  setVoidPo(r)
                  setVoidOpen(true)
                  voidForm.resetFields()
                  voidForm.setFieldsValue({ voidDate: dayjs(), reason: '' })
                }}
              >
                Void
              </Button>

              <Button
                size="small"
                disabled={!canBill || !hasBillable}
                onClick={() => {
                  setBillPo(r)
                  setBillOpen(true)
                  billForm.resetFields()

                  const defaultLines = (r.lines || [])
                    .filter((ln) => {
                      const received = Number(ln.receivedQty || 0)
                      const invoiced = Number((ln as any).invoicedQty || 0)
                      return received - invoiced > 0
                    })
                    .map((ln) => {
                      const received = Number(ln.receivedQty || 0)
                      const invoiced = Number((ln as any).invoicedQty || 0)
                      return {
                        purchaseOrderLineId: ln.id,
                        qty: received - invoiced
                      }
                    })

                  billForm.setFieldsValue({
                    invoiceDate: dayjs(),
                    taxRateId: undefined,
                    lines: defaultLines
                  })
                }}
              >
                Create Vendor Bill
              </Button>

              <Button
                size="small"
                onClick={() => {
                  navigate(`/modules/finance/invoices?purchaseOrderId=${encodeURIComponent(String(r.id))}`)
                }}
              >
                View Invoices
              </Button>
            </Space>
          )
        }
      }
    ],
    [billForm, companyId, form, navigate, orgLabelById, receiptForm, vendorLabelById, voidForm]
  )

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Purchase Orders
          </Typography.Title>
          <Space>
            <Button onClick={() => loadCompanies()} loading={companyLoading}>
              Refresh Companies
            </Button>
            <Button onClick={() => companyId && loadLookups(companyId)} disabled={!companyId} loading={orgLoading || vendorLoading || productLoading}>
              Refresh Lookups
            </Button>
            <Button onClick={() => companyId && load(companyId)} disabled={!companyId} loading={loading}>
              Refresh
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setEditing(null)
                setOpen(true)
                form.resetFields()
                form.setFieldsValue({
                  orderDate: dayjs(),
                  priceListVersionId: priceListVersions[0]?.id,
                  lines: [{ productId: undefined, qty: 1 }]
                })
              }}
              disabled={!companyId}
            >
              New PO
            </Button>
          </Space>
        </Space>
      </Card>

      <Card>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Typography.Text strong>Company</Typography.Text>
          <Select
            style={{ width: 420, maxWidth: '100%' }}
            loading={companyLoading}
            value={companyId ?? undefined}
            placeholder="Select company"
            options={companies.map((c) => ({ value: c.id, label: `${c.code || c.id} - ${c.name || ''}` }))}
            onChange={(v) => setCompanyId(v)}
          />
        </Space>
      </Card>

      <Card>
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space wrap>
            <div style={{ minWidth: 260 }}>
              <Typography.Text strong>Doc No</Typography.Text>
              <Input value={filterDocNo} onChange={(e) => setFilterDocNo(e.target.value)} placeholder="Search document no" />
            </div>

            <div style={{ minWidth: 220 }}>
              <Typography.Text strong>Status</Typography.Text>
              <Select
                allowClear
                placeholder="All"
                value={filterStatus ?? undefined}
                options={[
                  { value: 'DRAFTED', label: 'DRAFTED' },
                  { value: 'APPROVED', label: 'APPROVED' },
                  { value: 'PARTIALLY_COMPLETED', label: 'PARTIALLY_COMPLETED' },
                  { value: 'COMPLETED', label: 'COMPLETED' },
                  { value: 'VOIDED', label: 'VOIDED' }
                ]}
                style={{ width: '100%' }}
                onChange={(v) => setFilterStatus(v ?? null)}
              />
            </div>

            <div style={{ minWidth: 280 }}>
              <Typography.Text strong>Vendor</Typography.Text>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder="All"
                value={filterVendorId ?? undefined}
                options={vendorOptions}
                style={{ width: '100%' }}
                onChange={(v) => setFilterVendorId(v ?? null)}
              />
            </div>

            <div style={{ minWidth: 320 }}>
              <Typography.Text strong>Order Date</Typography.Text>
              <DatePicker.RangePicker style={{ width: '100%' }} value={filterDateRange} onChange={(v) => setFilterDateRange(v)} />
            </div>
          </Space>

          <Space wrap>
            <Tag>Rows: {summary.count}</Tag>
            <Tag color="blue">Total: {summary.grandTotal.toLocaleString()}</Tag>
            <Button
              onClick={() => {
                setFilterDocNo('')
                setFilterStatus(null)
                setFilterVendorId(null)
                setFilterDateRange(null)
              }}
            >
              Reset Filters
            </Button>
          </Space>
        </Space>
      </Card>

      <Card>
        <Table<PurchaseOrderRow>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={filteredRows}
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (r) => (
              <Table<PurchaseOrderLineRow>
                rowKey={(x) => String(x.id || `${x.productId}-${x.qty}`)}
                size="small"
                pagination={false}
                columns={[
                  {
                    title: 'Product',
                    dataIndex: 'productId',
                    render: (v: number) => productLabelById.get(v) || v
                  },
                  { title: 'Qty', dataIndex: 'qty', width: 120 },
                  { title: 'Received', dataIndex: 'receivedQty', width: 120 },
                  { title: 'Invoiced', dataIndex: 'invoicedQty', width: 120 },
                  {
                    title: 'Remaining',
                    key: 'remaining',
                    width: 120,
                    render: (_: any, ln: any) => {
                      const received = Number(ln?.receivedQty || 0)
                      const invoiced = Number(ln?.invoicedQty || 0)
                      const remaining = received - invoiced
                      return remaining <= 0 ? 0 : remaining
                    }
                  },
                  { title: 'Price', dataIndex: 'price', width: 120 },
                  { title: 'Line Net', dataIndex: 'lineNet', width: 140 }
                ]}
                dataSource={r.lines || []}
              />
            )
          }}
        />
      </Card>

      <Modal
        title={`Create Vendor Bill${billPo?.documentNo ? ` - ${billPo.documentNo}` : ''}`}
        open={billOpen}
        okText="Create"
        confirmLoading={billing}
        onCancel={() => {
          setBillOpen(false)
          setBillPo(null)
          billForm.resetFields()
        }}
        onOk={async () => {
          if (!companyId || !billPo) return
          try {
            setBilling(true)
            const v = await billForm.validateFields()
            const payload: any = {
              invoiceDate: toLocalDateString(v.invoiceDate),
              taxRateId: v.taxRateId ?? null,
              lines: (v.lines || []).map((ln: any) => ({
                purchaseOrderLineId: ln.purchaseOrderLineId,
                qty: ln.qty
              }))
            }
            if (!payload.taxRateId) delete payload.taxRateId

            await purchaseApi.createPurchaseInvoice(companyId, billPo.id, payload)
            message.success('Vendor bill created')
            setBillOpen(false)
            setBillPo(null)
            billForm.resetFields()
            await load(companyId)
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(getApiErrorMessage(e, 'Failed to create vendor bill'))
          } finally {
            setBilling(false)
          }
        }}
      >
        <Form layout="vertical" form={billForm}>
          <Space wrap style={{ width: '100%' }}>
            <Form.Item name="invoiceDate" label="Invoice Date" rules={[{ required: true }]} style={{ width: 240 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="taxRateId" label="Tax Rate (optional)" style={{ width: 360 }}>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                options={(taxRates || []).map((t: any) => ({
                  value: t.id,
                  label: `${t.name || t.id}${t.rate != null ? ` (${t.rate}%)` : ''}`
                }))}
              />
            </Form.Item>
          </Space>

          <Typography.Title level={5}>Invoice Lines</Typography.Title>
          <Form.List name="lines">
            {(fields, { remove }) => (
              <Space direction="vertical" style={{ width: '100%' }} size={8}>
                {fields.map((field) => {
                  const polId = billForm.getFieldValue(['lines', field.name, 'purchaseOrderLineId'])
                  const poLine = billPo?.lines?.find((x) => x.id === polId)
                  const productId = poLine?.productId
                  const label = productId ? productLabelById.get(productId) || productId : polId

                  return (
                    <Space key={field.key} align="baseline" wrap style={{ width: '100%' }}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'purchaseOrderLineId']}
                        label="PO Line"
                        rules={[{ required: true }]}
                        style={{ width: 420 }}
                      >
                        <Select
                          disabled
                          options={[
                            {
                              value: polId,
                              label
                            }
                          ]}
                        />
                      </Form.Item>

                      <Form.Item
                        {...field}
                        name={[field.name, 'qty']}
                        label="Qty"
                        rules={[{ required: true }]}
                        style={{ width: 200 }}
                      >
                        <InputNumber style={{ width: '100%' }} min={0.0001} />
                      </Form.Item>

                      <Button danger onClick={() => remove(field.name)}>
                        Remove
                      </Button>
                    </Space>
                  )
                })}
              </Space>
            )}
          </Form.List>
        </Form>
      </Modal>

      <Modal
        title={editing ? 'Edit Purchase Order' : 'Create Purchase Order'}
        open={open}
        width={860}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
          form.resetFields()
        }}
        onOk={async () => {
          if (!companyId) return
          try {
            const values = await form.validateFields()
            const payload: any = {
              orgId: values.orgId ?? null,
              vendorId: values.vendorId,
              priceListVersionId: values.priceListVersionId,
              orderDate: toLocalDateString(values.orderDate),
              lines: (values.lines || []).map((ln: any) => ({ productId: ln.productId, qty: ln.qty }))
            }
            if (!payload.orgId) delete payload.orgId

            if (editing) {
              await purchaseApi.updatePurchaseOrder(companyId, editing.id, payload)
              message.success('Updated')
            } else {
              await purchaseApi.createPurchaseOrder(companyId, payload)
              message.success('Created')
            }

            setOpen(false)
            setEditing(null)
            form.resetFields()
            await load(companyId)
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(getApiErrorMessage(e, 'Save failed'))
          }
        }}
        okText={editing ? 'Save' : 'Create'}
      >
        <Form layout="vertical" form={form}>
          <Space wrap style={{ width: '100%' }}>
            <Form.Item name="orgId" label="Org (optional)" style={{ width: 260 }}>
              <Select
                allowClear
                loading={orgLoading}
                placeholder="No org"
                options={orgOptions}
              />
            </Form.Item>

            <Form.Item name="vendorId" label="Vendor" rules={[{ required: true }]} style={{ width: 260 }}>
              <Select
                loading={vendorLoading}
                placeholder="Select vendor"
                options={vendors.map((v) => ({ value: v.id, label: v.name || String(v.id) }))}
              />
            </Form.Item>

            <Form.Item name="orderDate" label="Order Date" rules={[{ required: true }]} style={{ width: 260 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="priceListVersionId" label="Price List Version" rules={[{ required: true }]} style={{ width: 260 }}>
              <Select
                loading={priceListVersionLoading}
                placeholder="Select version"
                options={priceListVersions.map((pv: any) => ({ value: pv.id, label: pv.name || String(pv.id) }))}
              />
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
                      style={{ width: 420 }}
                    >
                      <Select
                        loading={productLoading}
                        placeholder="Select product"
                        showSearch
                        optionFilterProp="label"
                        options={products.map((p) => ({ value: p.id, label: `${p.code || p.id} - ${p.name || ''}` }))}
                      />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'qty']}
                      label="Qty"
                      rules={[{ required: true }]}
                      style={{ width: 160 }}
                    >
                      <InputNumber style={{ width: '100%' }} min={0.0001} />
                    </Form.Item>

                    <Button danger onClick={() => remove(field.name)} disabled={fields.length <= 1}>
                      Remove
                    </Button>
                  </Space>
                ))}

                <Button onClick={() => add({ qty: 1 })}>Add Line</Button>
              </Space>
            )}
          </Form.List>
        </Form>
      </Modal>

      <Modal
        title="Goods Receipt Created"
        open={receiptResultOpen}
        onCancel={() => {
          setReceiptResultOpen(false)
          setCreatedReceiptMovement(null)
        }}
        footer={null}
      >
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <div>
            <Typography.Text strong>Movement Doc No:</Typography.Text>
            <div>{createdReceiptMovement?.documentNo || createdReceiptMovement?.id || '-'}</div>
          </div>
          <div>
            <Typography.Text strong>Status:</Typography.Text>
            <div>{createdReceiptMovement?.status || '-'}</div>
          </div>

          <Space wrap style={{ justifyContent: 'flex-end', width: '100%' }}>
            <Button
              onClick={() => {
                const dn = createdReceiptMovement?.documentNo
                const q = dn ? encodeURIComponent(String(dn)) : ''
                navigate(`/modules/inventory/movements${q ? `?q=${q}` : ''}`)
                setReceiptResultOpen(false)
                setCreatedReceiptMovement(null)
              }}
            >
              Open Movements
            </Button>
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
                  await load(companyId)
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
        </Space>
      </Modal>

      <Modal
        title={`Goods Receipt${receiptPo?.documentNo ? ` - ${receiptPo.documentNo}` : ''}`}
        open={receiptOpen}
        width={860}
        onCancel={() => {
          setReceiptOpen(false)
          setReceiptPo(null)
          receiptForm.resetFields()
        }}
        onOk={async () => {
          if (!companyId || !receiptPo) return
          try {
            const values = await receiptForm.validateFields()
            const payload: any = {
              toLocatorId: values.toLocatorId,
              movementDate: toLocalDateString(values.movementDate),
              description: values.description,
              lines: (values.lines || []).map((ln: any) => ({
                purchaseOrderLineId: ln.purchaseOrderLineId,
                qty: ln.qty
              }))
            }

            const mv = (await purchaseApi.createGoodsReceipt(companyId, receiptPo.id, payload)) as any
            message.success('Goods receipt created')

            if (mv && mv.id) {
              setCreatedReceiptMovement({ id: mv.id, documentNo: mv.documentNo, status: mv.status })
              setReceiptResultOpen(true)
            }

            setReceiptOpen(false)
            setReceiptPo(null)
            receiptForm.resetFields()
            await load(companyId)
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(getApiErrorMessage(e, 'Failed to create goods receipt'))
          }
        }}
        okText="Create"
      >
        <Form layout="vertical" form={receiptForm}>
          <Space wrap style={{ width: '100%' }}>
            <Form.Item name="toLocatorId" label="To Locator" rules={[{ required: true }]} style={{ width: 360 }}>
              <Select
                loading={locatorLoading}
                placeholder="Select locator"
                showSearch
                optionFilterProp="label"
                options={locators.map((l: any) => ({ value: l.id, label: `${l.code || l.id} - ${l.name || ''}` }))}
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
            {(fields, { remove }) => (
              <Space direction="vertical" style={{ width: '100%' }} size={8}>
                {fields.map((field) => {
                  const polId = receiptForm.getFieldValue(['lines', field.name, 'purchaseOrderLineId'])
                  const poLine = receiptPo?.lines?.find((x) => x.id === polId)
                  const productId = poLine?.productId
                  const label = productId ? productLabelById.get(productId) || productId : polId

                  return (
                    <Space key={field.key} align="baseline" wrap style={{ width: '100%' }}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'purchaseOrderLineId']}
                        label="PO Line"
                        rules={[{ required: true }]}
                        style={{ width: 420 }}
                      >
                        <Select
                          disabled
                          options={[
                            {
                              value: polId,
                              label
                            }
                          ]}
                        />
                      </Form.Item>

                      <Form.Item
                        {...field}
                        name={[field.name, 'qty']}
                        label="Qty"
                        rules={[{ required: true }]}
                        style={{ width: 200 }}
                      >
                        <InputNumber style={{ width: '100%' }} min={0.0001} />
                      </Form.Item>

                      <Button danger onClick={() => remove(field.name)}>
                        Remove
                      </Button>
                    </Space>
                  )
                })}
              </Space>
            )}
          </Form.List>
        </Form>
      </Modal>

      <Modal
        title={`Void Purchase Order${voidPo?.documentNo ? ` - ${voidPo.documentNo}` : ''}`}
        open={voidOpen}
        okText="Void"
        okButtonProps={{ danger: true }}
        confirmLoading={voiding}
        onCancel={() => {
          setVoidOpen(false)
          setVoidPo(null)
          voidForm.resetFields()
        }}
        onOk={async () => {
          if (!companyId || !voidPo) return
          try {
            setVoiding(true)
            const v = await voidForm.validateFields()
            await purchaseApi.voidPurchaseOrder(companyId, voidPo.id, {
              voidDate: toLocalDateString(v.voidDate),
              reason: v.reason || null
            })
            message.success('Voided')
            setVoidOpen(false)
            setVoidPo(null)
            voidForm.resetFields()
            await load(companyId)
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(getApiErrorMessage(e, 'Failed to void purchase order'))
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
