import { Button, Card, Form, Select, Space, Table, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { coreApi, inventoryApi, masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import { getApiErrorMessage } from '@/utils/error'

type CompanyRow = { id: number; code?: string; name?: string }

type LocatorRow = { id: number; code?: string; name?: string }

type ProductRow = { id: number; code?: string; name?: string }

type OnHandRow = { locatorId: number; productId: number; onHandQty: any }

export default function OnHandView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [lookupLoading, setLookupLoading] = useState(false)
  const [locators, setLocators] = useState<LocatorRow[]>([])
  const [products, setProducts] = useState<ProductRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<OnHandRow[]>([])

  const [form] = Form.useForm()

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
      const [locRes, prodRes] = await Promise.all([inventoryApi.listLocators(cid), masterDataApi.listProducts(cid)])
      setLocators(locRes || [])
      setProducts(prodRes || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load lookups'))
      setLocators([])
      setProducts([])
    } finally {
      setLookupLoading(false)
    }
  }

  const locatorOptions = useMemo(
    () => locators.map((l: any) => ({ value: l.id, label: `${l.code || l.id} - ${l.name || ''}` })),
    [locators]
  )

  const productOptions = useMemo(
    () => products.map((p) => ({ value: p.id, label: `${p.code || p.id} - ${p.name || ''}` })),
    [products]
  )

  const productLabelById = useMemo(() => {
    const m = new Map<number, string>()
    for (const p of products) m.set(p.id, `${p.code || p.id} - ${p.name || ''}`)
    return m
  }, [products])

  const columns: ColumnsType<OnHandRow> = [
    {
      title: 'Product',
      dataIndex: 'productId',
      render: (v: number) => productLabelById.get(v) || v
    },
    {
      title: 'On Hand Qty',
      dataIndex: 'onHandQty',
      width: 160,
      render: (v: any) => (v == null ? '-' : String(v))
    }
  ]

  useEffect(() => {
    void loadCompanies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!companyId) return
    void loadLookups(companyId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  const runQuery = async () => {
    if (!companyId) return
    try {
      const values = await form.validateFields()
      const locatorId = values.locatorId
      const productId = values.productId

      setLoading(true)
      if (productId) {
        const res = await inventoryApi.getOnHand(companyId, { locatorId, productId })
        setRows([
          {
            locatorId: res?.locatorId ?? locatorId,
            productId: res?.productId ?? productId,
            onHandQty: res?.onHandQty
          }
        ])
      } else {
        const res = await inventoryApi.getOnHandByLocator(companyId, { locatorId })
        setRows((res || []) as OnHandRow[])
      }
    } catch (e: any) {
      if (e?.errorFields) return
      message.error(getApiErrorMessage(e, 'Failed to load on hand'))
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            On Hand
          </Typography.Title>
          <Space>
            <Button onClick={() => companyId && loadLookups(companyId)} disabled={!companyId} loading={lookupLoading}>
              Refresh Lookups
            </Button>
            <Button type="primary" onClick={() => void runQuery()} disabled={!companyId} loading={loading}>
              Search
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
              options={companies.map((c) => ({ value: c.id, label: `${c.code || c.id} - ${c.name || ''}` }))}
              onChange={(v) => setCompanyId(v)}
            />
          </div>

          <Form form={form} layout="vertical" style={{ flex: 1, minWidth: 520 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Form.Item name="locatorId" label="Locator" rules={[{ required: true }]}>
                <Select showSearch optionFilterProp="label" loading={lookupLoading} options={locatorOptions} />
              </Form.Item>

              <Form.Item name="productId" label="Product (optional)">
                <Select allowClear showSearch optionFilterProp="label" loading={lookupLoading} options={productOptions} />
              </Form.Item>
            </div>
          </Form>
        </Space>
      </Card>

      <Card>
        <Table<OnHandRow> rowKey={(r) => `${r.locatorId}-${r.productId}`} loading={loading} columns={columns} dataSource={rows} pagination={{ pageSize: 20 }} />
      </Card>
    </Space>
  )
}
