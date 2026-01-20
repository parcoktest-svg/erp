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
import { coreApi, hrApi, masterDataApi, salesApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import { getApiErrorMessage } from '@/utils/error'

type SalesOrderType = 'DOMESTIC' | 'EXPORT'

type CompanyRow = { id: number; code?: string; name?: string }

type OrgRow = { id: number; code?: string; name?: string }

type SalesOrderRow = {
  id: number
  documentNo?: string
  status?: string
  orderDate?: string
  grandTotal?: string | number
  orderType?: SalesOrderType
  lines?: any[]
  deliverySchedules?: any[]
}

function toLocalDateString(d: any): string | null {
  if (!d) return null
  return dayjs(d).format('YYYY-MM-DD')
}

export default function SalesOrdersView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [orgLoading, setOrgLoading] = useState(false)
  const [orgs, setOrgs] = useState<OrgRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<SalesOrderRow[]>([])

  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)

  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [priceListVersions, setPriceListVersions] = useState<any[]>([])
  const [currencies, setCurrencies] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])

  const [form] = Form.useForm()

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
    try {
      const [orgRes, bps, prods, pls, curs, depts, emps, whs] = await Promise.all([
        coreApi.listOrgs(cid),
        masterDataApi.listBusinessPartners(cid),
        masterDataApi.listProducts(cid),
        masterDataApi.listPriceLists(cid),
        masterDataApi.listCurrencies(cid),
        hrApi.listDepartments(),
        hrApi.listEmployees(),
        masterDataApi.listWarehouses(cid)
      ])

      setOrgs((orgRes || []) as OrgRow[])
      setCustomers((bps || []).filter((x: any) => x.type === 'CUSTOMER' || x.type === 'BOTH'))
      setProducts(prods || [])
      setCurrencies(curs || [])
      setDepartments(depts || [])
      setEmployees(emps || [])
      setWarehouses(whs || [])

      const plArr = pls || []
      const versionLists = await Promise.all(plArr.map((pl: any) => masterDataApi.listPriceListVersions(pl.id)))
      const flat = versionLists.flat().filter(Boolean)
      setPriceListVersions(flat)
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load lookups'))
      setOrgs([])
      setCustomers([])
      setProducts([])
      setPriceListVersions([])
      setCurrencies([])
      setDepartments([])
      setEmployees([])
      setWarehouses([])
    } finally {
      setOrgLoading(false)
    }
  }

  const load = async (cid: number) => {
    setLoading(true)
    try {
      const res = await salesApi.listSalesOrders(cid)
      setRows((res || []) as SalesOrderRow[])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load sales orders'))
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
    if (!companyId) {
      setRows([])
      return
    }
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

  const productOptions = useMemo(
    () => (products || []).map((p: any) => ({ label: `${p.code} - ${p.name}`, value: p.id })),
    [products]
  )

  const customerOptions = useMemo(
    () => (customers || []).map((c: any) => ({ label: c.name || c.code || String(c.id), value: c.id })),
    [customers]
  )

  const plvOptions = useMemo(
    () => (priceListVersions || []).map((p: any) => ({ label: p.name || p.code || String(p.id), value: p.id })),
    [priceListVersions]
  )

  const deptOptions = useMemo(
    () => (departments || []).map((d: any) => ({ label: d.name || String(d.id), value: d.id })),
    [departments]
  )

  const empOptions = useMemo(
    () => (employees || []).map((e: any) => ({ label: e.name || e.email || String(e.id), value: e.id })),
    [employees]
  )

  const whOptions = useMemo(
    () =>
      (warehouses || []).map((w: any) => ({
        label: `${w.code || ''} ${w.name || ''}`.trim() || String(w.id),
        value: w.id
      })),
    [warehouses]
  )

  const currencyOptions = useMemo(
    () => (currencies || []).map((c: any) => ({ label: `${c.code} - ${c.name}`, value: c.id })),
    [currencies]
  )

  function canEditRow(r: SalesOrderRow) {
    return (r.status || '') === 'DRAFTED'
  }

  const columns: ColumnsType<SalesOrderRow> = [
    { title: 'Document No', dataIndex: 'documentNo', width: 180 },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 160,
      render: (v: any) => {
        const s = String(v || '')
        if (s === 'DRAFTED') return <Tag>Drafted</Tag>
        if (s === 'APPROVED') return <Tag color="blue">Approved</Tag>
        if (s === 'PARTIALLY_COMPLETED') return <Tag color="gold">Partially Completed</Tag>
        if (s === 'COMPLETED') return <Tag color="green">Completed</Tag>
        if (s === 'VOIDED') return <Tag color="red">Voided</Tag>
        return <Tag>{s}</Tag>
      }
    },
    { title: 'Order Date', dataIndex: 'orderDate', width: 140 },
    { title: 'Type', dataIndex: 'orderType', width: 120 },
    { title: 'Grand Total', dataIndex: 'grandTotal', width: 140 },
    {
      title: 'Action',
      key: 'action',
      width: 240,
      render: (_, r) => (
        <Space>
          <Button size="small" disabled={!canEditRow(r)} onClick={() => void openEdit(r)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete sales order?"
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => void onDelete(r)}
            disabled={!canEditRow(r)}
          >
            <Button size="small" danger disabled={!canEditRow(r)}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  async function openCreate() {
    setEditId(null)
    form.resetFields()
    form.setFieldsValue({
      orgId: null,
      orderType: 'DOMESTIC',
      orderDate: dayjs(),
      priceListVersionId: priceListVersions[0]?.id,
      lines: [{ productId: products[0]?.id ?? null, qty: 1 }],
      deliverySchedules: []
    })
    setOpen(true)
  }

  async function openEdit(row: SalesOrderRow) {
    if (!companyId) return
    setSaving(true)
    try {
      const detail = await salesApi.getSalesOrder(companyId, row.id)
      setEditId(detail?.id ?? row.id)

      const orderType: SalesOrderType = (detail.orderType || 'DOMESTIC') as SalesOrderType

      form.resetFields()
      form.setFieldsValue({
        orgId: detail.orgId ?? null,
        orderType,
        businessPartnerId: detail.businessPartnerId ?? null,
        priceListVersionId: detail.priceListVersionId ?? null,
        orderDate: detail.orderDate ? dayjs(detail.orderDate) : dayjs(),

        buyerPo: detail.buyerPo || '',
        departmentId: detail.departmentId ?? null,
        employeeId: detail.employeeId ?? null,
        inCharge: detail.inCharge || '',
        paymentCondition: detail.paymentCondition || '',
        deliveryPlace: detail.deliveryPlace || '',
        forwardingWarehouseId: detail.forwardingWarehouseId ?? null,
        memo: detail.memo || '',

        currencyId: detail.currencyId ?? null,
        exchangeRate: detail.exchangeRate ?? null,
        foreignAmount: detail.foreignAmount ?? null,

        lines: Array.isArray(detail.lines)
          ? detail.lines.map((l: any) => ({
              productId: l.productId ?? null,
              qty: l.qty ?? null,
              unitPrice: l.price ?? null,
              description: l.description ?? '',
              unit: l.unit ?? '',
              size: l.size ?? '',
              nationalSize: l.nationalSize ?? '',
              style: l.style ?? '',
              cuttingNo: l.cuttingNo ?? '',
              color: l.color ?? '',
              destination: l.destination ?? '',
              supplyAmount: l.supplyAmount ?? null,
              vatAmount: l.vatAmount ?? null,
              fobPrice: l.fobPrice ?? null,
              ldpPrice: l.ldpPrice ?? null,
              dpPrice: l.dpPrice ?? null,
              cmtCost: l.cmtCost ?? null,
              cmCost: l.cmCost ?? null,
              fabricEta: l.fabricEta ? dayjs(l.fabricEta) : null,
              fabricEtd: l.fabricEtd ? dayjs(l.fabricEtd) : null,
              deliveryDate: l.deliveryDate ? dayjs(l.deliveryDate) : null,
              shipMode: l.shipMode ?? '',
              factory: l.factory ?? '',
              remark: l.remark ?? '',
              filePath: l.filePath ?? ''
            }))
          : [{ productId: products[0]?.id ?? null, qty: 1 }],

        deliverySchedules:
          orderType === 'DOMESTIC' && Array.isArray(detail.deliverySchedules)
            ? detail.deliverySchedules.map((s: any) => ({
                deliveryDate: s.deliveryDate ? dayjs(s.deliveryDate) : null,
                shipMode: s.shipMode ?? '',
                factory: s.factory ?? '',
                remark: s.remark ?? '',
                filePath: s.filePath ?? ''
              }))
            : []
      })

      setOpen(true)
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed'))
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(row: SalesOrderRow) {
    if (!companyId) return
    try {
      await salesApi.deleteSalesOrder(companyId, row.id)
      message.success('Deleted')
      await load(companyId)
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed'))
    }
  }

  async function save() {
    if (!companyId) return

    const values = await form.validateFields()
    const orderType: SalesOrderType = values.orderType || 'DOMESTIC'

    const payload: any = {
      orgId: values.orgId || null,
      orderType,
      businessPartnerId: values.businessPartnerId,
      priceListVersionId: values.priceListVersionId,
      orderDate: toLocalDateString(values.orderDate),

      buyerPo: values.buyerPo || null,
      departmentId: values.departmentId || null,
      employeeId: values.employeeId || null,
      inCharge: values.inCharge || null,
      paymentCondition: values.paymentCondition || null,
      deliveryPlace: values.deliveryPlace || null,
      forwardingWarehouseId: values.forwardingWarehouseId || null,
      memo: values.memo || null,

      currencyId: orderType === 'EXPORT' ? values.currencyId || null : null,
      exchangeRate: orderType === 'EXPORT' ? values.exchangeRate ?? null : null,
      foreignAmount: orderType === 'EXPORT' ? values.foreignAmount ?? null : null,

      lines: (values.lines || []).map((l: any) => ({
        productId: l.productId,
        qty: l.qty,
        unitPrice: l.unitPrice ?? null,
        description: l.description || null,
        unit: l.unit || null,
        size: l.size || null,
        nationalSize: l.nationalSize || null,
        style: l.style || null,
        cuttingNo: l.cuttingNo || null,
        color: l.color || null,
        destination: l.destination || null,
        supplyAmount: l.supplyAmount ?? null,
        vatAmount: l.vatAmount ?? null,
        fobPrice: l.fobPrice ?? null,
        ldpPrice: l.ldpPrice ?? null,
        dpPrice: l.dpPrice ?? null,
        cmtCost: l.cmtCost ?? null,
        cmCost: l.cmCost ?? null,
        fabricEta: toLocalDateString(l.fabricEta),
        fabricEtd: toLocalDateString(l.fabricEtd),
        deliveryDate: toLocalDateString(l.deliveryDate),
        shipMode: l.shipMode || null,
        factory: l.factory || null,
        remark: l.remark || null,
        filePath: l.filePath || null
      })),
      deliverySchedules:
        orderType === 'DOMESTIC'
          ? (values.deliverySchedules || []).map((s: any) => ({
              deliveryDate: toLocalDateString(s.deliveryDate),
              shipMode: s.shipMode || null,
              factory: s.factory || null,
              remark: s.remark || null,
              filePath: s.filePath || null
            }))
          : null
    }

    setSaving(true)
    try {
      if (editId) {
        await salesApi.updateSalesOrder(companyId, editId, payload)
        message.success('Updated')
      } else {
        await salesApi.createSalesOrder(companyId, payload)
        message.success('Created')
      }
      setOpen(false)
      await load(companyId)
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed'))
    } finally {
      setSaving(false)
    }
  }

  const orderType = Form.useWatch('orderType', form) as SalesOrderType | undefined

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Sales Orders
            </Typography.Title>
            <Typography.Text type="secondary">Buat SO untuk customer, lalu lanjut proses berikutnya.</Typography.Text>
          </div>
          <Space>
            <Button onClick={() => companyId && loadLookups(companyId)} disabled={!companyId} loading={orgLoading}>
              Refresh Lookups
            </Button>
            <Button onClick={() => companyId && load(companyId)} disabled={!companyId} loading={loading}>
              Refresh
            </Button>
            <Button type="primary" disabled={!companyId} onClick={() => void openCreate()}>
              Create SO
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
            options={companyOptions}
            onChange={(v) => setCompanyId(v)}
          />
        </Space>
      </Card>

      <Card>
        {!companyId ? <Tag color="orange">Pilih company dulu.</Tag> : <Table rowKey="id" dataSource={rows} columns={columns} loading={loading} />}
      </Card>

      <Modal
        open={open}
        title={editId ? 'Edit Sales Order' : 'Create Sales Order'}
        width={1100}
        onCancel={() => setOpen(false)}
        onOk={() => void save()}
        okButtonProps={{ loading: saving }}
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item label="Org" name="orgId">
              <Select allowClear loading={orgLoading} options={orgOptions} placeholder="Org (optional)" />
            </Form.Item>
            <Form.Item label="Order Type" name="orderType" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: 'Domestic', value: 'DOMESTIC' },
                  { label: 'Export', value: 'EXPORT' }
                ]}
                onChange={(v) => {
                  if (v === 'EXPORT') {
                    form.setFieldsValue({ deliverySchedules: [] })
                  }
                }}
              />
            </Form.Item>
            <Form.Item label="Customer" name="businessPartnerId" rules={[{ required: true }]}>
              <Select showSearch options={customerOptions} optionFilterProp="label" />
            </Form.Item>
            <Form.Item label="Price List Version" name="priceListVersionId" rules={[{ required: true }]}>
              <Select showSearch options={plvOptions} optionFilterProp="label" />
            </Form.Item>
            <Form.Item label="Order Date" name="orderDate" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

          {orderType === 'EXPORT' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <Form.Item label="Buyer PO" name="buyerPo">
                <Input />
              </Form.Item>
              <Form.Item label="Department" name="departmentId">
                <Select allowClear showSearch options={deptOptions} optionFilterProp="label" />
              </Form.Item>
              <Form.Item label="Employee" name="employeeId">
                <Select allowClear showSearch options={empOptions} optionFilterProp="label" />
              </Form.Item>

              <Form.Item label="In Charge" name="inCharge">
                <Input />
              </Form.Item>
              <Form.Item label="Payment Condition" name="paymentCondition">
                <Input />
              </Form.Item>
              <Form.Item label="Delivery Place" name="deliveryPlace">
                <Input />
              </Form.Item>

              <Form.Item label="Forwarding Warehouse" name="forwardingWarehouseId">
                <Select allowClear showSearch options={whOptions} optionFilterProp="label" />
              </Form.Item>
              <Form.Item label="Currency" name="currencyId" rules={[{ required: orderType === 'EXPORT' }]}>
                <Select allowClear showSearch options={currencyOptions} optionFilterProp="label" />
              </Form.Item>
              <Form.Item label="Exchange Rate" name="exchangeRate">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>

              <Form.Item label="Foreign Amount" name="foreignAmount">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
              <Form.Item label="Memo" name="memo">
                <Input />
              </Form.Item>
            </div>
          ) : (
            <Form.Item label="Memo" name="memo">
              <Input />
            </Form.Item>
          )}

          <Typography.Title level={5}>Lines</Typography.Title>
          <Form.List name="lines">
            {(fields, { add, remove }) => (
              <Space direction="vertical" style={{ width: '100%' }} size={8}>
                {fields.map((field) => (
                  <Card key={field.key} size="small">
                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                      <Space wrap style={{ width: '100%' }}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'productId']}
                          label="Product"
                          rules={[{ required: true }]}
                          style={{ width: 420 }}
                        >
                          <Select showSearch options={productOptions} optionFilterProp="label" />
                        </Form.Item>
                        <Form.Item {...field} name={[field.name, 'qty']} label="Qty" rules={[{ required: true }]} style={{ width: 160 }}>
                          <InputNumber style={{ width: '100%' }} min={0.0001} />
                        </Form.Item>
                        {orderType === 'DOMESTIC' ? (
                          <Form.Item {...field} name={[field.name, 'unitPrice']} label="Unit Price" style={{ width: 160 }}>
                            <InputNumber style={{ width: '100%' }} min={0} />
                          </Form.Item>
                        ) : null}
                        <Button danger onClick={() => remove(field.name)} disabled={fields.length <= 1}>
                          Remove
                        </Button>
                      </Space>

                      {orderType === 'DOMESTIC' ? (
                        <>
                          <Space wrap style={{ width: '100%' }}>
                            <Form.Item {...field} name={[field.name, 'description']} label="Description" style={{ width: 420 }}>
                              <Input />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'unit']} label="Unit" style={{ width: 160 }}>
                              <Input />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'size']} label="Size" style={{ width: 160 }}>
                              <Input />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'nationalSize']} label="National Size" style={{ width: 160 }}>
                              <Input />
                            </Form.Item>
                          </Space>
                          <Space wrap style={{ width: '100%' }}>
                            <Form.Item {...field} name={[field.name, 'style']} label="Style" style={{ width: 160 }}>
                              <Input />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'cuttingNo']} label="Cutting No" style={{ width: 160 }}>
                              <Input />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'color']} label="Color" style={{ width: 160 }}>
                              <Input />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'destination']} label="Destination" style={{ width: 220 }}>
                              <Input />
                            </Form.Item>
                          </Space>
                          <Space wrap style={{ width: '100%' }}>
                            <Form.Item {...field} name={[field.name, 'supplyAmount']} label="Supply" style={{ width: 160 }}>
                              <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'vatAmount']} label="VAT" style={{ width: 160 }}>
                              <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'fobPrice']} label="FOB" style={{ width: 160 }}>
                              <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'ldpPrice']} label="LDP" style={{ width: 160 }}>
                              <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                          </Space>
                        </>
                      ) : null}

                      {(orderType === 'DOMESTIC' || orderType === 'EXPORT') && orderType ? (
                        <Space wrap style={{ width: '100%' }}>
                          <Form.Item {...field} name={[field.name, 'cmtCost']} label="CMT Cost" style={{ width: 160 }}>
                            <InputNumber style={{ width: '100%' }} min={0} />
                          </Form.Item>
                          <Form.Item {...field} name={[field.name, 'cmCost']} label="CM Cost" style={{ width: 160 }}>
                            <InputNumber style={{ width: '100%' }} min={0} />
                          </Form.Item>
                          <Form.Item {...field} name={[field.name, 'fabricEta']} label="Fabric ETA" style={{ width: 200 }}>
                            <DatePicker style={{ width: '100%' }} />
                          </Form.Item>
                          <Form.Item {...field} name={[field.name, 'fabricEtd']} label="Fabric ETD" style={{ width: 200 }}>
                            <DatePicker style={{ width: '100%' }} />
                          </Form.Item>
                        </Space>
                      ) : null}

                      {orderType === 'EXPORT' ? (
                        <>
                          <Space wrap style={{ width: '100%' }}>
                            <Form.Item {...field} name={[field.name, 'dpPrice']} label="DP Price" style={{ width: 200 }}>
                              <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'deliveryDate']} label="Delivery Date" style={{ width: 200 }}>
                              <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'shipMode']} label="Ship Mode" style={{ width: 200 }}>
                              <Input />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'factory']} label="Factory" style={{ width: 200 }}>
                              <Input />
                            </Form.Item>
                          </Space>
                          <Space wrap style={{ width: '100%' }}>
                            <Form.Item {...field} name={[field.name, 'remark']} label="Remark" style={{ width: 420 }}>
                              <Input />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'filePath']} label="File Path" style={{ width: 420 }}>
                              <Input placeholder="/path/to/file" />
                            </Form.Item>
                          </Space>
                        </>
                      ) : null}
                    </Space>
                  </Card>
                ))}

                <Button onClick={() => add({ productId: products[0]?.id ?? null, qty: 1 })}>Add Line</Button>
              </Space>
            )}
          </Form.List>

          {orderType === 'DOMESTIC' ? (
            <>
              <Typography.Title level={5} style={{ marginTop: 16 }}>
                Delivery Schedules
              </Typography.Title>
              <Form.List name="deliverySchedules">
                {(fields, { add, remove }) => (
                  <Space direction="vertical" style={{ width: '100%' }} size={8}>
                    {fields.map((field) => (
                      <Space key={field.key} align="baseline" wrap style={{ width: '100%' }}>
                        <Form.Item {...field} name={[field.name, 'deliveryDate']} label="Delivery Date" style={{ width: 200 }}>
                          <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item {...field} name={[field.name, 'shipMode']} label="Ship Mode" style={{ width: 200 }}>
                          <Input />
                        </Form.Item>
                        <Form.Item {...field} name={[field.name, 'factory']} label="Factory" style={{ width: 200 }}>
                          <Input />
                        </Form.Item>
                        <Form.Item {...field} name={[field.name, 'remark']} label="Remark" style={{ width: 260 }}>
                          <Input />
                        </Form.Item>
                        <Form.Item {...field} name={[field.name, 'filePath']} label="File" style={{ width: 260 }}>
                          <Input />
                        </Form.Item>
                        <Button danger onClick={() => remove(field.name)}>
                          Remove
                        </Button>
                      </Space>
                    ))}

                    <Button onClick={() => add({})}>Add Schedule</Button>
                  </Space>
                )}
              </Form.List>
            </>
          ) : null}
        </Form>
      </Modal>
    </Space>
  )
}
