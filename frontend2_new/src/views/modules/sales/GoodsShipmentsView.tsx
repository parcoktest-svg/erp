import { Button, Card, Input, Select, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { coreApi, inventoryApi, salesApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import { getApiErrorMessage } from '@/utils/error'

type CompanyRow = { id: number; code?: string; name?: string }

type MovementRow = {
  id: number
  documentNo?: string
  status?: string
  movementType?: 'IN' | 'OUT' | 'TRANSFER'
  movementDate?: string
  description?: string
  lines?: any[]
}

type SalesOrderRow = { id: number; documentNo?: string; status?: string }

function escapeCsv(v: any) {
  const s = String(v ?? '')
  const needs = /[",\n\r]/.test(s)
  const out = s.replaceAll('"', '""')
  return needs ? `"${out}"` : out
}

function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function GoodsShipmentsView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<MovementRow[]>([])

  const [q, setQ] = useState('')
  const [salesOrders, setSalesOrders] = useState<SalesOrderRow[]>([])
  const [salesOrderId, setSalesOrderId] = useState<number | null>(null)

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

  const load = async (cid: number) => {
    setLoading(true)
    try {
      const res = await inventoryApi.listMovements(cid, {
        movementType: 'OUT',
        q: q || undefined,
        salesOrderId: salesOrderId || undefined
      })
      setRows(res || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load goods shipments'))
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  const loadSalesOrders = async (cid: number) => {
    try {
      const res = await salesApi.listSalesOrders(cid)
      setSalesOrders(res || [])
    } catch {
      setSalesOrders([])
    }
  }

  useEffect(() => {
    void loadCompanies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!companyId) return
    void loadSalesOrders(companyId)
    void load(companyId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: c.id, label: `${c.code || c.id} - ${c.name || ''}` })),
    [companies]
  )

  const filteredRows = useMemo(() => rows, [rows])

  const salesOrderOptions = useMemo(
    () =>
      (salesOrders || []).map((s) => ({
        value: s.id,
        label: `${s.documentNo || s.id} (${s.status || ''})`
      })),
    [salesOrders]
  )

  const columns: ColumnsType<MovementRow> = [
    { title: 'Doc No', dataIndex: 'documentNo', width: 180 },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 140,
      render: (v: any) => {
        const s = String(v || '')
        if (s === 'DRAFTED') return <Tag>Drafted</Tag>
        if (s === 'COMPLETED') return <Tag color="green">Completed</Tag>
        if (s === 'VOIDED') return <Tag color="red">Voided</Tag>
        return <Tag>{s}</Tag>
      }
    },
    { title: 'Date', dataIndex: 'movementDate', width: 130 },
    { title: 'Description', dataIndex: 'description' },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, r) => (
        <Button
          size="small"
          onClick={() => {
            const w = window.open('', '_blank', 'width=1000,height=700')
            if (!w) {
              message.error('Popup blocked')
              return
            }
            const safe = (x: any) => String(x ?? '')
            const linesHtml = (r.lines || [])
              .map((ln: any) => {
                const prod = ln?.product?.code ? `${ln.product.code} - ${ln.product.name || ''}` : safe(ln?.product?.id)
                const from = ln?.fromLocator?.code ? `${ln.fromLocator.code} - ${ln.fromLocator.name || ''}` : safe(ln?.fromLocator?.id)
                const to = ln?.toLocator?.code ? `${ln.toLocator.code} - ${ln.toLocator.name || ''}` : safe(ln?.toLocator?.id)
                return `<tr><td>${prod}</td><td style="text-align:right">${safe(ln?.qty)}</td><td>${from}</td><td>${to}</td></tr>`
              })
              .join('')
            w.document.write(`
              <html>
                <head>
                  <title>Goods Shipment ${safe(r.documentNo)}</title>
                  <style>
                    body{font-family:Arial, sans-serif; padding:16px}
                    h2{margin:0 0 8px 0}
                    table{width:100%; border-collapse:collapse; margin-top:12px}
                    th,td{border:1px solid #ddd; padding:8px}
                    th{background:#f5f5f5; text-align:left}
                  </style>
                </head>
                <body>
                  <h2>Goods Shipment</h2>
                  <div><b>Doc No:</b> ${safe(r.documentNo)}</div>
                  <div><b>Date:</b> ${safe(r.movementDate)}</div>
                  <div><b>Status:</b> ${safe(r.status)}</div>
                  <div><b>Description:</b> ${safe(r.description)}</div>
                  <table>
                    <thead><tr><th>Product</th><th>Qty</th><th>From</th><th>To</th></tr></thead>
                    <tbody>${linesHtml}</tbody>
                  </table>
                  <script>window.print();</script>
                </body>
              </html>
            `)
            w.document.close()
          }}
        >
          Print
        </Button>
      )
    }
  ]

  const lineColumns: ColumnsType<any> = [
    {
      title: 'Product',
      dataIndex: 'product',
      render: (p: any) => (p?.code ? `${p.code} - ${p.name || ''}` : p?.id || '-')
    },
    { title: 'Qty', dataIndex: 'qty', width: 120 },
    {
      title: 'From',
      dataIndex: 'fromLocator',
      render: (l: any) => (l?.code ? `${l.code} - ${l.name || ''}` : l?.id || '-')
    },
    {
      title: 'To',
      dataIndex: 'toLocator',
      render: (l: any) => (l?.code ? `${l.code} - ${l.name || ''}` : l?.id || '-')
    }
  ]

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Goods Shipments
            </Typography.Title>
            <Typography.Text type="secondary">History of OUT inventory movements (delivery / shipment).</Typography.Text>
          </div>
          <Space>
            <Button
              onClick={() => {
                const header = ['DocNo', 'Status', 'Date', 'Description']
                const lines = filteredRows.map((r) => [r.documentNo, r.status, r.movementDate, r.description].map(escapeCsv).join(','))
                downloadText('goods-shipments.csv', [header.join(','), ...lines].join('\n'), 'text/csv;charset=utf-8')
              }}
              disabled={filteredRows.length === 0}
            >
              Export CSV
            </Button>
            <Button
              onClick={() => companyId && load(companyId)}
              disabled={!companyId}
              loading={loading}
            >
              Refresh
            </Button>
          </Space>
        </Space>
      </Card>

      <Card>
        <Space wrap style={{ width: '100%' }}>
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
          <div style={{ minWidth: 320 }}>
            <Typography.Text strong>Sales Order</Typography.Text>
            <Select
              allowClear
              value={salesOrderId ?? undefined}
              options={salesOrderOptions}
              placeholder="Filter by sales order"
              showSearch
              optionFilterProp="label"
              onChange={(v) => setSalesOrderId(v ?? null)}
            />
          </div>
          <div style={{ minWidth: 320 }}>
            <Typography.Text strong>Search</Typography.Text>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search doc no / date / description"
              onPressEnter={() => companyId && load(companyId)}
            />
          </div>
        </Space>
      </Card>

      <Card>
        <Table<MovementRow>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={filteredRows}
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (r) => (
              <Table
                size="small"
                rowKey={(x: any, idx) => String(x?.id || idx)}
                pagination={false}
                columns={lineColumns}
                dataSource={r.lines || []}
              />
            )
          }}
        />
      </Card>
    </Space>
  )
}
