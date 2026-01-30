import { Button, Card, DatePicker, Descriptions, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tabs, Typography, Upload, message } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import StatusBadge from '@/components/StatusBadge'
import DataTable from '@/components/DataTable'
import { coreApi, financeApi, inventoryApi, manufacturingApi, masterDataApi, salesApi } from '@/utils/api'
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

type AttachmentRow = {
  id: number
  companyId?: number
  refType?: string
  refId?: number
  name?: string
  originalFileName?: string
  contentType?: string
  sizeBytes?: number
  createdAt?: string
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

  const [bomProductId, setBomProductId] = useState<number | null>(null)

  const [bomEditOpen, setBomEditOpen] = useState(false)
  const [bomEditSaving, setBomEditSaving] = useState(false)
  const [bomEditRows, setBomEditRows] = useState<any[]>([])

  const [bomProductsLoading, setBomProductsLoading] = useState(false)
  const [bomAllProducts, setBomAllProducts] = useState<any[]>([])
  const [bomCurrenciesLoading, setBomCurrenciesLoading] = useState(false)
  const [bomCurrencies, setBomCurrencies] = useState<any[]>([])

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

  const [attachments, setAttachments] = useState<AttachmentRow[]>([])
  const [attachOpen, setAttachOpen] = useState(false)
  const [attachForm] = Form.useForm()

  const [attachRefType, setAttachRefType] = useState<string>('SALES_ORDER')
  const [attachRefId, setAttachRefId] = useState<number | null>(null)
  const [attachLoading, setAttachLoading] = useState(false)

  const [approveLoading, setApproveLoading] = useState(false)

  const [shipOpen, setShipOpen] = useState(false)
  const [shipSaving, setShipSaving] = useState(false)
  const [shipForm] = Form.useForm()

  const [shipResultOpen, setShipResultOpen] = useState(false)
  const [createdShipmentMovement, setCreatedShipmentMovement] = useState<any | null>(null)
  const [shipCompleting, setShipCompleting] = useState(false)

  const [shipmentRowCompletingId, setShipmentRowCompletingId] = useState<number | null>(null)

  const [invoiceRowCompletingId, setInvoiceRowCompletingId] = useState<number | null>(null)
  const [invoiceVoidOpen, setInvoiceVoidOpen] = useState(false)
  const [invoiceVoiding, setInvoiceVoiding] = useState(false)
  const [invoiceVoidId, setInvoiceVoidId] = useState<number | null>(null)
  const [invoiceVoidForm] = Form.useForm()

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

  const [addLineOpen, setAddLineOpen] = useState(false)
  const [addLineSaving, setAddLineSaving] = useState(false)
  const [addLineForm] = Form.useForm()

  const bomCurrencyOptions = useMemo(
    () => (bomCurrencies || []).map((c: any) => ({ value: c.id, label: `${c.code || c.id} - ${c.name || ''}`.trim() })),
    [bomCurrencies]
  )

  const toLocalDateString = (d: any) => {
    if (!d) return null
    try {
      return dayjs(d).format('YYYY-MM-DD')
    } catch {
      return null
    }
  }

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

  useEffect(() => {
    if (!companyId) return
    if (bomAllProducts.length) return
    void (async () => {
      setBomProductsLoading(true)
      try {
        const prods = await masterDataApi.listProducts(companyId)
        setBomAllProducts((prods || []) as any[])
      } catch (e: any) {
        message.error(getApiErrorMessage(e, 'Failed to load products'))
      } finally {
        setBomProductsLoading(false)
      }
    })()
  }, [bomAllProducts.length, companyId])

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

  const loadBomEditorLookups = async (cid: number) => {
    setBomProductsLoading(true)
    setBomCurrenciesLoading(true)
    try {
      const [prods, curs] = await Promise.all([
        masterDataApi.listProducts(cid),
        masterDataApi.listCurrencies(cid)
      ])
      setBomAllProducts((prods || []) as any[])
      setBomCurrencies((curs || []) as any[])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load BOM editor lookups'))
    } finally {
      setBomProductsLoading(false)
      setBomCurrenciesLoading(false)
    }
  }

  const openBomEditor = async () => {
    if (!companyId || !so?.id) return
    if (!bomSelectedLineMeta?.id) {
      message.error('Finished goods line is missing')
      return
    }
    if (String(so?.status || '') !== 'DRAFTED') {
      message.error('Only allowed while Sales Order is DRAFTED')
      return
    }
    if (!bomAllProducts.length || !bomCurrencies.length) {
      await loadBomEditorLookups(companyId)
    }

    const existing = (bomSnapshotForSelectedProduct?.lines || []) as any[]
    setBomEditRows(
      (existing || []).map((r: any) => ({
        componentProductId: r.componentProductId ?? null,
        qty: r.qty ?? null,
        bomCode: r.bomCode ?? null,
        description1: r.description1 ?? null,
        colorDescription2: r.colorDescription2 ?? null,
        unit: r.unit ?? null,
        unitPriceForeign: r.unitPriceForeign ?? null,
        unitPriceDomestic: r.unitPriceDomestic ?? null,
        yy: r.yy ?? null,
        exchangeRate: r.exchangeRate ?? null,
        amountForeign: r.amountForeign ?? null,
        amountDomestic: r.amountDomestic ?? null,
        currencyId: r.currencyId ?? null
      }))
    )

    setBomEditOpen(true)
  }

  const saveBomEditor = async () => {
    if (!companyId || !so?.id) return
    if (!bomSelectedLineMeta?.id) return

    const validRows = (bomEditRows || [])
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
      message.error('Please add at least 1 row with Component and Qty > 0')
      return
    }

    setBomEditSaving(true)
    try {
      await salesApi.setSalesOrderLineBom(companyId, so.id, {
        salesOrderLineId: Number(bomSelectedLineMeta.id),
        sourceBomId: null,
        sourceBomVersion: null,
        lines: validRows
      })
      message.success('BOM saved')
      await loadBoms(companyId, so.id)
      setBomEditOpen(false)
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to save BOM'))
    } finally {
      setBomEditSaving(false)
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

  const loadAttachments = async (cid: number, refType: string, refId: number) => {
    setAttachLoading(true)
    try {
      const res = await coreApi.listAttachments(cid, { refType, refId })
      setAttachments((res || []) as AttachmentRow[])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load attachments'))
      setAttachments([])
    } finally {
      setAttachLoading(false)
    }
  }

  const bomByLineId = useMemo(() => {
    const m = new Map<number, any>()
    for (const b of bomRows || []) {
      const lineId = Number((b as any).salesOrderLineId)
      if (!lineId) continue
      m.set(lineId, b)
    }
    return m
  }, [bomRows])

  const bomProductOptions = useMemo(() => {
    const map = new Map<string, { productId: number; label: string }>()
    for (const ln of (so?.lines || []) as any[]) {
      const pid = Number(ln?.productId)
      if (!pid) continue
      if (!map.has(String(pid))) {
        const label = ln?.style ? `Product ${pid} (${String(ln.style)})` : `Product ${pid}`
        map.set(String(pid), { productId: pid, label })
      }
    }
    return Array.from(map.values()).map((x) => ({ value: x.productId, label: x.label }))
  }, [so?.lines])

  useEffect(() => {
    if (bomProductId != null) return
    const first = (so?.lines || []).find((l: any) => l?.productId != null)
    if (first?.productId != null) setBomProductId(Number(first.productId))
  }, [bomProductId, so?.lines])

  const bomSnapshotForSelectedProduct = useMemo(() => {
    if (bomProductId == null) return null
    const lines = (so?.lines || []) as any[]
    const firstLine = lines.find((l) => Number(l?.productId) === Number(bomProductId) && l?.id != null)
    if (!firstLine?.id) return null
    return bomByLineId.get(Number(firstLine.id)) || null
  }, [bomByLineId, bomProductId, so?.lines])

  const bomSelectedLineMeta = useMemo(() => {
    if (bomProductId == null) return null
    const lines = (so?.lines || []) as any[]
    const firstLine = lines.find((l) => Number(l?.productId) === Number(bomProductId))
    return firstLine || null
  }, [bomProductId, so?.lines])

  const bomRawMaterialRows = useMemo(() => {
    const snap = bomSnapshotForSelectedProduct
    const rows = (snap?.lines || []) as any[]
    return rows.map((r, idx) => ({
      ...r,
      _rowKey: String(r?.id || `${r?.componentProductId || 'cmp'}-${idx}`)
    }))
  }, [bomSnapshotForSelectedProduct])

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

  const productLabelById = useMemo(() => {
    const m = new Map<number, string>()
    for (const p of (bomAllProducts || []) as any[]) {
      const id = Number(p?.id)
      if (!id) continue
      m.set(id, `${p.code || p.id} - ${p.name || ''}`.trim())
    }
    return m
  }, [bomAllProducts])

  const lineColumns = [
    {
      title: 'Item Name',
      dataIndex: 'productId',
      width: 220,
      render: (v: any) => {
        const id = Number(v)
        return productLabelById.get(id) || (v == null ? '-' : String(v))
      }
    },
    { title: 'Qty', dataIndex: 'qty', width: 90, align: 'right' as const },
    { title: 'Style', dataIndex: 'style', width: 140 },
    { title: 'Color', dataIndex: 'color', width: 120 },
    { title: 'Size', dataIndex: 'size', width: 100 },
    { title: 'Delivery Date', dataIndex: 'deliveryDate', width: 130 },
    { title: 'Ship Mode', dataIndex: 'shipMode', width: 120 },
    { title: 'Factory', dataIndex: 'factory', width: 140 },
    { title: 'Remark', dataIndex: 'remark' }
  ]

  const saveAddLine = async () => {
    if (!companyId) {
      message.error('Company not selected')
      return
    }
    if (!so?.id) {
      message.error('Sales Order not loaded')
      return
    }
    if (String(so?.status || '') !== 'DRAFTED') {
      message.error('Only allowed while Sales Order is DRAFTED')
      return
    }

    setAddLineSaving(true)
    try {
      const values = await addLineForm.validateFields()
      const existingLines = ((so as any)?.lines || []) as any[]

      const payload: any = {
        ...(so as any),
        orderDate: (so as any)?.orderDate ?? null,
        lines: [...existingLines, values].map((l: any) => ({
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
        }))
      }

      await salesApi.updateSalesOrder(companyId, so.id, payload)
      message.success('Item added')
      setAddLineOpen(false)
      await load(companyId, so.id)
      await loadBoms(companyId, so.id)
    } catch (e: any) {
      if (e?.errorFields) {
        message.error('Please complete required fields')
      } else {
        message.error(getApiErrorMessage(e, 'Failed to add item'))
      }
    } finally {
      setAddLineSaving(false)
    }
  }

  const attachmentColumns = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        render: (_: any, r: AttachmentRow) => (
          <Typography.Text>{r?.name || r?.originalFileName || String(r?.id)}</Typography.Text>
        )
      },
      { title: 'File', dataIndex: 'originalFileName' },
      {
        title: 'Size',
        dataIndex: 'sizeBytes',
        width: 120,
        align: 'right' as const,
        render: (v: any) => (v == null ? '-' : Number(v).toLocaleString())
      },
      { title: 'Created At', dataIndex: 'createdAt', width: 180 },
      {
        title: 'Action',
        key: 'action',
        width: 160,
        render: (_: any, r: AttachmentRow) => (
          <Space>
            <Button
              size="small"
              type="link"
              onClick={async () => {
                if (!companyId || !r?.id) return
                try {
                  const res = await coreApi.downloadAttachment(companyId, r.id)
                  const blobUrl = URL.createObjectURL(res.data)
                  const a = document.createElement('a')
                  a.href = blobUrl
                  a.download = String(r.originalFileName || `attachment-${r.id}`)
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                  URL.revokeObjectURL(blobUrl)
                } catch (e: any) {
                  message.error(getApiErrorMessage(e, 'Failed to download attachment'))
                }
              }}
            >
              Download
            </Button>
            <Button
              size="small"
              danger
              onClick={async () => {
                if (!companyId || !r?.id || attachRefId == null) return
                try {
                  await coreApi.deleteAttachment(companyId, r.id)
                  message.success('Attachment removed')
                  await loadAttachments(companyId, attachRefType, attachRefId)
                } catch (e: any) {
                  message.error(getApiErrorMessage(e, 'Failed to remove attachment'))
                }
              }}
            >
              Remove
            </Button>
          </Space>
        )
      }
    ],
    [attachRefId, attachRefType, companyId]
  )

  const attachmentTargets = useMemo(() => {
    const soId = Number(id)
    const opts: { label: string; value: string }[] = []
    if (soId) opts.push({ label: `Sales Order (Header)`, value: `SALES_ORDER:${soId}` })
    for (const ln of so?.lines || []) {
      if (!ln?.id) continue
      const label = ln?.productId ? `SO Line ${ln.id} (Product ${ln.productId})` : `SO Line ${ln.id}`
      opts.push({ label, value: `SALES_ORDER_LINE:${ln.id}` })
    }
    return opts
  }, [id, so?.lines])

  useEffect(() => {
    const soId = Number(id)
    if (!companyId || !soId) return
    setAttachRefType('SALES_ORDER')
    setAttachRefId(soId)
    void loadAttachments(companyId, 'SALES_ORDER', soId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, id])

  const scheduleColumns = [
    { title: 'Delivery Date', dataIndex: 'deliveryDate', width: 140 },
    { title: 'Ship Mode', dataIndex: 'shipMode', width: 140 },
    { title: 'Factory', dataIndex: 'factory', width: 160 },
    { title: 'Remark', dataIndex: 'remark' }
  ]

  const shipmentColumns = [
    {
      title: 'Document No',
      dataIndex: 'documentNo',
      width: 180,
      render: (v: any) => (
        <Button
          type="link"
          style={{ padding: 0 }}
          onClick={() => {
            if (!v) return
            navigate(`/modules/inventory/movements?q=${encodeURIComponent(String(v))}`)
          }}
        >
          {v}
        </Button>
      )
    },
    { title: 'Status', dataIndex: 'status', width: 140 },
    { title: 'Type', dataIndex: 'movementType', width: 100 },
    { title: 'Date', dataIndex: 'movementDate', width: 120 },
    { title: 'Description', dataIndex: 'description' },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (_: any, r: any) => (
        <Button
          size="small"
          type="link"
          loading={shipmentRowCompletingId != null && String(shipmentRowCompletingId) === String(r?.id)}
          disabled={String(r?.status || '') !== 'DRAFTED'}
          onClick={async () => {
            if (!companyId || !so?.id || !r?.id) return
            try {
              setShipmentRowCompletingId(Number(r.id))
              await inventoryApi.completeMovement(companyId, r.id)
              message.success('Shipment completed')
              await load(companyId, so.id)
              await loadDocuments(companyId, so.id)
            } catch (e: any) {
              message.error(getApiErrorMessage(e, 'Failed to complete shipment'))
            } finally {
              setShipmentRowCompletingId(null)
            }
          }}
        >
          Complete
        </Button>
      )
    }
  ]

  const invoiceColumns = [
    {
      title: 'Document No',
      dataIndex: 'documentNo',
      width: 180,
      render: (v: any) => (
        <Button
          type="link"
          style={{ padding: 0 }}
          onClick={() => {
            if (!v) return
            navigate(`/modules/finance/invoices?q=${encodeURIComponent(String(v))}`)
          }}
        >
          {v}
        </Button>
      )
    },
    { title: 'Type', dataIndex: 'invoiceType', width: 90 },
    { title: 'Status', dataIndex: 'status', width: 120 },
    { title: 'Date', dataIndex: 'invoiceDate', width: 120 },
    { title: 'Grand Total', dataIndex: 'grandTotal', width: 140, align: 'right' as const, render: (v: any) => (v == null ? '-' : Number(v).toLocaleString()) },
    {
      title: 'Action',
      key: 'action',
      width: 170,
      render: (_: any, r: any) => {
        const status = String(r?.status || '')
        const canComplete = status === 'DRAFTED'
        const canVoid = status !== 'VOIDED'
        return (
          <Space size={8}>
            <Popconfirm
              title="Complete this invoice?"
              okText="Complete"
              cancelText="Cancel"
              disabled={!companyId || !so?.id || !r?.id || !canComplete}
              onConfirm={async () => {
                if (!companyId || !so?.id || !r?.id) return
                try {
                  setInvoiceRowCompletingId(Number(r.id))
                  await financeApi.completeInvoice(companyId, r.id)
                  message.success('Invoice completed')
                  await load(companyId, so.id)
                  await loadDocuments(companyId, so.id)
                } catch (e: any) {
                  message.error(getApiErrorMessage(e, 'Failed to complete invoice'))
                } finally {
                  setInvoiceRowCompletingId(null)
                }
              }}
            >
              <Button
                size="small"
                type="primary"
                loading={invoiceRowCompletingId != null && String(invoiceRowCompletingId) === String(r?.id)}
                disabled={!companyId || !so?.id || !r?.id || !canComplete}
              >
                Complete
              </Button>
            </Popconfirm>

            <Button
              size="small"
              danger
              disabled={!companyId || !so?.id || !r?.id || !canVoid}
              onClick={() => {
                setInvoiceVoidId(Number(r.id))
                invoiceVoidForm.resetFields()
                invoiceVoidForm.setFieldsValue({ voidDate: dayjs(), reason: '' })
                setInvoiceVoidOpen(true)
              }}
            >
              Void
            </Button>
          </Space>
        )
      }
    }
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
              children: (
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button
                      type="primary"
                      disabled={String(so?.status || '') !== 'DRAFTED'}
                      onClick={() => {
                        addLineForm.resetFields()
                        addLineForm.setFieldsValue({ qty: 1 })
                        setAddLineOpen(true)
                      }}
                    >
                      Add Item
                    </Button>
                  </Space>
                  <DataTable
                    rowKey={(r: any) => r.id || `${r.productId}-${r.style}-${r.color}-${r.size}`}
                    dataSource={so?.lines || []}
                    columns={lineColumns}
                  />
                </Space>
              )
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
                      Approval requires BOM snapshot. Set BOM once per product (Finished Goods) before approving.
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

                  <Card size="small" title="Finished Goods Assignment to BOM">
                    <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Select
                        style={{ width: 360, maxWidth: '100%' }}
                        placeholder="Select finished goods"
                        value={bomProductId ?? undefined}
                        options={bomProductOptions}
                        onChange={(v) => setBomProductId(Number(v))}
                        showSearch
                        optionFilterProp="label"
                      />
                      <Button
                        onClick={() => {
                          if (!bomSelectedLineMeta?.id) return
                          setApplyLineId(Number(bomSelectedLineMeta.id))
                          setApplyBomId(null)
                          setApplyOpen(true)
                        }}
                        disabled={String(so?.status || '') !== 'DRAFTED' || !bomSelectedLineMeta?.id}
                      >
                        Apply Master BOM
                      </Button>
                    </Space>
                  </Card>

                  <Space wrap style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Typography.Text type="secondary">
                      Manual edit will save as BOM snapshot for selected finished goods.
                    </Typography.Text>
                    <Button onClick={() => void openBomEditor()} disabled={String(so?.status || '') !== 'DRAFTED' || !bomSelectedLineMeta?.id}>
                      Edit Raw Materials
                    </Button>
                  </Space>

                  <Tabs
                    items={[
                      {
                        key: 'raw',
                        label: 'Raw Materials',
                        children: (
                          <Table
                            size="small"
                            rowKey={(r: any) => String(r?._rowKey)}
                            loading={bomLoading}
                            dataSource={bomRawMaterialRows}
                            scroll={{ x: 1400 }}
                            pagination={{ pageSize: 10 }}
                            columns={[
                              { title: 'Finished Goods', dataIndex: 'finishedGoods', width: 140, render: () => (bomProductId == null ? '-' : `Product ${bomProductId}`) },
                              { title: 'Style', dataIndex: 'style', width: 160, render: () => String(bomSelectedLineMeta?.style || '-') },
                              { title: 'BOM Code', dataIndex: 'bomCode', width: 160 },
                              { title: 'Description(1)', dataIndex: 'description1', width: 220 },
                              { title: 'Color (Description(2))', dataIndex: 'colorDescription2', width: 180 },
                              { title: 'Unit', dataIndex: 'unit', width: 90 },
                              { title: 'Unit Price (Foreign)', dataIndex: 'unitPriceForeign', width: 150, align: 'right', render: (v: any) => (v == null ? '-' : Number(v).toLocaleString()) },
                              { title: 'Unit Price (Domestic)', dataIndex: 'unitPriceDomestic', width: 160, align: 'right', render: (v: any) => (v == null ? '-' : Number(v).toLocaleString()) },
                              { title: 'YY', dataIndex: 'yy', width: 90, align: 'right', render: (v: any) => (v == null ? '-' : Number(v).toLocaleString()) },
                              { title: 'Exchange Rate', dataIndex: 'exchangeRate', width: 140, align: 'right', render: (v: any) => (v == null ? '-' : Number(v).toLocaleString()) },
                              { title: 'Amount (Foreign)', dataIndex: 'amountForeign', width: 150, align: 'right', render: (v: any) => (v == null ? '-' : Number(v).toLocaleString()) },
                              { title: 'Amount (Domestic)', dataIndex: 'amountDomestic', width: 160, align: 'right', render: (v: any) => (v == null ? '-' : Number(v).toLocaleString()) },
                              { title: 'Currency', dataIndex: 'currencyId', width: 110, render: (v: any) => (v == null ? '-' : String(v)) }
                            ] as any}
                          />
                        )
                      },
                      {
                        key: 'fg',
                        label: 'Finished Goods',
                        children: (
                          <Typography.Text type="secondary">Finished goods summary can be added here.</Typography.Text>
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
                    <Table size="small" rowKey={(r: any) => String(r?.id)} dataSource={invoices} loading={docsLoading} columns={invoiceColumns as any} />
                  </Card>

                  <Card>
                    <Space wrap style={{ justifyContent: 'space-between', width: '100%' }}>
                      <div>
                        <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 0 }}>
                          Attachments
                        </Typography.Title>
                        <Typography.Text type="secondary">Upload/download attachment (Option B).</Typography.Text>
                      </div>
                      <Space wrap>
                        <Select
                          value={attachRefId != null ? `${attachRefType}:${attachRefId}` : undefined}
                          style={{ width: 320, maxWidth: '100%' }}
                          options={attachmentTargets}
                          onChange={(v) => {
                            const parts = String(v || '').split(':')
                            const rt = parts[0]
                            const rid = Number(parts[1])
                            if (!rt || !rid || !companyId) return
                            setAttachRefType(rt)
                            setAttachRefId(rid)
                            void loadAttachments(companyId, rt, rid)
                          }}
                        />
                        <Button
                          onClick={() => {
                            attachForm.resetFields()
                            attachForm.setFieldsValue({ name: '' })
                            setAttachOpen(true)
                          }}
                          disabled={!companyId || attachRefId == null}
                        >
                          Upload
                        </Button>
                      </Space>
                    </Space>

                    <div style={{ marginTop: 12 }}>
                      <Table
                        size="small"
                        loading={attachLoading}
                        rowKey={(r: AttachmentRow) => String(r.id)}
                        dataSource={attachments}
                        columns={attachmentColumns as any}
                        pagination={false}
                      />
                    </div>
                  </Card>
                </Space>
              )
            }
          ]}
        />
      </Card>

      <Modal
        open={addLineOpen}
        title="Add Item"
        width={860}
        onCancel={() => setAddLineOpen(false)}
        footer={
          <Space>
            <Button onClick={() => setAddLineOpen(false)} disabled={addLineSaving}>
              Cancel
            </Button>
            <Button type="primary" loading={addLineSaving} onClick={() => void saveAddLine()}>
              OK
            </Button>
          </Space>
        }
        destroyOnClose
      >
        <Form layout="vertical" form={addLineForm}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
            <Form.Item label="Item Name" name="productId" rules={[{ required: true, message: 'Please enter Item Name' }]}>
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Selection"
                options={(bomAllProducts || []).map((p: any) => ({
                  value: p.id,
                  label: `${p.code || p.id} - ${p.name || ''}`.trim()
                }))}
              />
            </Form.Item>
            <Form.Item label="Qty" name="qty" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0.0001} placeholder="0" />
            </Form.Item>
            <Form.Item label="Unit Price" name="unitPrice">
              <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
            <Form.Item label="Style" name="style">
              <Input />
            </Form.Item>
            <Form.Item label="Color" name="color">
              <Input />
            </Form.Item>
            <Form.Item label="Size" name="size">
              <Input />
            </Form.Item>
            <Form.Item label="Delivery Date" name="deliveryDate">
              <DatePicker style={{ width: '100%' }} placeholder="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item label="Ship Mode" name="shipMode">
              <Input />
            </Form.Item>
            <Form.Item label="Factory" name="factory">
              <Input />
            </Form.Item>
            <Form.Item label="Remark" name="remark">
              <Input />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal
        open={attachOpen}
        title="Upload Attachment"
        okText="Close"
        onCancel={() => setAttachOpen(false)}
        onOk={() => setAttachOpen(false)}
        destroyOnClose
      >
        <Form layout="vertical" form={attachForm}>
          <Form.Item name="name" label="Name (optional)">
            <Input placeholder="e.g. Customer PO" />
          </Form.Item>

          <Form.Item label="File">
            <Upload
              maxCount={1}
              showUploadList={false}
              customRequest={async (opts) => {
                if (!companyId || attachRefId == null) {
                  ;(opts as any).onError?.(new Error('Company/Ref is required'))
                  return
                }
                try {
                  const v = await attachForm.validateFields()
                  const file = (opts as any).file as File
                  await coreApi.uploadAttachment(companyId, { refType: attachRefType, refId: attachRefId, name: v.name || undefined }, file)
                  message.success('Uploaded')
                  ;(opts as any).onSuccess?.({}, (opts as any).file)
                  await loadAttachments(companyId, attachRefType, attachRefId)
                } catch (e: any) {
                  ;(opts as any).onError?.(e)
                  message.error(getApiErrorMessage(e, 'Upload failed'))
                }
              }}
            >
              <Button disabled={!companyId || attachRefId == null}>Select File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Edit Raw Materials - Product ${bomProductId ?? ''}`.trim()}
        open={bomEditOpen}
        width={1200}
        onCancel={() => {
          setBomEditOpen(false)
        }}
        footer={
          <Space>
            <Button
              onClick={() => {
                setBomEditOpen(false)
              }}
              disabled={bomEditSaving}
            >
              Cancel
            </Button>
            <Button type="primary" onClick={() => void saveBomEditor()} loading={bomEditSaving}>
              Save
            </Button>
          </Space>
        }
        destroyOnClose
      >
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Space wrap style={{ justifyContent: 'space-between', width: '100%' }}>
            <Typography.Text type="secondary">
              Component Product & Qty are required. This will apply to all Sales Order lines with the same product.
            </Typography.Text>
            <Button
              onClick={() =>
                setBomEditRows((prev) => [
                  ...(prev || []),
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
                ])
              }
              disabled={bomEditSaving}
            >
              Add Row
            </Button>
          </Space>

          <Table
            size="small"
            pagination={false}
            rowKey={(_: any, i) => String(i)}
            dataSource={bomEditRows}
            scroll={{ x: 1600 }}
            loading={bomProductsLoading || bomCurrenciesLoading}
            columns={[
              {
                title: 'Component',
                dataIndex: 'componentProductId',
                width: 260,
                render: (_: any, r: any, idx: number) => (
                  <Select
                    showSearch
                    optionFilterProp="label"
                    placeholder="Select component"
                    style={{ width: '100%' }}
                    options={(bomAllProducts || []).map((p: any) => ({
                      value: p.id,
                      label: `${p.code || p.id} - ${p.name || ''}`.trim()
                    }))}
                    value={r.componentProductId ?? undefined}
                    onChange={(v) => {
                      setBomEditRows((prev) => {
                        const arr = [...(prev || [])]
                        arr[idx] = { ...arr[idx], componentProductId: v }
                        return arr
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
                      setBomEditRows((prev) => {
                        const arr = [...(prev || [])]
                        arr[idx] = { ...arr[idx], qty: v }
                        return arr
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
                      setBomEditRows((prev) => {
                        const arr = [...(prev || [])]
                        arr[idx] = { ...arr[idx], bomCode: e.target.value }
                        return arr
                      })
                    }}
                  />
                )
              },
              {
                title: 'Description(1)',
                dataIndex: 'description1',
                width: 200,
                render: (_: any, r: any, idx: number) => (
                  <Input
                    value={r.description1 ?? ''}
                    onChange={(e) => {
                      setBomEditRows((prev) => {
                        const arr = [...(prev || [])]
                        arr[idx] = { ...arr[idx], description1: e.target.value }
                        return arr
                      })
                    }}
                  />
                )
              },
              {
                title: 'Color Desc(2)',
                dataIndex: 'colorDescription2',
                width: 180,
                render: (_: any, r: any, idx: number) => (
                  <Input
                    value={r.colorDescription2 ?? ''}
                    onChange={(e) => {
                      setBomEditRows((prev) => {
                        const arr = [...(prev || [])]
                        arr[idx] = { ...arr[idx], colorDescription2: e.target.value }
                        return arr
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
                      setBomEditRows((prev) => {
                        const arr = [...(prev || [])]
                        arr[idx] = { ...arr[idx], unit: e.target.value }
                        return arr
                      })
                    }}
                  />
                )
              },
              {
                title: 'Unit Price (Foreign)',
                dataIndex: 'unitPriceForeign',
                width: 150,
                render: (_: any, r: any, idx: number) => (
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="0"
                    value={r.unitPriceForeign ?? undefined}
                    onChange={(v) => {
                      setBomEditRows((prev) => {
                        const arr = [...(prev || [])]
                        arr[idx] = { ...arr[idx], unitPriceForeign: v }
                        return arr
                      })
                    }}
                  />
                )
              },
              {
                title: 'Unit Price (Domestic)',
                dataIndex: 'unitPriceDomestic',
                width: 160,
                render: (_: any, r: any, idx: number) => (
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="0"
                    value={r.unitPriceDomestic ?? undefined}
                    onChange={(v) => {
                      setBomEditRows((prev) => {
                        const arr = [...(prev || [])]
                        arr[idx] = { ...arr[idx], unitPriceDomestic: v }
                        return arr
                      })
                    }}
                  />
                )
              },
              {
                title: 'YY',
                dataIndex: 'yy',
                width: 100,
                render: (_: any, r: any, idx: number) => (
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="0"
                    value={r.yy ?? undefined}
                    onChange={(v) => {
                      setBomEditRows((prev) => {
                        const arr = [...(prev || [])]
                        arr[idx] = { ...arr[idx], yy: v }
                        return arr
                      })
                    }}
                  />
                )
              },
              {
                title: 'Exchange Rate',
                dataIndex: 'exchangeRate',
                width: 140,
                render: (_: any, r: any, idx: number) => (
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="0"
                    value={r.exchangeRate ?? undefined}
                    onChange={(v) => {
                      setBomEditRows((prev) => {
                        const arr = [...(prev || [])]
                        arr[idx] = { ...arr[idx], exchangeRate: v }
                        return arr
                      })
                    }}
                  />
                )
              },
              {
                title: 'Amount (Foreign)',
                dataIndex: 'amountForeign',
                width: 150,
                render: (_: any, r: any, idx: number) => (
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="0"
                    value={r.amountForeign ?? undefined}
                    onChange={(v) => {
                      setBomEditRows((prev) => {
                        const arr = [...(prev || [])]
                        arr[idx] = { ...arr[idx], amountForeign: v }
                        return arr
                      })
                    }}
                  />
                )
              },
              {
                title: 'Amount (Domestic)',
                dataIndex: 'amountDomestic',
                width: 160,
                render: (_: any, r: any, idx: number) => (
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="0"
                    value={r.amountDomestic ?? undefined}
                    onChange={(v) => {
                      setBomEditRows((prev) => {
                        const arr = [...(prev || [])]
                        arr[idx] = { ...arr[idx], amountDomestic: v }
                        return arr
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
                    placeholder="Select"
                    style={{ width: '100%' }}
                    options={bomCurrencyOptions}
                    value={r.currencyId ?? undefined}
                    onChange={(v) => {
                      setBomEditRows((prev) => {
                        const arr = [...(prev || [])]
                        arr[idx] = { ...arr[idx], currencyId: v }
                        return arr
                      })
                    }}
                  />
                )
              },
              {
                title: '',
                key: 'act',
                width: 80,
                render: (_: any, __: any, idx: number) => (
                  <Button
                    danger
                    size="small"
                    onClick={() => {
                      setBomEditRows((prev) => {
                        const arr = [...(prev || [])]
                        arr.splice(idx, 1)
                        return arr
                      })
                    }}
                    disabled={bomEditSaving}
                  >
                    Remove
                  </Button>
                )
              }
            ]}
          />
        </Space>
      </Modal>

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
            setCreatedShipmentMovement(movement)
            setShipResultOpen(true)
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
        open={invoiceVoidOpen}
        title="Void Invoice"
        okText="Void"
        okButtonProps={{ danger: true }}
        confirmLoading={invoiceVoiding}
        onCancel={() => {
          setInvoiceVoidOpen(false)
          setInvoiceVoidId(null)
        }}
        onOk={async () => {
          if (!companyId || !so?.id) {
            message.error('Company is required')
            return
          }
          if (invoiceVoidId == null) {
            message.error('Invoice id is missing')
            return
          }
          try {
            setInvoiceVoiding(true)
            const v = await invoiceVoidForm.validateFields()
            await financeApi.voidInvoice(companyId, invoiceVoidId, {
              voidDate: v.voidDate ? dayjs(v.voidDate).format('YYYY-MM-DD') : null,
              reason: v.reason || null
            })
            message.success('Invoice voided')
            setInvoiceVoidOpen(false)
            setInvoiceVoidId(null)
            await load(companyId, so.id)
            await loadDocuments(companyId, so.id)
          } catch (e: any) {
            if (e?.errorFields) {
              message.error('Please complete required fields')
              return
            }
            message.error(getApiErrorMessage(e, 'Failed to void invoice'))
          } finally {
            setInvoiceVoiding(false)
          }
        }}
        destroyOnClose
      >
        <Form layout="vertical" form={invoiceVoidForm}>
          <Form.Item name="voidDate" label="Void Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="reason" label="Reason">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={shipResultOpen}
        title="Shipment Created"
        footer={
          <Space wrap style={{ justifyContent: 'flex-end', width: '100%' }}>
            <Button
              type="primary"
              loading={shipCompleting}
              disabled={!companyId || !createdShipmentMovement?.id || String(createdShipmentMovement?.status || '') !== 'DRAFTED'}
              onClick={async () => {
                if (!companyId || !createdShipmentMovement?.id) return
                try {
                  setShipCompleting(true)
                  await inventoryApi.completeMovement(companyId, createdShipmentMovement.id)
                  message.success('Shipment completed')
                  setShipResultOpen(false)
                  setCreatedShipmentMovement(null)
                  await load(companyId, so?.id as any)
                  await loadDocuments(companyId, so?.id as any)
                } catch (e: any) {
                  message.error(getApiErrorMessage(e, 'Failed to complete shipment'))
                } finally {
                  setShipCompleting(false)
                }
              }}
            >
              Complete Now
            </Button>
            <Button
              onClick={() => {
                setShipResultOpen(false)
                setCreatedShipmentMovement(null)
              }}
            >
              Close
            </Button>
          </Space>
        }
        onCancel={() => {
          setShipResultOpen(false)
          setCreatedShipmentMovement(null)
        }}
        destroyOnClose
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Typography.Text>
            Document No: <b>{createdShipmentMovement?.documentNo || '-'}</b>
          </Typography.Text>
          <Typography.Text type="secondary">Status: {createdShipmentMovement?.status || '-'}</Typography.Text>
        </Space>
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
