import { Button, Card, DatePicker, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { hrApi, masterDataApi, salesApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import CompanyOrgBar from '@/views/modules/common/CompanyOrgBar'

type SalesOrderType = 'DOMESTIC' | 'EXPORT'

type SalesOrderRow = {
  id: number
  documentNo?: string
  status?: string
  orderDate?: string
  grandTotal?: string | number
  deliverySchedules?: any[]
  lines?: any[]
}

type LineForm = {
  productId: number | null
  qty: string
  unitPrice: string
  description: string
  unit: string
  size: string
  nationalSize: string
  style: string
  cuttingNo: string
  color: string
  destination: string
  supplyAmount: string
  vatAmount: string
  fobPrice: string
  ldpPrice: string
  dpPrice: string
  cmtCost: string
  cmCost: string
  fabricEta: string
  fabricEtd: string
  deliveryDate: string
  shipMode: string
  factory: string
  remark: string
  filePath: string
}

type ScheduleForm = {
  deliveryDate: string
  shipMode: string
  factory: string
  remark: string
  filePath: string
}

type FormState = {
  id: number | null
  orgId: number | null
  orderType: SalesOrderType
  businessPartnerId: number | null
  priceListVersionId: number | null
  orderDate: string

  buyerPo: string
  departmentId: number | null
  employeeId: number | null
  inCharge: string
  paymentCondition: string
  deliveryPlace: string
  forwardingWarehouseId: number | null
  memo: string

  currencyId: number | null
  exchangeRate: string
  foreignAmount: string

  lines: LineForm[]
  deliverySchedules: ScheduleForm[]
}

function emptyLine(productId: number | null): LineForm {
  return {
    productId,
    qty: '1',
    unitPrice: '',
    description: '',
    unit: '',
    size: '',
    nationalSize: '',
    style: '',
    cuttingNo: '',
    color: '',
    destination: '',
    supplyAmount: '',
    vatAmount: '',
    fobPrice: '',
    ldpPrice: '',
    dpPrice: '',
    cmtCost: '',
    cmCost: '',
    fabricEta: '',
    fabricEtd: '',
    deliveryDate: '',
    shipMode: '',
    factory: '',
    remark: '',
    filePath: ''
  }
}

function emptyForm(orgId: number | null): FormState {
  return {
    id: null,
    orgId,
    orderType: 'DOMESTIC',
    businessPartnerId: null,
    priceListVersionId: null,
    orderDate: dayjs().format('YYYY-MM-DD'),

    buyerPo: '',
    departmentId: null,
    employeeId: null,
    inCharge: '',
    paymentCondition: '',
    deliveryPlace: '',
    forwardingWarehouseId: null,
    memo: '',

    currencyId: null,
    exchangeRate: '',
    foreignAmount: '',

    lines: [],
    deliverySchedules: []
  }
}

export default function SalesOrdersView() {
  const companyId = useContextStore((s) => s.companyId)
  const orgId = useContextStore((s) => s.orgId)

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<SalesOrderRow[]>([])

  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState<'create' | 'edit'>('create')
  const [form, setForm] = useState<FormState>(() => emptyForm(orgId))

  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [priceLists, setPriceLists] = useState<any[]>([])
  const [priceListVersions, setPriceListVersions] = useState<any[]>([])
  const [currencies, setCurrencies] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])

  useEffect(() => {
    setForm((prev) => ({ ...prev, orgId }))
  }, [orgId])

  const canSave = useMemo(() => {
    if (!companyId) return false
    if (!form.businessPartnerId) return false
    if (!form.priceListVersionId) return false
    if (!form.orderDate) return false
    if (!form.lines.length) return false
    if (form.lines.some((l) => !l.productId || !String(l.qty || '').trim())) return false
    return true
  }, [companyId, form])

  function canEditRow(r: SalesOrderRow) {
    return (r.status || '') === 'DRAFTED'
  }

  async function loadLookups() {
    if (!companyId) {
      setCustomers([])
      setProducts([])
      setPriceLists([])
      setPriceListVersions([])
      setCurrencies([])
      setDepartments([])
      setEmployees([])
      setWarehouses([])
      return
    }
    try {
      const [bps, prods, pls, curs, depts, emps, whs] = await Promise.all([
        masterDataApi.listBusinessPartners(companyId),
        masterDataApi.listProducts(companyId),
        masterDataApi.listPriceLists(companyId),
        masterDataApi.listCurrencies(companyId),
        hrApi.listDepartments(),
        hrApi.listEmployees(),
        masterDataApi.listWarehouses(companyId)
      ])

      setCustomers((bps || []).filter((x: any) => x.type === 'CUSTOMER' || x.type === 'BOTH'))
      setProducts(prods || [])
      setPriceLists(pls || [])
      setCurrencies(curs || [])
      setDepartments(depts || [])
      setEmployees(emps || [])
      setWarehouses(whs || [])

      const plId = (pls || [])[0]?.id
      const plv = plId ? await masterDataApi.listPriceListVersions(plId) : []
      setPriceListVersions(plv || [])
    } catch {
      setCustomers([])
      setProducts([])
      setPriceLists([])
      setPriceListVersions([])
      setCurrencies([])
      setDepartments([])
      setEmployees([])
      setWarehouses([])
    }
  }

  async function load() {
    if (!companyId) {
      setRows([])
      return
    }
    setLoading(true)
    try {
      setRows((await salesApi.listSalesOrders(companyId)) || [])
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || 'Failed')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadLookups()
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  function addLine() {
    setForm((prev) => ({
      ...prev,
      lines: [...prev.lines, emptyLine(products[0]?.id ?? null)]
    }))
  }

  function removeLine(idx: number) {
    setForm((prev) => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== idx)
    }))
  }

  function addSchedule() {
    setForm((prev) => ({
      ...prev,
      deliverySchedules: [
        ...prev.deliverySchedules,
        { deliveryDate: '', shipMode: '', factory: '', remark: '', filePath: '' }
      ]
    }))
  }

  function removeSchedule(idx: number) {
    setForm((prev) => ({
      ...prev,
      deliverySchedules: prev.deliverySchedules.filter((_, i) => i !== idx)
    }))
  }

  function openCreate() {
    setEditMode('create')
    const f = emptyForm(orgId)
    f.priceListVersionId = priceListVersions[0]?.id ?? null
    f.lines = [emptyLine(products[0]?.id ?? null)]
    setForm(f)
    setOpen(true)
  }

  async function openEdit(row: any) {
    if (!companyId) return
    setEditMode('edit')
    setSaving(true)
    try {
      const detail = await salesApi.getSalesOrder(companyId, row.id)

      const f = emptyForm(orgId)
      f.id = detail.id
      f.orgId = detail.orgId ?? orgId
      f.orderType = (detail.orderType || 'DOMESTIC') as SalesOrderType
      f.businessPartnerId = detail.businessPartnerId ?? null
      f.priceListVersionId = detail.priceListVersionId ?? null
      f.orderDate = detail.orderDate || dayjs().format('YYYY-MM-DD')

      f.buyerPo = detail.buyerPo || ''
      f.departmentId = detail.departmentId ?? null
      f.employeeId = detail.employeeId ?? null
      f.inCharge = detail.inCharge || ''
      f.paymentCondition = detail.paymentCondition || ''
      f.deliveryPlace = detail.deliveryPlace || ''
      f.forwardingWarehouseId = detail.forwardingWarehouseId ?? null
      f.memo = detail.memo || ''

      f.currencyId = detail.currencyId ?? null
      f.exchangeRate = detail.exchangeRate != null ? String(detail.exchangeRate) : ''
      f.foreignAmount = detail.foreignAmount != null ? String(detail.foreignAmount) : ''

      f.lines = Array.isArray(detail.lines)
        ? detail.lines.map((l: any) => ({
            ...emptyLine(l.productId ?? null),
            productId: l.productId ?? null,
            qty: l.qty != null ? String(l.qty) : '',
            unitPrice: l.price != null ? String(l.price) : '',
            description: l.description || '',
            unit: l.unit || '',
            size: l.size || '',
            nationalSize: l.nationalSize || '',
            style: l.style || '',
            cuttingNo: l.cuttingNo || '',
            color: l.color || '',
            destination: l.destination || '',
            supplyAmount: l.supplyAmount != null ? String(l.supplyAmount) : '',
            vatAmount: l.vatAmount != null ? String(l.vatAmount) : '',
            fobPrice: l.fobPrice != null ? String(l.fobPrice) : '',
            ldpPrice: l.ldpPrice != null ? String(l.ldpPrice) : '',
            dpPrice: l.dpPrice != null ? String(l.dpPrice) : '',
            cmtCost: l.cmtCost != null ? String(l.cmtCost) : '',
            cmCost: l.cmCost != null ? String(l.cmCost) : '',
            fabricEta: l.fabricEta || '',
            fabricEtd: l.fabricEtd || '',
            deliveryDate: l.deliveryDate || '',
            shipMode: l.shipMode || '',
            factory: l.factory || '',
            remark: l.remark || '',
            filePath: l.filePath || ''
          }))
        : []

      const schedules = Array.isArray(detail.deliverySchedules) ? detail.deliverySchedules : []
      f.deliverySchedules =
        f.orderType === 'DOMESTIC'
          ? schedules.map((s: any) => ({
              deliveryDate: s.deliveryDate || '',
              shipMode: s.shipMode || '',
              factory: s.factory || '',
              remark: s.remark || '',
              filePath: s.filePath || ''
            }))
          : []

      if (!f.lines.length) f.lines = [emptyLine(products[0]?.id ?? null)]
      setForm(f)
      setOpen(true)
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || 'Failed')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(row: any) {
    if (!companyId) return
    try {
      await salesApi.deleteSalesOrder(companyId, row.id)
      message.success('Deleted')
      void load()
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || 'Failed')
    }
  }

  async function save() {
    if (!companyId) return
    if (!canSave) return
    setSaving(true)
    try {
      const payload: any = {
        orgId: form.orgId || null,
        orderType: form.orderType || 'DOMESTIC',
        businessPartnerId: form.businessPartnerId,
        priceListVersionId: form.priceListVersionId,
        currencyId: form.orderType === 'EXPORT' ? form.currencyId || null : null,
        exchangeRate: form.orderType === 'EXPORT' && String(form.exchangeRate || '').trim() ? form.exchangeRate : null,
        foreignAmount: form.orderType === 'EXPORT' && String(form.foreignAmount || '').trim() ? form.foreignAmount : null,
        buyerPo: form.buyerPo || null,
        departmentId: form.departmentId || null,
        employeeId: form.employeeId || null,
        inCharge: form.inCharge || null,
        paymentCondition: form.paymentCondition || null,
        deliveryPlace: form.deliveryPlace || null,
        forwardingWarehouseId: form.forwardingWarehouseId || null,
        memo: form.memo || null,
        orderDate: form.orderDate,
        lines: form.lines.map((l) => ({
          productId: l.productId,
          qty: l.qty,
          unitPrice: form.orderType === 'DOMESTIC' && String(l.unitPrice || '').trim() ? l.unitPrice : null,
          description: form.orderType === 'DOMESTIC' ? l.description || null : null,
          unit: form.orderType === 'DOMESTIC' ? l.unit || null : null,
          size: form.orderType === 'DOMESTIC' ? l.size || null : null,
          nationalSize: form.orderType === 'DOMESTIC' ? l.nationalSize || null : null,
          style: form.orderType === 'DOMESTIC' ? l.style || null : null,
          cuttingNo: form.orderType === 'DOMESTIC' ? l.cuttingNo || null : null,
          color: form.orderType === 'DOMESTIC' ? l.color || null : null,
          destination: form.orderType === 'DOMESTIC' ? l.destination || null : null,
          supplyAmount: form.orderType === 'DOMESTIC' && String(l.supplyAmount || '').trim() ? l.supplyAmount : null,
          vatAmount: form.orderType === 'DOMESTIC' && String(l.vatAmount || '').trim() ? l.vatAmount : null,
          fobPrice: form.orderType === 'DOMESTIC' && String(l.fobPrice || '').trim() ? l.fobPrice : null,
          ldpPrice: form.orderType === 'DOMESTIC' && String(l.ldpPrice || '').trim() ? l.ldpPrice : null,
          dpPrice: form.orderType === 'EXPORT' && String(l.dpPrice || '').trim() ? l.dpPrice : null,
          cmtCost: (form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT') && String(l.cmtCost || '').trim() ? l.cmtCost : null,
          cmCost: (form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT') && String(l.cmCost || '').trim() ? l.cmCost : null,
          fabricEta: (form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT') && String(l.fabricEta || '').trim() ? l.fabricEta : null,
          fabricEtd: (form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT') && String(l.fabricEtd || '').trim() ? l.fabricEtd : null,
          deliveryDate: form.orderType === 'EXPORT' && String(l.deliveryDate || '').trim() ? l.deliveryDate : null,
          shipMode: form.orderType === 'EXPORT' && String(l.shipMode || '').trim() ? l.shipMode : null,
          factory: form.orderType === 'EXPORT' && String(l.factory || '').trim() ? l.factory : null,
          remark: form.orderType === 'EXPORT' && String(l.remark || '').trim() ? l.remark : null,
          filePath: form.orderType === 'EXPORT' && String(l.filePath || '').trim() ? l.filePath : null
        })),
        deliverySchedules:
          form.orderType === 'DOMESTIC'
            ? (form.deliverySchedules || []).map((s) => ({
                deliveryDate: String(s.deliveryDate || '').trim() ? s.deliveryDate : null,
                shipMode: String(s.shipMode || '').trim() ? s.shipMode : null,
                factory: String(s.factory || '').trim() ? s.factory : null,
                remark: String(s.remark || '').trim() ? s.remark : null,
                filePath: String(s.filePath || '').trim() ? s.filePath : null
              }))
            : null
      }

      if (editMode === 'edit' && form.id) {
        await salesApi.updateSalesOrder(companyId, form.id, payload)
        message.success('Updated')
      } else {
        await salesApi.createSalesOrder(companyId, payload)
        message.success('Created')
      }
      setOpen(false)
      void load()
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || 'Failed')
    } finally {
      setSaving(false)
    }
  }

  const columns: ColumnsType<SalesOrderRow> = [
    { title: 'Document No', dataIndex: 'documentNo', width: 180 },
    { title: 'Status', dataIndex: 'status', width: 140 },
    { title: 'Order Date', dataIndex: 'orderDate', width: 140 },
    { title: 'Grand Total', dataIndex: 'grandTotal', width: 140 },
    {
      title: 'Action',
      key: 'action',
      width: 220,
      render: (_, r) => (
        <Space>
          <Button size="small" disabled={!canEditRow(r)} onClick={() => openEdit(r)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete sales order?"
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => onDelete(r)}
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

  const lineColumns: ColumnsType<LineForm & { key: string }> = useMemo(() => {
    const cols: ColumnsType<any> = [
      {
        title: 'Product',
        dataIndex: 'productId',
        key: 'productId',
        width: 320,
        render: (_: any, record: any, idx: number) => (
          <Select
            showSearch
            style={{ width: 300 }}
            placeholder="Select product"
            disabled={!products.length}
            options={productOptions}
            value={record.productId ?? undefined}
            onChange={(v) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], productId: v }
                return { ...prev, lines: next }
              })
            }
            filterOption={(input, option) => String(option?.label || '').toLowerCase().includes(input.toLowerCase())}
          />
        )
      },
      {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
        width: 140,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.qty}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], qty: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      }
    ]

    if (form.orderType === 'DOMESTIC') {
      cols.push({
        title: 'Unit Price',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        width: 140,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.unitPrice}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], unitPrice: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })

      cols.push({
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: 200,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.description}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], description: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })

      cols.push({
        title: 'Unit',
        dataIndex: 'unit',
        key: 'unit',
        width: 120,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.unit}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], unit: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })

      cols.push({
        title: 'Size',
        dataIndex: 'size',
        key: 'size',
        width: 120,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.size}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], size: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })

      cols.push({
        title: 'National Size',
        dataIndex: 'nationalSize',
        key: 'nationalSize',
        width: 140,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.nationalSize}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], nationalSize: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })

      cols.push({
        title: 'Style',
        dataIndex: 'style',
        key: 'style',
        width: 140,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.style}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], style: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })

      cols.push({
        title: 'Cutting No',
        dataIndex: 'cuttingNo',
        key: 'cuttingNo',
        width: 140,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.cuttingNo}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], cuttingNo: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })

      cols.push({
        title: 'Color',
        dataIndex: 'color',
        key: 'color',
        width: 140,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.color}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], color: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })

      cols.push({
        title: 'Destination',
        dataIndex: 'destination',
        key: 'destination',
        width: 160,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.destination}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], destination: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })

      cols.push({
        title: 'Supply Amount',
        dataIndex: 'supplyAmount',
        key: 'supplyAmount',
        width: 160,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.supplyAmount}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], supplyAmount: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })
      cols.push({
        title: 'VAT Amount',
        dataIndex: 'vatAmount',
        key: 'vatAmount',
        width: 140,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.vatAmount}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], vatAmount: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })
      cols.push({
        title: 'FOB',
        dataIndex: 'fobPrice',
        key: 'fobPrice',
        width: 120,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.fobPrice}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], fobPrice: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })
      cols.push({
        title: 'LDP',
        dataIndex: 'ldpPrice',
        key: 'ldpPrice',
        width: 120,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.ldpPrice}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], ldpPrice: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })
    }

    if (form.orderType === 'DOMESTIC' || form.orderType === 'EXPORT') {
      cols.push({
        title: 'CMT Cost',
        dataIndex: 'cmtCost',
        key: 'cmtCost',
        width: 140,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.cmtCost}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], cmtCost: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })
      cols.push({
        title: 'CM Cost',
        dataIndex: 'cmCost',
        key: 'cmCost',
        width: 140,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.cmCost}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], cmCost: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })
      cols.push({
        title: 'Fabric ETA',
        dataIndex: 'fabricEta',
        key: 'fabricEta',
        width: 160,
        render: (_: any, record: any, idx: number) => (
          <DatePicker
            value={record.fabricEta ? dayjs(record.fabricEta) : null}
            onChange={(d) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], fabricEta: d ? d.format('YYYY-MM-DD') : '' }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })
      cols.push({
        title: 'Fabric ETD',
        dataIndex: 'fabricEtd',
        key: 'fabricEtd',
        width: 160,
        render: (_: any, record: any, idx: number) => (
          <DatePicker
            value={record.fabricEtd ? dayjs(record.fabricEtd) : null}
            onChange={(d) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], fabricEtd: d ? d.format('YYYY-MM-DD') : '' }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })
    }

    if (form.orderType === 'EXPORT') {
      cols.push({
        title: 'DP Price',
        dataIndex: 'dpPrice',
        key: 'dpPrice',
        width: 140,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.dpPrice}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], dpPrice: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })
      cols.push({
        title: 'Delivery Date',
        dataIndex: 'deliveryDate',
        key: 'deliveryDate',
        width: 160,
        render: (_: any, record: any, idx: number) => (
          <DatePicker
            value={record.deliveryDate ? dayjs(record.deliveryDate) : null}
            onChange={(d) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], deliveryDate: d ? d.format('YYYY-MM-DD') : '' }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })
      cols.push({
        title: 'Ship Mode',
        dataIndex: 'shipMode',
        key: 'shipMode',
        width: 160,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.shipMode}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], shipMode: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })
      cols.push({
        title: 'Factory',
        dataIndex: 'factory',
        key: 'factory',
        width: 160,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.factory}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], factory: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })
      cols.push({
        title: 'Remark',
        dataIndex: 'remark',
        key: 'remark',
        width: 200,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.remark}
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], remark: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })
      cols.push({
        title: 'File Path',
        dataIndex: 'filePath',
        key: 'filePath',
        width: 240,
        render: (_: any, record: any, idx: number) => (
          <Input
            value={record.filePath}
            placeholder="/path/to/file"
            onChange={(e) =>
              setForm((prev) => {
                const next = [...prev.lines]
                next[idx] = { ...next[idx], filePath: e.target.value }
                return { ...prev, lines: next }
              })
            }
          />
        )
      })
    }

    cols.push({
      title: '',
      key: 'remove',
      width: 70,
      render: (_: any, __: any, idx: number) => (
        <Button danger size="small" onClick={() => removeLine(idx)}>
          X
        </Button>
      )
    })

    return cols
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.orderType, productOptions, products.length])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>Sales Orders</div>
              <div style={{ color: '#606266' }}>Buat SO untuk customer, lalu lanjut Goods Shipment.</div>
            </div>
            <Button type="primary" disabled={!companyId} onClick={openCreate}>
              Create SO
            </Button>
          </div>
          <CompanyOrgBar />
        </div>
      </Card>

      <Card>
        {!companyId ? (
          <Tag color="orange">Pilih company dulu.</Tag>
        ) : (
          <Table rowKey="id" dataSource={rows} columns={columns} loading={loading} />
        )}
      </Card>

      <Modal
        open={open}
        title={editMode === 'edit' ? 'Edit Sales Order' : 'Create Sales Order'}
        width={1000}
        onCancel={() => setOpen(false)}
        onOk={() => void save()}
        okButtonProps={{ disabled: !canSave, loading: saving }}
      >
        <Form layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item label="Org">
              <Input value={form.orgId ?? ''} disabled placeholder="Auto from context" />
            </Form.Item>
            <Form.Item label="Order Type">
              <Select
                value={form.orderType}
                options={[
                  { label: 'Domestic', value: 'DOMESTIC' },
                  { label: 'Export', value: 'EXPORT' }
                ]}
                onChange={(v) =>
                  setForm((prev) => ({
                    ...prev,
                    orderType: v,
                    deliverySchedules: v === 'DOMESTIC' ? prev.deliverySchedules : []
                  }))
                }
              />
            </Form.Item>
            <Form.Item label="Customer">
              <Select
                showSearch
                disabled={!customers.length}
                value={form.businessPartnerId ?? undefined}
                options={customerOptions}
                onChange={(v) => setForm((prev) => ({ ...prev, businessPartnerId: v }))}
                filterOption={(input, option) => String(option?.label || '').toLowerCase().includes(input.toLowerCase())}
              />
            </Form.Item>
            <Form.Item label="Price List Version">
              <Select
                showSearch
                disabled={!priceListVersions.length}
                value={form.priceListVersionId ?? undefined}
                options={plvOptions}
                onChange={(v) => setForm((prev) => ({ ...prev, priceListVersionId: v }))}
                filterOption={(input, option) => String(option?.label || '').toLowerCase().includes(input.toLowerCase())}
              />
            </Form.Item>
          </div>

          <Form.Item label="Order Date">
            <DatePicker
              value={form.orderDate ? dayjs(form.orderDate) : null}
              onChange={(d) => setForm((prev) => ({ ...prev, orderDate: d ? d.format('YYYY-MM-DD') : '' }))}
            />
          </Form.Item>

          {form.orderType === 'EXPORT' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <Form.Item label="Buyer PO">
                <Input value={form.buyerPo} onChange={(e) => setForm((p) => ({ ...p, buyerPo: e.target.value }))} />
              </Form.Item>
              <Form.Item label="Department">
                <Select
                  showSearch
                  disabled={!departments.length}
                  value={form.departmentId ?? undefined}
                  options={deptOptions}
                  onChange={(v) => setForm((p) => ({ ...p, departmentId: v }))}
                  filterOption={(input, option) => String(option?.label || '').toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>
              <Form.Item label="Employee">
                <Select
                  showSearch
                  disabled={!employees.length}
                  value={form.employeeId ?? undefined}
                  options={empOptions}
                  onChange={(v) => setForm((p) => ({ ...p, employeeId: v }))}
                  filterOption={(input, option) => String(option?.label || '').toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>

              <Form.Item label="In Charge">
                <Input value={form.inCharge} onChange={(e) => setForm((p) => ({ ...p, inCharge: e.target.value }))} />
              </Form.Item>
              <Form.Item label="Currency">
                <Select
                  showSearch
                  disabled={!currencies.length}
                  value={form.currencyId ?? undefined}
                  options={currencyOptions}
                  onChange={(v) => setForm((p) => ({ ...p, currencyId: v }))}
                  filterOption={(input, option) => String(option?.label || '').toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>
              <Form.Item label="Exchange Rate">
                <Input value={form.exchangeRate} onChange={(e) => setForm((p) => ({ ...p, exchangeRate: e.target.value }))} />
              </Form.Item>

              <Form.Item label="Foreign Amount">
                <Input value={form.foreignAmount} onChange={(e) => setForm((p) => ({ ...p, foreignAmount: e.target.value }))} />
              </Form.Item>
              <Form.Item label="Payment Condition">
                <Input value={form.paymentCondition} onChange={(e) => setForm((p) => ({ ...p, paymentCondition: e.target.value }))} />
              </Form.Item>
              <Form.Item label="Delivery Place">
                <Input value={form.deliveryPlace} onChange={(e) => setForm((p) => ({ ...p, deliveryPlace: e.target.value }))} />
              </Form.Item>

              <Form.Item label="Forwarding Warehouse">
                <Select
                  showSearch
                  disabled={!warehouses.length}
                  value={form.forwardingWarehouseId ?? undefined}
                  options={whOptions}
                  onChange={(v) => setForm((p) => ({ ...p, forwardingWarehouseId: v }))}
                  filterOption={(input, option) => String(option?.label || '').toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>
              <Form.Item label="Memo" style={{ gridColumn: 'span 2' }}>
                <Input.TextArea rows={2} value={form.memo} onChange={(e) => setForm((p) => ({ ...p, memo: e.target.value }))} />
              </Form.Item>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <Form.Item label="Buyer PO">
                <Input value={form.buyerPo} onChange={(e) => setForm((p) => ({ ...p, buyerPo: e.target.value }))} />
              </Form.Item>
              <Form.Item label="Department">
                <Select
                  showSearch
                  disabled={!departments.length}
                  value={form.departmentId ?? undefined}
                  options={deptOptions}
                  onChange={(v) => setForm((p) => ({ ...p, departmentId: v }))}
                  filterOption={(input, option) => String(option?.label || '').toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>
              <Form.Item label="Employee">
                <Select
                  showSearch
                  disabled={!employees.length}
                  value={form.employeeId ?? undefined}
                  options={empOptions}
                  onChange={(v) => setForm((p) => ({ ...p, employeeId: v }))}
                  filterOption={(input, option) => String(option?.label || '').toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>

              <Form.Item label="In Charge">
                <Input value={form.inCharge} onChange={(e) => setForm((p) => ({ ...p, inCharge: e.target.value }))} />
              </Form.Item>
              <Form.Item label="Payment Condition">
                <Input value={form.paymentCondition} onChange={(e) => setForm((p) => ({ ...p, paymentCondition: e.target.value }))} />
              </Form.Item>
              <Form.Item label="Delivery Place">
                <Input value={form.deliveryPlace} onChange={(e) => setForm((p) => ({ ...p, deliveryPlace: e.target.value }))} />
              </Form.Item>

              <Form.Item label="Forwarding Warehouse">
                <Select
                  showSearch
                  disabled={!warehouses.length}
                  value={form.forwardingWarehouseId ?? undefined}
                  options={whOptions}
                  onChange={(v) => setForm((p) => ({ ...p, forwardingWarehouseId: v }))}
                  filterOption={(input, option) => String(option?.label || '').toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>
              <Form.Item label="Memo" style={{ gridColumn: 'span 2' }}>
                <Input.TextArea rows={2} value={form.memo} onChange={(e) => setForm((p) => ({ ...p, memo: e.target.value }))} />
              </Form.Item>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '12px 0 6px' }}>
            <Typography.Text strong>Lines</Typography.Text>
            <Button size="small" onClick={addLine}>
              Add Line
            </Button>
          </div>

          <Table
            size="small"
            rowKey={(_, idx) => String(idx)}
            dataSource={form.lines.map((l, i) => ({ ...l, key: String(i) }))}
            columns={lineColumns}
            pagination={false}
            scroll={{ x: 1200 }}
          />

          {form.orderType === 'DOMESTIC' ? (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '12px 0 6px' }}>
                <Typography.Text strong>Delivery Schedules</Typography.Text>
                <Button size="small" onClick={addSchedule}>
                  Add Schedule
                </Button>
              </div>
              <Table
                size="small"
                rowKey={(_, idx) => String(idx)}
                dataSource={form.deliverySchedules.map((s, i) => ({ ...s, key: String(i) }))}
                pagination={false}
                columns={[
                  {
                    title: 'Delivery Date',
                    dataIndex: 'deliveryDate',
                    width: 160,
                    render: (_: any, record: any, idx: number) => (
                      <DatePicker
                        value={record.deliveryDate ? dayjs(record.deliveryDate) : null}
                        onChange={(d) =>
                          setForm((prev) => {
                            const next = [...prev.deliverySchedules]
                            next[idx] = { ...next[idx], deliveryDate: d ? d.format('YYYY-MM-DD') : '' }
                            return { ...prev, deliverySchedules: next }
                          })
                        }
                      />
                    )
                  },
                  {
                    title: 'Ship Mode',
                    dataIndex: 'shipMode',
                    width: 160,
                    render: (_: any, record: any, idx: number) => (
                      <Input
                        value={record.shipMode}
                        onChange={(e) =>
                          setForm((prev) => {
                            const next = [...prev.deliverySchedules]
                            next[idx] = { ...next[idx], shipMode: e.target.value }
                            return { ...prev, deliverySchedules: next }
                          })
                        }
                      />
                    )
                  },
                  {
                    title: 'Factory',
                    dataIndex: 'factory',
                    width: 160,
                    render: (_: any, record: any, idx: number) => (
                      <Input
                        value={record.factory}
                        onChange={(e) =>
                          setForm((prev) => {
                            const next = [...prev.deliverySchedules]
                            next[idx] = { ...next[idx], factory: e.target.value }
                            return { ...prev, deliverySchedules: next }
                          })
                        }
                      />
                    )
                  },
                  {
                    title: 'Remark',
                    dataIndex: 'remark',
                    width: 220,
                    render: (_: any, record: any, idx: number) => (
                      <Input
                        value={record.remark}
                        onChange={(e) =>
                          setForm((prev) => {
                            const next = [...prev.deliverySchedules]
                            next[idx] = { ...next[idx], remark: e.target.value }
                            return { ...prev, deliverySchedules: next }
                          })
                        }
                      />
                    )
                  },
                  {
                    title: 'File Path',
                    dataIndex: 'filePath',
                    width: 240,
                    render: (_: any, record: any, idx: number) => (
                      <Input
                        value={record.filePath}
                        placeholder="/path/to/file"
                        onChange={(e) =>
                          setForm((prev) => {
                            const next = [...prev.deliverySchedules]
                            next[idx] = { ...next[idx], filePath: e.target.value }
                            return { ...prev, deliverySchedules: next }
                          })
                        }
                      />
                    )
                  },
                  {
                    title: '',
                    key: 'remove',
                    width: 70,
                    render: (_: any, __: any, idx: number) => (
                      <Button danger size="small" onClick={() => removeSchedule(idx)}>
                        X
                      </Button>
                    )
                  }
                ]}
              />
            </div>
          ) : null}
        </Form>
      </Modal>
    </div>
  )
}
