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

  const [priceListVersionLoading, setPriceListVersionLoading] = useState(false)
  const [priceListVersions, setPriceListVersions] = useState<PriceListVersionRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<PurchaseOrderRow[]>([])

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
      const [orgRes, vendorRes, productRes, priceListRes] = await Promise.all([
        coreApi.listOrgs(cid),
        masterDataApi.listBusinessPartners(cid),
        masterDataApi.listProducts(cid),
        masterDataApi.listPriceLists(cid)
      ])

      setOrgs((orgRes || []) as OrgRow[])

      const vAll = (vendorRes || []) as VendorRow[]
      setVendors(vAll.filter((v) => v.type === 'VENDOR' || v.type === 'BOTH'))

      setProducts((productRes || []) as ProductRow[])
      const pls = (priceListRes || []) as PriceListRow[]

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

  const columns: ColumnsType<PurchaseOrderRow> = useMemo(
    () => [
      { title: 'Doc No', dataIndex: 'documentNo', width: 160 },
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
            </Space>
          )
        }
      }
    ],
    [companyId, form, orgLabelById, receiptForm, vendorLabelById]
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
        <Table<PurchaseOrderRow>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={rows}
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
                options={orgs.map((o) => ({ value: o.id, label: `${o.code || o.id} - ${o.name || ''}` }))}
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
