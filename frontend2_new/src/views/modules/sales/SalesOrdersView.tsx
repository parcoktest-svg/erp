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
  Tabs,
  Typography,
  message
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { coreApi, hrApi, inventoryApi, manufacturingApi, masterDataApi, salesApi } from '@/utils/api'
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

type LocatorRow = { id: number; code?: string; name?: string }

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
  const [, setTaxRates] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [locators, setLocators] = useState<LocatorRow[]>([])

  const [soLineLookups, setSoLineLookups] = useState<any | null>(null)

  const [form] = Form.useForm()

  const [shipOpen, setShipOpen] = useState(false)
  const [shipSaving, setShipSaving] = useState(false)
  const [shipSoId, setShipSoId] = useState<number | null>(null)
  const [shipForm] = Form.useForm()

  const [voidOpen, setVoidOpen] = useState(false)
  const [voidSaving, setVoidSaving] = useState(false)
  const [voidSoId, setVoidSoId] = useState<number | null>(null)
  const [voidForm] = Form.useForm()

  const [bomOpen, setBomOpen] = useState(false)
  const [bomLoading, setBomLoading] = useState(false)
  const [bomSaving, setBomSaving] = useState(false)
  const [bomSo, setBomSo] = useState<SalesOrderRow | null>(null)
  const [bomSoDetail, setBomSoDetail] = useState<any | null>(null)
  const [bomSnapshots, setBomSnapshots] = useState<any[]>([])
  const [masterBoms, setMasterBoms] = useState<any[]>([])
  const [bomDraftByLineId, setBomDraftByLineId] = useState<Record<string, any>>({})
  const [copyFromSoId, setCopyFromSoId] = useState<number | null>(null)

  const [bomLineEditorOpen, setBomLineEditorOpen] = useState(false)
  const [bomLineEditorLineId, setBomLineEditorLineId] = useState<number | null>(null)
  const [bomLinesDraftBySoLineId, setBomLinesDraftBySoLineId] = useState<Record<string, any[]>>({})
  const [bomLineEditorTab, setBomLineEditorTab] = useState<'RAW' | 'FG'>('RAW')

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
      const [orgRes, bps, prods, pls, curs, taxs, depts, emps, whs, locs, lineLookups] = await Promise.all([
        coreApi.listOrgs(cid),
        masterDataApi.listBusinessPartners(cid),
        masterDataApi.listProducts(cid),
        masterDataApi.listPriceLists(cid),
        masterDataApi.listCurrencies(cid),
        masterDataApi.listTaxRates(cid),
        hrApi.listDepartments(),
        hrApi.listEmployees(),
        masterDataApi.listWarehouses(cid),
        inventoryApi.listLocators(cid),
        salesApi.lineLookups(cid)
      ])

      setOrgs((orgRes || []) as OrgRow[])
      setCustomers((bps || []).filter((x: any) => x.type === 'CUSTOMER' || x.type === 'BOTH'))
      setProducts(prods || [])
      setCurrencies(curs || [])
      setTaxRates(taxs || [])
      setDepartments(depts || [])
      setEmployees(emps || [])
      setWarehouses(whs || [])
      setLocators((locs || []) as LocatorRow[])
      setSoLineLookups(lineLookups || null)

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
      setTaxRates([])
      setDepartments([])
      setEmployees([])
      setWarehouses([])
      setLocators([])
      setSoLineLookups(null)
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

  const productOptionsByItemType = useMemo(() => {
    const all = (products || []).map((p: any) => ({ label: `${p.code} - ${p.name}`, value: p.id }))
    const map: Record<string, any[]> = {
      ALL: all
    }
    for (const p of products || []) {
      const t = String((p as any)?.itemType || '').trim().toUpperCase()
      if (!t) continue
      if (!map[t]) map[t] = []
      map[t].push({ label: `${(p as any).code} - ${(p as any).name}`, value: (p as any).id })
    }
    return map
  }, [products])

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

  const locatorOptions = useMemo(
    () =>
      (locators || []).map((l: any) => ({
        label: `${l.code || ''} ${l.name || ''}`.trim() || String(l.id),
        value: l.id
      })),
    [locators]
  )

  const currencyOptions = useMemo(
    () => (currencies || []).map((c: any) => ({ label: `${c.code} - ${c.name}`, value: c.id })),
    [currencies]
  )

  const soLineUnitOptions = useMemo(
    () => ((soLineLookups?.units as any[]) || []).map((v: any) => ({ label: String(v), value: String(v) })),
    [soLineLookups]
  )

  const soLineSizeOptions = useMemo(
    () => ((soLineLookups?.sizes as any[]) || []).map((v: any) => ({ label: String(v), value: String(v) })),
    [soLineLookups]
  )

  const soLineNationalSizeOptions = useMemo(
    () => ((soLineLookups?.nationalSizes as any[]) || []).map((v: any) => ({ label: String(v), value: String(v) })),
    [soLineLookups]
  )

  const soLineStyleOptions = useMemo(
    () => ((soLineLookups?.styles as any[]) || []).map((v: any) => ({ label: String(v), value: String(v) })),
    [soLineLookups]
  )

  const soLineCuttingNoOptions = useMemo(
    () => ((soLineLookups?.cuttingNos as any[]) || []).map((v: any) => ({ label: String(v), value: String(v) })),
    [soLineLookups]
  )

  const soLineColorOptions = useMemo(
    () => ((soLineLookups?.colors as any[]) || []).map((v: any) => ({ label: String(v), value: String(v) })),
    [soLineLookups]
  )

  const soLineDestinationOptions = useMemo(
    () => ((soLineLookups?.destinations as any[]) || []).map((v: any) => ({ label: String(v), value: String(v) })),
    [soLineLookups]
  )

  const productLabelById = useMemo(() => {
    const m = new Map<string, string>()
    for (const p of products || []) {
      if (p?.id == null) continue
      m.set(String(p.id), `${p.code || p.id} - ${p.name || ''}`.trim())
    }
    return m
  }, [products])

  const bomCurrencyOptions = useMemo(
    () => (currencies || []).map((c: any) => ({ label: `${c.code || ''} ${c.name || ''}`.trim() || String(c.id), value: c.id })),
    [currencies]
  )

  const soOptions = useMemo(
    () => (rows || []).map((r) => ({ value: r.id, label: r.documentNo || String(r.id) })),
    [rows]
  )

  const bomSnapshotByLineId = useMemo(() => {
    const m = new Map<string, any>()
    for (const s of bomSnapshots || []) {
      if (s?.salesOrderLineId == null) continue
      m.set(String(s.salesOrderLineId), s)
    }
    return m
  }, [bomSnapshots])

  const masterBomOptionsByProductId = useMemo(() => {
    const m = new Map<string, any[]>()
    for (const b of masterBoms || []) {
      const pid = b?.productId
      if (pid == null) continue
      const key = String(pid)
      if (!m.has(key)) m.set(key, [])
      m.get(key)!.push({
        value: b.id,
        label: `BOM ${b.id} (v${b.version ?? ''})`.trim(),
        active: Boolean(b.active)
      })
    }
    return m
  }, [masterBoms])

  async function reloadBomData(salesOrderId: number) {
    if (!companyId) return
    setBomLoading(true)
    try {
      const [detail, snaps, mb] = await Promise.all([
        salesApi.getSalesOrder(companyId, salesOrderId),
        salesApi.listSalesOrderBoms(companyId, salesOrderId),
        manufacturingApi.listBoms(companyId)
      ])
      setBomSoDetail(detail || null)
      setBomSnapshots(snaps || [])
      setMasterBoms(mb || [])

      const draft: Record<string, any> = {}
      const lineDrafts: Record<string, any[]> = {}
      for (const s of snaps || []) {
        const lineId = s?.salesOrderLineId
        if (lineId == null) continue
        draft[String(lineId)] = {
          sourceBomId: s?.sourceBomId ?? null,
          sourceBomVersion: s?.sourceBomVersion ?? null
        }

        lineDrafts[String(lineId)] = Array.isArray(s?.lines)
          ? s.lines.map((ln: any) => ({
              id: ln?.id ?? null,
              componentProductId: ln?.componentProductId ?? null,
              qty: ln?.qty ?? null,
              bomCode: ln?.bomCode ?? null,
              description1: ln?.description1 ?? null,
              colorDescription2: ln?.colorDescription2 ?? null,
              unit: ln?.unit ?? null,
              unitPriceForeign: ln?.unitPriceForeign ?? null,
              unitPriceDomestic: ln?.unitPriceDomestic ?? null,
              yy: ln?.yy ?? null,
              exchangeRate: ln?.exchangeRate ?? null,
              amountForeign: ln?.amountForeign ?? null,
              amountDomestic: ln?.amountDomestic ?? null,
              currencyId: ln?.currencyId ?? null
            }))
          : []
      }
      setBomDraftByLineId(draft)
      setBomLinesDraftBySoLineId(lineDrafts)
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load BOM'))
    } finally {
      setBomLoading(false)
    }
  }

  async function openBom(row: SalesOrderRow) {
    if (!companyId) return
    if (!row?.id) return
    setBomLoading(true)
    setBomSo(row)
    setBomSoDetail(null)
    setBomSnapshots([])
    setMasterBoms([])
    setBomDraftByLineId({})
    setCopyFromSoId(null)
    setBomLinesDraftBySoLineId({})
    setBomOpen(true)
    try {
      const [detail, snaps, mb] = await Promise.all([
        salesApi.getSalesOrder(companyId, row.id),
        salesApi.listSalesOrderBoms(companyId, row.id),
        manufacturingApi.listBoms(companyId)
      ])
      setBomSoDetail(detail || null)
      setBomSnapshots(snaps || [])
      setMasterBoms(mb || [])

      const draft: Record<string, any> = {}
      const lineDrafts: Record<string, any[]> = {}
      for (const s of snaps || []) {
        const lineId = s?.salesOrderLineId
        if (lineId == null) continue
        draft[String(lineId)] = {
          sourceBomId: s?.sourceBomId ?? null,
          sourceBomVersion: s?.sourceBomVersion ?? null
        }

        lineDrafts[String(lineId)] = Array.isArray(s?.lines)
          ? s.lines.map((ln: any) => ({
              id: ln?.id ?? null,
              componentProductId: ln?.componentProductId ?? null,
              qty: ln?.qty ?? null,
              bomCode: ln?.bomCode ?? null,
              description1: ln?.description1 ?? null,
              colorDescription2: ln?.colorDescription2 ?? null,
              unit: ln?.unit ?? null,
              unitPriceForeign: ln?.unitPriceForeign ?? null,
              unitPriceDomestic: ln?.unitPriceDomestic ?? null,
              yy: ln?.yy ?? null,
              exchangeRate: ln?.exchangeRate ?? null,
              amountForeign: ln?.amountForeign ?? null,
              amountDomestic: ln?.amountDomestic ?? null,
              currencyId: ln?.currencyId ?? null
            }))
          : []
      }
      setBomDraftByLineId(draft)
      setBomLinesDraftBySoLineId(lineDrafts)
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load BOM'))
      setBomSoDetail(null)
      setBomSnapshots([])
      setMasterBoms([])
      setBomDraftByLineId({})
      setBomLinesDraftBySoLineId({})
    } finally {
      setBomLoading(false)
    }
  }

  function openBomLineEditor(lineId: number) {
    message.info({ content: `Open BOM Lines for line ${lineId}`, key: 'bom-lines-open' })
    setBomLineEditorLineId(lineId)
    setBomLineEditorTab('RAW')
    setBomLineEditorOpen(true)
    const key = String(lineId)
    setBomLinesDraftBySoLineId((prev) => {
      if (prev[key]) return prev
      return { ...prev, [key]: [] }
    })
  }

  async function saveBomLinesForLine() {
    message.info({ content: 'Saving...', key: 'bom-lines-click' })
    if (!companyId) {
      message.error('Company is missing')
      return
    }
    if (!bomSo?.id) {
      message.error('Sales order is missing')
      return
    }
    if (!bomLineEditorLineId) {
      message.error('Sales order line is missing')
      return
    }
    const key = String(bomLineEditorLineId)
    const rows = bomLinesDraftBySoLineId[key] || []

    const validRows = (rows || [])
      .map((r: any) => ({
        componentProductId: r.componentProductId != null ? Number(r.componentProductId) : null,
        qty: r.qty != null ? Number(r.qty) : null,
        bomCode: r.bomCode || null,
        description1: r.description1 || null,
        colorDescription2: r.colorDescription2 || null,
        unit: r.unit || null,
        unitPriceForeign: r.unitPriceForeign != null ? Number(r.unitPriceForeign) : null,
        unitPriceDomestic: r.unitPriceDomestic != null ? Number(r.unitPriceDomestic) : null,
        yy: r.yy != null ? Number(r.yy) : null,
        exchangeRate: r.exchangeRate != null ? Number(r.exchangeRate) : null,
        amountForeign: r.amountForeign != null ? Number(r.amountForeign) : null,
        amountDomestic: r.amountDomestic != null ? Number(r.amountDomestic) : null,
        currencyId: r.currencyId != null ? Number(r.currencyId) : null
      }))
      .filter((r: any) => r.componentProductId != null && r.qty != null && r.qty > 0)

    if (!validRows.length) {
      message.error('Please add at least 1 line with Component and Qty > 0')
      return
    }

    const payload: any = {
      salesOrderLineId: Number(bomLineEditorLineId),
      sourceBomId: null,
      sourceBomVersion: null,
      lines: validRows
    }

    setBomSaving(true)
    try {
      message.loading({ content: 'Saving BOM lines...', key: 'bom-save' })
      await salesApi.setSalesOrderLineBom(companyId, bomSo.id, payload)
      message.success({ content: 'BOM lines saved', key: 'bom-save' })
      await reloadBomData(bomSo.id)
      await load(companyId)
      setBomLineEditorOpen(false)
      setBomLineEditorLineId(null)
    } catch (e: any) {
      message.destroy('bom-save')
      message.error(getApiErrorMessage(e, 'Failed to save BOM lines'))
    } finally {
      setBomSaving(false)
    }
  }

  async function saveBomAssignments() {
    message.info({ content: 'Saving...', key: 'bom-assign-click' })
    if (!companyId) {
      message.error('Company is missing')
      return
    }
    if (!bomSo?.id) {
      message.error('Sales order is missing')
      return
    }
    const soId = bomSo.id
    const lines = Array.isArray(bomSoDetail?.lines) ? bomSoDetail.lines : []

    const tasks: any[] = []
    for (const l of lines) {
      const lineId = l?.id
      if (lineId == null) continue
      const key = String(lineId)
      const draft = bomDraftByLineId[key]
      if (!draft) continue

      const existing = bomSnapshotByLineId.get(key)
      const existingSource = existing?.sourceBomId ?? null
      const nextSource = draft?.sourceBomId ?? null

      if (existingSource === nextSource) continue
      if (nextSource == null) continue

      tasks.push({ salesOrderLineId: Number(lineId), sourceBomId: Number(nextSource) })
    }

    if (!tasks.length) {
      const anySelected = Object.values(bomDraftByLineId || {}).some((x: any) => x?.sourceBomId != null)
      if (!anySelected) {
        message.loading({ content: 'Refreshing...', key: 'bom-assign-save' })
        try {
          await reloadBomData(soId)
          await load(companyId)
          message.success({ content: 'Saved', key: 'bom-assign-save' })
        } catch (e: any) {
          message.destroy('bom-assign-save')
          message.error(getApiErrorMessage(e, 'Failed to refresh'))
        }
        return
      }
      message.info('No BOM changes')
      return
    }

    setBomSaving(true)
    try {
      message.loading({ content: 'Saving BOM...', key: 'bom-assign-save' })
      for (const t of tasks) {
        await salesApi.setSalesOrderLineBom(companyId, soId, t)
      }
      message.success({ content: 'BOM saved', key: 'bom-assign-save' })
      await reloadBomData(soId)
      await load(companyId)
    } catch (e: any) {
      message.destroy('bom-assign-save')
      message.error(getApiErrorMessage(e, 'Failed to save BOM'))
    } finally {
      setBomSaving(false)
    }
  }

  async function copyBomFromOtherSo() {
    if (!companyId) return
    if (!bomSo?.id) return
    if (!copyFromSoId) {
      message.error('Select source Sales Order')
      return
    }
    setBomSaving(true)
    try {
      await salesApi.copySalesOrderBoms(companyId, bomSo.id, { fromSalesOrderId: copyFromSoId })
      message.success('BOM copied')
      await reloadBomData(bomSo.id)
      await load(companyId)
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to copy BOM'))
    } finally {
      setBomSaving(false)
    }
  }

  function canEditRow(r: SalesOrderRow) {
    return (r.status || '') === 'DRAFTED'
  }

  function canApproveRow(r: SalesOrderRow) {
    return (r.status || '') === 'DRAFTED'
  }

  function canVoidRow(r: SalesOrderRow) {
    const s = String(r.status || '')
    return s === 'DRAFTED' || s === 'APPROVED'
  }

  function canShipRow(r: SalesOrderRow) {
    const s = String(r.status || '')
    return s === 'APPROVED' || s === 'PARTIALLY_COMPLETED'
  }

  const columns: ColumnsType<SalesOrderRow> = [
    {
      title: 'Document No',
      dataIndex: 'documentNo',
      width: 180,
      render: (v: any, r: SalesOrderRow) => (
        <Typography.Link
          onClick={(e) => {
            e.preventDefault()
            void openBom(r)
          }}
        >
          {v || r.id}
        </Typography.Link>
      )
    },
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
      width: 520,
      render: (_, r) => (
        <Space>
          <Button size="small" disabled={!canEditRow(r)} onClick={() => void openEdit(r)}>
            Edit
          </Button>
          <Popconfirm
            title="Approve sales order?"
            okText="Approve"
            cancelText="Cancel"
            onConfirm={async () => {
              if (!companyId) return
              try {
                await salesApi.approveSalesOrder(companyId, r.id)
                message.success('Approved')
                await load(companyId)
              } catch (e: any) {
                message.error(getApiErrorMessage(e, 'Failed to approve'))
              }
            }}
            disabled={!canApproveRow(r)}
          >
            <Button size="small" type="primary" disabled={!canApproveRow(r)}>
              Approve
            </Button>
          </Popconfirm>
          <Button size="small" disabled={!canShipRow(r)} onClick={() => void openShip(r)}>
            Ship
          </Button>
          <Button
            size="small"
            danger
            disabled={!canVoidRow(r)}
            onClick={() => {
              setVoidSoId(r.id)
              voidForm.resetFields()
              voidForm.setFieldsValue({ voidDate: dayjs(), reason: '' })
              setVoidOpen(true)
            }}
          >
            Void
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

  async function openShip(row: SalesOrderRow) {
    if (!companyId) return
    if (!row?.id) return
    setShipSaving(true)
    try {
      const detail = await salesApi.getSalesOrder(companyId, row.id)
      const lines = Array.isArray(detail?.lines) ? detail.lines : []

      const shipLines = lines
        .map((l: any) => {
          const qty = Number(l?.qty ?? 0)
          const shipped = Number(l?.shippedQty ?? 0)
          const remaining = Math.max(0, qty - shipped)
          return {
            salesOrderLineId: l?.id,
            productId: l?.productId,
            orderedQty: qty,
            shippedQty: shipped,
            remainingQty: remaining,
            qty: remaining > 0 ? remaining : 0
          }
        })
        .filter((x: any) => x.salesOrderLineId != null && Number(x.remainingQty) > 0)

      setShipSoId(detail?.id ?? row.id)
      shipForm.resetFields()
      shipForm.setFieldsValue({
        fromLocatorId: locators[0]?.id ?? null,
        movementDate: dayjs(),
        description: `Goods Shipment for SO ${detail?.documentNo || row.documentNo || row.id}`,
        lines: shipLines
      })
      setShipOpen(true)
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load sales order detail'))
    } finally {
      setShipSaving(false)
    }
  }

  async function openCreate() {
    setEditId(null)
    form.resetFields()
    form.setFieldsValue({
      orgId: null,
      orderType: 'DOMESTIC',
      orderDate: dayjs(),
      priceListVersionId: priceListVersions[0]?.id,
      lines: [{ itemType: 'ALL', productId: products[0]?.id ?? null, qty: 1 }],
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
              itemType:
                products.find((p: any) => String(p?.id) === String(l.productId))?.itemType != null
                  ? String(products.find((p: any) => String(p?.id) === String(l.productId))?.itemType)
                  : 'ALL',
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
          : [{ itemType: 'ALL', productId: products[0]?.id ?? null, qty: 1 }],

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
        bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
        onCancel={() => setOpen(false)}
        onOk={() => void save()}
        okButtonProps={{ loading: saving }}
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item label="Org" name="orgId">
              <Select allowClear loading={orgLoading} options={orgOptions} placeholder="Selection" />
            </Form.Item>
            <Form.Item label="Order Type" name="orderType" rules={[{ required: true }]}>
              <Select
                placeholder="Selection"
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
              <Select showSearch options={customerOptions} optionFilterProp="label" placeholder="Selection" />
            </Form.Item>
            <Form.Item label="Price List Version" name="priceListVersionId" rules={[{ required: true }]}>
              <Select showSearch options={plvOptions} optionFilterProp="label" placeholder="Selection" />
            </Form.Item>
            <Form.Item label="Order Date" name="orderDate" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} placeholder="DD-MM-YYYY" />
            </Form.Item>
          </div>

          {orderType === 'EXPORT' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <Form.Item label="Buyer PO" name="buyerPo">
                <Input />
              </Form.Item>
              <Form.Item label="Department" name="departmentId">
                <Select allowClear showSearch options={deptOptions} optionFilterProp="label" placeholder="Selection" />
              </Form.Item>
              <Form.Item label="Employee" name="employeeId">
                <Select allowClear showSearch options={empOptions} optionFilterProp="label" placeholder="Selection" />
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
                <Select allowClear showSearch options={whOptions} optionFilterProp="label" placeholder="Selection" />
              </Form.Item>
              <Form.Item label="Currency" name="currencyId" rules={[{ required: orderType === 'EXPORT' }]}>
                <Select allowClear showSearch options={currencyOptions} optionFilterProp="label" placeholder="Selection" />
              </Form.Item>
              <Form.Item label="Exchange Rate" name="exchangeRate">
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>

              <Form.Item label="Foreign Amount" name="foreignAmount">
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
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
                        <Form.Item {...field} name={[field.name, 'itemType']} label="Item Type" style={{ width: 200 }}>
                          <Select
                            placeholder="Selection"
                            options={[
                              { label: 'All', value: 'ALL' },
                              { label: 'Marchandises', value: 'MARCHANDISES' },
                              { label: 'Finished Goods', value: 'FINISHED_GOODS' },
                              { label: 'Semifinished Goods', value: 'SEMIFINISHED_GOODS' }
                            ]}
                            onChange={() => {
                              form.setFieldValue(['lines', field.name, 'productId'], null)
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'productId']}
                          label="Item Name"
                          rules={[{ required: true }]}
                          style={{ width: 420 }}
                        >
                          <Form.Item
                            noStyle
                            shouldUpdate={(prev, next) =>
                              prev?.lines?.[field.name]?.itemType !== next?.lines?.[field.name]?.itemType ||
                              prev?.lines?.[field.name]?.productId !== next?.lines?.[field.name]?.productId
                            }
                          >
                            {() => {
                              const t = String(form.getFieldValue(['lines', field.name, 'itemType']) || 'ALL')
                                .trim()
                                .toUpperCase()
                              const opts = productOptionsByItemType[t] || productOptionsByItemType.ALL || productOptions
                              return <Select showSearch options={opts} optionFilterProp="label" placeholder="Selection" />
                            }}
                          </Form.Item>
                        </Form.Item>
                        <Form.Item {...field} name={[field.name, 'qty']} label="Qty" rules={[{ required: true }]} style={{ width: 160 }}>
                          <InputNumber style={{ width: '100%' }} min={0.0001} placeholder="0" />
                        </Form.Item>
                        {orderType === 'DOMESTIC' ? (
                          <Form.Item {...field} name={[field.name, 'unitPrice']} label="Unit Price" style={{ width: 160 }}>
                            <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
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
                              <Select allowClear showSearch options={soLineUnitOptions} optionFilterProp="label" placeholder="Selection" />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'size']} label="Size" style={{ width: 160 }}>
                              <Select allowClear showSearch options={soLineSizeOptions} optionFilterProp="label" placeholder="Selection" />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'nationalSize']} label="National Size" style={{ width: 160 }}>
                              <Select allowClear showSearch options={soLineNationalSizeOptions} optionFilterProp="label" placeholder="Selection" />
                            </Form.Item>
                          </Space>
                          <Space wrap style={{ width: '100%' }}>
                            <Form.Item {...field} name={[field.name, 'style']} label="Style" style={{ width: 160 }}>
                              <Select allowClear showSearch options={soLineStyleOptions} optionFilterProp="label" placeholder="Selection" />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'cuttingNo']} label="Cutting No" style={{ width: 160 }}>
                              <Select allowClear showSearch options={soLineCuttingNoOptions} optionFilterProp="label" placeholder="Selection" />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'color']} label="Color" style={{ width: 160 }}>
                              <Select allowClear showSearch options={soLineColorOptions} optionFilterProp="label" placeholder="Selection" />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'destination']} label="Destination" style={{ width: 220 }}>
                              <Select allowClear showSearch options={soLineDestinationOptions} optionFilterProp="label" placeholder="Selection" />
                            </Form.Item>
                          </Space>
                          <Space wrap style={{ width: '100%' }}>
                            <Form.Item {...field} name={[field.name, 'supplyAmount']} label="Supply" style={{ width: 160 }}>
                              <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'vatAmount']} label="VAT" style={{ width: 160 }}>
                              <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'fobPrice']} label="FOB" style={{ width: 160 }}>
                              <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'ldpPrice']} label="LDP" style={{ width: 160 }}>
                              <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
                            </Form.Item>
                          </Space>
                        </>
                      ) : null}

                      {(orderType === 'DOMESTIC' || orderType === 'EXPORT') && orderType ? (
                        <Space wrap style={{ width: '100%' }}>
                          <Form.Item {...field} name={[field.name, 'cmtCost']} label="CMT Cost" style={{ width: 160 }}>
                            <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
                          </Form.Item>
                          <Form.Item {...field} name={[field.name, 'cmCost']} label="CM Cost" style={{ width: 160 }}>
                            <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
                          </Form.Item>
                          <Form.Item {...field} name={[field.name, 'fabricEta']} label="Fabric ETA" style={{ width: 200 }}>
                            <DatePicker style={{ width: '100%' }} placeholder="DD-MM-YYYY" />
                          </Form.Item>
                          <Form.Item {...field} name={[field.name, 'fabricEtd']} label="Fabric ETD" style={{ width: 200 }}>
                            <DatePicker style={{ width: '100%' }} placeholder="DD-MM-YYYY" />
                          </Form.Item>
                        </Space>
                      ) : null}

                      {orderType === 'EXPORT' ? (
                        <>
                          <Space wrap style={{ width: '100%' }}>
                            <Form.Item {...field} name={[field.name, 'dpPrice']} label="DP Price" style={{ width: 200 }}>
                              <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'deliveryDate']} label="Delivery Date" style={{ width: 200 }}>
                              <DatePicker style={{ width: '100%' }} placeholder="DD-MM-YYYY" />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'shipMode']} label="Ship Mode" style={{ width: 200 }}>
                              <Input placeholder="Selection" />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'factory']} label="Factory" style={{ width: 200 }}>
                              <Input placeholder="Selection" />
                            </Form.Item>
                          </Space>
                          <Space wrap style={{ width: '100%' }}>
                            <Form.Item {...field} name={[field.name, 'remark']} label="Remark" style={{ width: 420 }}>
                              <Input />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'filePath']} label="File Path" style={{ width: 420 }}>
                              <Input />
                            </Form.Item>
                          </Space>
                        </>
                      ) : null}
                    </Space>
                  </Card>
                ))}

                <Button onClick={() => add({ itemType: 'ALL', productId: products[0]?.id ?? null, qty: 1 })}>Add Item</Button>
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
                          <DatePicker style={{ width: '100%' }} placeholder="DD-MM-YYYY" />
                        </Form.Item>
                        <Form.Item {...field} name={[field.name, 'shipMode']} label="Ship Mode" style={{ width: 200 }}>
                          <Input placeholder="Selection" />
                        </Form.Item>
                        <Form.Item {...field} name={[field.name, 'factory']} label="Factory" style={{ width: 200 }}>
                          <Input placeholder="Selection" />
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

      <Modal
        open={bomOpen}
        title={`BOM - ${bomSo?.documentNo || bomSo?.id || ''}`.trim()}
        width={1100}
        onCancel={() => {
          setBomOpen(false)
          setBomSo(null)
          setBomSoDetail(null)
          setBomSnapshots([])
          setMasterBoms([])
          setBomDraftByLineId({})
          setCopyFromSoId(null)
          setBomLinesDraftBySoLineId({})
        }}
        footer={
          <Space>
            <Select
              style={{ width: 240 }}
              allowClear
              placeholder="Copy BOM from SO"
              options={soOptions.filter((x) => x.value !== bomSo?.id)}
              value={copyFromSoId ?? undefined}
              onChange={(v) => setCopyFromSoId(v ?? null)}
              disabled={bomLoading || bomSaving}
            />
            <Button onClick={() => void copyBomFromOtherSo()} disabled={bomLoading || bomSaving}>
              Copy
            </Button>
            <Button type="primary" onClick={() => void saveBomAssignments()} loading={bomSaving} disabled={bomLoading}>
              Save
            </Button>
            <Button
              onClick={() => {
                setBomOpen(false)
                setBomSo(null)
                setBomSoDetail(null)
                setBomSnapshots([])
                setMasterBoms([])
                setBomDraftByLineId({})
                setCopyFromSoId(null)
                setBomLinesDraftBySoLineId({})
              }}
            >
              Close
            </Button>
          </Space>
        }
        destroyOnClose
      >
        <Table
          size="small"
          loading={bomLoading}
          rowKey={(r: any) => String(r?.id)}
          pagination={false}
          dataSource={Array.isArray(bomSoDetail?.lines) ? bomSoDetail.lines : []}
          columns={[
            {
              title: 'Line ID',
              dataIndex: 'id',
              width: 110
            },
            {
              title: 'Product',
              dataIndex: 'productId',
              width: 360,
              render: (v: any) => productLabelById.get(String(v)) || v
            },
            { title: 'Style', dataIndex: 'style', width: 140 },
            { title: 'Color', dataIndex: 'color', width: 140 },
            { title: 'Size', dataIndex: 'size', width: 140 },
            {
              title: 'Master BOM',
              key: 'masterBom',
              width: 240,
              render: (_: any, r: any) => {
                const lineId = r?.id
                const pid = r?.productId
                const key = String(lineId)
                const opts = masterBomOptionsByProductId.get(String(pid)) || []
                const val = bomDraftByLineId[key]?.sourceBomId ?? null
                return (
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Selection"
                    options={opts.filter((x: any) => x.active)}
                    value={val ?? undefined}
                    onChange={(v) =>
                      setBomDraftByLineId((prev) => ({
                        ...prev,
                        [key]: {
                          ...(prev[key] || {}),
                          sourceBomId: v ?? null
                        }
                      }))
                    }
                    disabled={bomLoading || bomSaving}
                  />
                )
              }
            },
            {
              title: 'Assigned',
              key: 'assigned',
              width: 120,
              render: (_: any, r: any) => {
                const snap = bomSnapshotByLineId.get(String(r?.id))
                const ok = Boolean(snap?.sourceBomId) && Array.isArray(snap?.lines) && snap.lines.length > 0
                return ok ? <Tag color="green">YES</Tag> : <Tag color="red">NO</Tag>
              }
            },
            {
              title: 'Action',
              key: 'action',
              width: 140,
              render: (_: any, r: any) => (
                <Button size="small" onClick={() => openBomLineEditor(Number(r?.id))} disabled={bomLoading || bomSaving}>
                  Edit BOM
                </Button>
              )
            }
          ]}
        />
      </Modal>

      <Modal
        open={bomLineEditorOpen}
        title={`BOM Lines - SO Line ${bomLineEditorLineId ?? ''}`.trim()}
        width={1200}
        zIndex={2000}
        onCancel={() => {
          setBomLineEditorOpen(false)
          setBomLineEditorLineId(null)
        }}
        footer={
          <Space>
            <Button
              onClick={() => {
                setBomLineEditorOpen(false)
                setBomLineEditorLineId(null)
              }}
              disabled={bomSaving}
            >
              Cancel
            </Button>
            <Button type="primary" onClick={() => void saveBomLinesForLine()} loading={bomSaving}>
              OK
            </Button>
          </Space>
        }
        destroyOnClose
      >
        <Tabs
          activeKey={bomLineEditorTab}
          onChange={(k) => setBomLineEditorTab((k as any) || 'RAW')}
          items={[
            {
              key: 'RAW',
              label: 'Raw Materials',
              children: (
                <>
                  <div style={{ marginBottom: 8 }}>
                    <Button
                      onClick={() => {
                        if (!bomLineEditorLineId) return
                        const key = String(bomLineEditorLineId)
                        setBomLinesDraftBySoLineId((prev) => ({
                          ...prev,
                          [key]: [
                            ...(prev[key] || []),
                            {
                              componentProductId: null,
                              qty: null,
                              bomCode: null,
                              description1: null,
                              colorDescription2: null,
                              unit: null,
                              unitPriceForeign: null,
                              unitPriceDomestic: null,
                              yy: null,
                              exchangeRate: null,
                              amountForeign: null,
                              amountDomestic: null,
                              currencyId: null
                            }
                          ]
                        }))
                      }}
                      disabled={!bomLineEditorLineId || bomSaving}
                    >
                      Add BOM
                    </Button>
                  </div>

                  <Table
                    size="small"
                    pagination={false}
                    rowKey={(_: any, i) => String(i)}
                    dataSource={
                      bomLineEditorLineId != null ? bomLinesDraftBySoLineId[String(bomLineEditorLineId)] || [] : []
                    }
                    columns={[
                      {
                        title: 'Component',
                        dataIndex: 'componentProductId',
                        width: 240,
                        render: (_: any, r: any, idx: number) => (
                          <Select
                            showSearch
                            optionFilterProp="label"
                            placeholder="Selection"
                            style={{ width: '100%' }}
                            options={(products || []).map((p: any) => ({
                              value: p.id,
                              label: `${p.code || p.id} - ${p.name || ''}`.trim()
                            }))}
                            value={r.componentProductId ?? undefined}
                            onChange={(v) => {
                              if (!bomLineEditorLineId) return
                              const key = String(bomLineEditorLineId)
                              setBomLinesDraftBySoLineId((prev) => {
                                const arr = [...(prev[key] || [])]
                                arr[idx] = { ...arr[idx], componentProductId: v }
                                return { ...prev, [key]: arr }
                              })
                            }}
                          />
                        )
                      },
                      {
                        title: 'BOM Code',
                        dataIndex: 'bomCode',
                        width: 160,
                        render: (_: any, r: any, idx: number) => (
                          <Input
                            value={r.bomCode ?? ''}
                            onChange={(e) => {
                              if (!bomLineEditorLineId) return
                              const key = String(bomLineEditorLineId)
                              setBomLinesDraftBySoLineId((prev) => {
                                const arr = [...(prev[key] || [])]
                                arr[idx] = { ...arr[idx], bomCode: e.target.value }
                                return { ...prev, [key]: arr }
                              })
                            }}
                          />
                        )
                      },
                      {
                        title: 'Description(1)',
                        dataIndex: 'description1',
                        width: 180,
                        render: (_: any, r: any, idx: number) => (
                          <Input
                            value={r.description1 ?? ''}
                            onChange={(e) => {
                              if (!bomLineEditorLineId) return
                              const key = String(bomLineEditorLineId)
                              setBomLinesDraftBySoLineId((prev) => {
                                const arr = [...(prev[key] || [])]
                                arr[idx] = { ...arr[idx], description1: e.target.value }
                                return { ...prev, [key]: arr }
                              })
                            }}
                          />
                        )
                      },
                      {
                        title: 'Color Desc(2)',
                        dataIndex: 'colorDescription2',
                        width: 160,
                        render: (_: any, r: any, idx: number) => (
                          <Input
                            value={r.colorDescription2 ?? ''}
                            onChange={(e) => {
                              if (!bomLineEditorLineId) return
                              const key = String(bomLineEditorLineId)
                              setBomLinesDraftBySoLineId((prev) => {
                                const arr = [...(prev[key] || [])]
                                arr[idx] = { ...arr[idx], colorDescription2: e.target.value }
                                return { ...prev, [key]: arr }
                              })
                            }}
                          />
                        )
                      },
                      {
                        title: 'Unit',
                        dataIndex: 'unit',
                        width: 100,
                        render: (_: any, r: any, idx: number) => (
                          <Input
                            value={r.unit ?? ''}
                            onChange={(e) => {
                              if (!bomLineEditorLineId) return
                              const key = String(bomLineEditorLineId)
                              setBomLinesDraftBySoLineId((prev) => {
                                const arr = [...(prev[key] || [])]
                                arr[idx] = { ...arr[idx], unit: e.target.value }
                                return { ...prev, [key]: arr }
                              })
                            }}
                          />
                        )
                      },
                      {
                        title: 'Qty',
                        dataIndex: 'qty',
                        width: 90,
                        render: (_: any, r: any, idx: number) => (
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="0"
                            value={r.qty ?? undefined}
                            onChange={(v) => {
                              if (!bomLineEditorLineId) return
                              const key = String(bomLineEditorLineId)
                              setBomLinesDraftBySoLineId((prev) => {
                                const arr = [...(prev[key] || [])]
                                arr[idx] = { ...arr[idx], qty: v }
                                return { ...prev, [key]: arr }
                              })
                            }}
                          />
                        )
                      },
                      {
                        title: 'Unit Price (Foreign)',
                        dataIndex: 'unitPriceForeign',
                        width: 140,
                        render: (_: any, r: any, idx: number) => (
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="0"
                            value={r.unitPriceForeign ?? undefined}
                            onChange={(v) => {
                              if (!bomLineEditorLineId) return
                              const key = String(bomLineEditorLineId)
                              setBomLinesDraftBySoLineId((prev) => {
                                const arr = [...(prev[key] || [])]
                                arr[idx] = { ...arr[idx], unitPriceForeign: v }
                                return { ...prev, [key]: arr }
                              })
                            }}
                          />
                        )
                      },
                      {
                        title: 'Unit Price (Domestic)',
                        dataIndex: 'unitPriceDomestic',
                        width: 150,
                        render: (_: any, r: any, idx: number) => (
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="0"
                            value={r.unitPriceDomestic ?? undefined}
                            onChange={(v) => {
                              if (!bomLineEditorLineId) return
                              const key = String(bomLineEditorLineId)
                              setBomLinesDraftBySoLineId((prev) => {
                                const arr = [...(prev[key] || [])]
                                arr[idx] = { ...arr[idx], unitPriceDomestic: v }
                                return { ...prev, [key]: arr }
                              })
                            }}
                          />
                        )
                      },
                      {
                        title: 'YY',
                        dataIndex: 'yy',
                        width: 90,
                        render: (_: any, r: any, idx: number) => (
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="0"
                            value={r.yy ?? undefined}
                            onChange={(v) => {
                              if (!bomLineEditorLineId) return
                              const key = String(bomLineEditorLineId)
                              setBomLinesDraftBySoLineId((prev) => {
                                const arr = [...(prev[key] || [])]
                                arr[idx] = { ...arr[idx], yy: v }
                                return { ...prev, [key]: arr }
                              })
                            }}
                          />
                        )
                      },
                      {
                        title: 'Exchange Rate',
                        dataIndex: 'exchangeRate',
                        width: 130,
                        render: (_: any, r: any, idx: number) => (
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="0"
                            value={r.exchangeRate ?? undefined}
                            onChange={(v) => {
                              if (!bomLineEditorLineId) return
                              const key = String(bomLineEditorLineId)
                              setBomLinesDraftBySoLineId((prev) => {
                                const arr = [...(prev[key] || [])]
                                arr[idx] = { ...arr[idx], exchangeRate: v }
                                return { ...prev, [key]: arr }
                              })
                            }}
                          />
                        )
                      },
                      {
                        title: 'Amount (Foreign)',
                        dataIndex: 'amountForeign',
                        width: 140,
                        render: (_: any, r: any, idx: number) => (
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="0"
                            value={r.amountForeign ?? undefined}
                            onChange={(v) => {
                              if (!bomLineEditorLineId) return
                              const key = String(bomLineEditorLineId)
                              setBomLinesDraftBySoLineId((prev) => {
                                const arr = [...(prev[key] || [])]
                                arr[idx] = { ...arr[idx], amountForeign: v }
                                return { ...prev, [key]: arr }
                              })
                            }}
                          />
                        )
                      },
                      {
                        title: 'Amount (Domestic)',
                        dataIndex: 'amountDomestic',
                        width: 150,
                        render: (_: any, r: any, idx: number) => (
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="0"
                            value={r.amountDomestic ?? undefined}
                            onChange={(v) => {
                              if (!bomLineEditorLineId) return
                              const key = String(bomLineEditorLineId)
                              setBomLinesDraftBySoLineId((prev) => {
                                const arr = [...(prev[key] || [])]
                                arr[idx] = { ...arr[idx], amountDomestic: v }
                                return { ...prev, [key]: arr }
                              })
                            }}
                          />
                        )
                      },
                      {
                        title: 'Currency',
                        dataIndex: 'currencyId',
                        width: 140,
                        render: (_: any, r: any, idx: number) => (
                          <Select
                            placeholder="Selection"
                            style={{ width: '100%' }}
                            options={bomCurrencyOptions}
                            value={r.currencyId ?? undefined}
                            onChange={(v) => {
                              if (!bomLineEditorLineId) return
                              const key = String(bomLineEditorLineId)
                              setBomLinesDraftBySoLineId((prev) => {
                                const arr = [...(prev[key] || [])]
                                arr[idx] = { ...arr[idx], currencyId: v }
                                return { ...prev, [key]: arr }
                              })
                            }}
                          />
                        )
                      },
                      {
                        title: '',
                        key: 'rm',
                        width: 80,
                        render: (_: any, __: any, idx: number) => (
                          <Button
                            danger
                            size="small"
                            onClick={() => {
                              if (!bomLineEditorLineId) return
                              const key = String(bomLineEditorLineId)
                              setBomLinesDraftBySoLineId((prev) => {
                                const arr = [...(prev[key] || [])]
                                arr.splice(idx, 1)
                                return { ...prev, [key]: arr }
                              })
                            }}
                            disabled={bomSaving}
                          >
                            Remove
                          </Button>
                        )
                      }
                    ]}
                    scroll={{ x: 1700 }}
                  />
                </>
              )
            },
            {
              key: 'FG',
              label: 'Finished Goods',
              children: (
                <div>
                  <div style={{ marginBottom: 8 }}>
                    Finished Goods Assignment to BOM
                  </div>
                  <div>
                    {(() => {
                      if (!bomLineEditorLineId) return null
                      const line = (Array.isArray(bomSoDetail?.lines) ? bomSoDetail.lines : []).find(
                        (x: any) => Number(x?.id) === Number(bomLineEditorLineId)
                      )
                      if (!line) return null
                      return (
                        <div>
                          <div>
                            <b>Product:</b> {productLabelById.get(String(line.productId)) || line.productId}
                          </div>
                          <div>
                            <b>Style:</b> {line.style || '-'}
                          </div>
                          <div>
                            <b>Color:</b> {line.color || '-'}
                          </div>
                          <div>
                            <b>Size:</b> {line.size || '-'}
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )
            }
          ]}
        />
      </Modal>

      <Modal
        open={shipOpen}
        title="Create Goods Shipment"
        width={1100}
        onCancel={() => {
          setShipOpen(false)
          setShipSoId(null)
        }}
        onOk={async () => {
          if (!companyId) return
          if (!shipSoId) {
            message.error('Sales order is missing')
            return
          }
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

            const movement = await salesApi.createGoodsShipment(companyId, shipSoId, payload)
            message.success(`Created Goods Shipment ${movement?.documentNo || ''}`.trim())
            setShipOpen(false)
            setShipSoId(null)
            await load(companyId)
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
              <Select showSearch options={locatorOptions} optionFilterProp="label" placeholder="Selection" />
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
                      <Form.Item
                        name={[r._idx, 'qty']}
                        style={{ marginBottom: 0 }}
                        rules={[{ required: true }]}
                      >
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
                        <Form.Item name={[r._idx, 'productId']} style={{ display: 'none' }}>
                          <Input />
                        </Form.Item>
                        <Form.Item name={[r._idx, 'orderedQty']} style={{ display: 'none' }}>
                          <Input />
                        </Form.Item>
                        <Form.Item name={[r._idx, 'shippedQty']} style={{ display: 'none' }}>
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
        title="Void Sales Order"
        okText="Void"
        okButtonProps={{ danger: true, loading: voidSaving }}
        onCancel={() => {
          setVoidOpen(false)
          setVoidSoId(null)
        }}
        onOk={async () => {
          if (!companyId) return
          if (!voidSoId) {
            message.error('Sales order is missing')
            return
          }
          try {
            setVoidSaving(true)
            const v = await voidForm.validateFields()
            await salesApi.voidSalesOrder(companyId, voidSoId, {
              voidDate: v.voidDate ? dayjs(v.voidDate).format('YYYY-MM-DD') : null,
              reason: v.reason || null
            })
            message.success('Voided')
            setVoidOpen(false)
            setVoidSoId(null)
            await load(companyId)
          } catch (e: any) {
            if (e?.errorFields) {
              message.error('Please complete required fields')
              return
            }
            message.error(getApiErrorMessage(e, 'Failed to void'))
          } finally {
            setVoidSaving(false)
          }
        }}
        destroyOnClose
      >
        <Form layout="vertical" form={voidForm}>
          <Form.Item name="voidDate" label="Void Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} placeholder="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item name="reason" label="Reason">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}
