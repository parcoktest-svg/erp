import { Button, Card, Form, InputNumber, Select, Space, Table, Tabs, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { coreApi, manufacturingApi, masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import { getApiErrorMessage } from '@/utils/error'

type CompanyRow = { id: number; code?: string; name?: string }

type PriceListRow = { id: number; name?: string }

type PriceListVersionRow = { id: number; name?: string }

type ProductRow = { id: number; code?: string; name?: string }

type BomRow = { id: number; productId?: number; version?: number }

type WipRow = {
  workOrderId?: number
  documentNo?: string
  status?: string
  workDate?: string
  bomId?: number
  productId?: number
  qty?: any
  issueMovementDocNo?: string
  receiptMovementDocNo?: string
}

type ProductionCostLine = { componentProductId?: number; requiredQty?: any; unitPrice?: any; lineCost?: any }

type ProductionCostReport = { lines?: ProductionCostLine[]; totalCost?: any }

export default function ManufacturingReportsView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [lookupLoading, setLookupLoading] = useState(false)
  const [products, setProducts] = useState<ProductRow[]>([])
  const [boms, setBoms] = useState<BomRow[]>([])
  const [priceListVersions, setPriceListVersions] = useState<PriceListVersionRow[]>([])

  const [wipLoading, setWipLoading] = useState(false)
  const [wipRows, setWipRows] = useState<WipRow[]>([])

  const [costLoading, setCostLoading] = useState(false)
  const [costReport, setCostReport] = useState<ProductionCostReport | null>(null)
  const [costForm] = Form.useForm()

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
      const [prodRes, bomRes, pls] = await Promise.all([
        masterDataApi.listProducts(cid),
        manufacturingApi.listBoms(cid),
        masterDataApi.listPriceLists(cid)
      ])

      setProducts(prodRes || [])
      setBoms(bomRes || [])

      const plArr = (pls || []) as PriceListRow[]
      const versionLists = await Promise.all(plArr.map((pl: any) => masterDataApi.listPriceListVersions(pl.id)))
      const flat = versionLists.flat().filter(Boolean)
      setPriceListVersions(flat as PriceListVersionRow[])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load lookups'))
      setProducts([])
      setBoms([])
      setPriceListVersions([])
    } finally {
      setLookupLoading(false)
    }
  }

  useEffect(() => {
    void loadCompanies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!companyId) return
    void loadLookups(companyId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: c.id, label: `${c.code || c.id} - ${c.name || ''}` })),
    [companies]
  )

  const productLabelById = useMemo(() => {
    const m = new Map<number, string>()
    for (const p of products) m.set(p.id, `${p.code || p.id} - ${p.name || ''}`)
    return m
  }, [products])

  const bomOptions = useMemo(
    () =>
      boms.map((b) => ({
        value: b.id,
        label: `BOM ${b.id} - ${productLabelById.get(Number(b.productId)) || b.productId} (v${b.version ?? ''})`
      })),
    [boms, productLabelById]
  )

  const plvOptions = useMemo(
    () => priceListVersions.map((v: any) => ({ value: v.id, label: v.name || String(v.id) })),
    [priceListVersions]
  )

  const wipColumns: ColumnsType<WipRow> = [
    { title: 'Doc No', dataIndex: 'documentNo', width: 180 },
    { title: 'Status', dataIndex: 'status', width: 120 },
    { title: 'Work Date', dataIndex: 'workDate', width: 130 },
    { title: 'BOM', dataIndex: 'bomId', width: 120 },
    {
      title: 'Product',
      dataIndex: 'productId',
      render: (v: any) => productLabelById.get(Number(v)) || v
    },
    { title: 'Qty', dataIndex: 'qty', width: 120 },
    { title: 'Issue Movement', dataIndex: 'issueMovementDocNo', width: 160 },
    { title: 'Receipt Movement', dataIndex: 'receiptMovementDocNo', width: 160 }
  ]

  const costLineColumns: ColumnsType<ProductionCostLine> = [
    {
      title: 'Component',
      dataIndex: 'componentProductId',
      render: (v: any) => productLabelById.get(Number(v)) || v
    },
    { title: 'Required Qty', dataIndex: 'requiredQty', width: 160 },
    { title: 'Unit Price', dataIndex: 'unitPrice', width: 140 },
    { title: 'Line Cost', dataIndex: 'lineCost', width: 140 }
  ]

  const loadWip = async () => {
    if (!companyId) return
    setWipLoading(true)
    try {
      const res = await manufacturingApi.wipReport(companyId)
      setWipRows(res?.rows || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load WIP report'))
      setWipRows([])
    } finally {
      setWipLoading(false)
    }
  }

  const runProductionCost = async () => {
    if (!companyId) return
    try {
      const values = await costForm.validateFields()
      setCostLoading(true)
      const res = await manufacturingApi.productionCost(companyId, {
        bomId: values.bomId,
        qty: values.qty,
        priceListVersionId: values.priceListVersionId
      })
      setCostReport(res)
    } catch (e: any) {
      if (e?.errorFields) return
      message.error(getApiErrorMessage(e, 'Failed to run production cost'))
      setCostReport(null)
    } finally {
      setCostLoading(false)
    }
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Manufacturing Reports
          </Typography.Title>
          <Space>
            <Button onClick={() => companyId && loadLookups(companyId)} disabled={!companyId} loading={lookupLoading}>
              Refresh Lookups
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
        <Tabs
          items={[
            {
              key: 'wip',
              label: 'WIP',
              children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space>
                    <Button type="primary" onClick={() => void loadWip()} disabled={!companyId} loading={wipLoading}>
                      Load WIP
                    </Button>
                    <Button onClick={() => setWipRows([])} disabled={wipLoading}>
                      Clear
                    </Button>
                  </Space>
                  <Table<WipRow>
                    rowKey={(r) => String(r.workOrderId || r.documentNo || Math.random())}
                    loading={wipLoading}
                    columns={wipColumns}
                    dataSource={wipRows}
                    pagination={{ pageSize: 10 }}
                  />
                </Space>
              )
            },
            {
              key: 'productionCost',
              label: 'Production Cost',
              children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form form={costForm} layout="vertical" initialValues={{ qty: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                      <Form.Item name="bomId" label="BOM" rules={[{ required: true }]}>
                        <Select showSearch optionFilterProp="label" loading={lookupLoading} options={bomOptions} />
                      </Form.Item>

                      <Form.Item name="qty" label="Qty" rules={[{ required: true }]}>
                        <InputNumber min={0.0001} style={{ width: '100%' }} />
                      </Form.Item>

                      <Form.Item name="priceListVersionId" label="Price List Version" rules={[{ required: true }]}>
                        <Select showSearch optionFilterProp="label" loading={lookupLoading} options={plvOptions} />
                      </Form.Item>

                      <Button type="primary" onClick={() => void runProductionCost()} disabled={!companyId} loading={costLoading}>
                        Run
                      </Button>
                    </div>
                  </Form>

                  <Card size="small">
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Typography.Text strong>Total Cost</Typography.Text>
                      <Typography.Text>{costReport?.totalCost == null ? '-' : String(costReport?.totalCost)}</Typography.Text>
                    </Space>
                  </Card>

                  <Table<ProductionCostLine>
                    rowKey={(r, idx) => String(r.componentProductId || idx)}
                    loading={costLoading}
                    columns={costLineColumns}
                    dataSource={costReport?.lines || []}
                    pagination={{ pageSize: 10 }}
                  />
                </Space>
              )
            }
          ]}
        />
      </Card>
    </Space>
  )
}
