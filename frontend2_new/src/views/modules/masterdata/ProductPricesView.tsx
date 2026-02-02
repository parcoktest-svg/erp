import { Button, Card, Input, InputNumber, Select, Space, Table, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { coreApi, masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'

type CompanyRow = {
  id: number
  code?: string
  name?: string
}

type PriceListRow = {
  id: number
  name?: string
  active?: boolean
}

type PriceListVersionRow = {
  id: number
  validFrom?: string
  active?: boolean
}

type ProductRow = {
  id: number
  code?: string
  name?: string
  active?: boolean
}

type ProductPriceRow = {
  id: number
  productId?: number
  priceListVersionId?: number
  price?: number
  active?: boolean
}

type GridRow = {
  productId: number
  productCode?: string
  productName?: string
  productActive?: boolean
  price?: number | null
}

export default function ProductPricesView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [priceListsLoading, setPriceListsLoading] = useState(false)
  const [priceLists, setPriceLists] = useState<PriceListRow[]>([])
  const [priceListId, setPriceListId] = useState<number | null>(null)

  const [versionsLoading, setVersionsLoading] = useState(false)
  const [versions, setVersions] = useState<PriceListVersionRow[]>([])
  const [priceListVersionId, setPriceListVersionId] = useState<number | null>(null)

  const [productsLoading, setProductsLoading] = useState(false)
  const [products, setProducts] = useState<ProductRow[]>([])

  const [pricesLoading, setPricesLoading] = useState(false)
  const [prices, setPrices] = useState<ProductPriceRow[]>([])

  const [q, setQ] = useState('')

  const [draftPrices, setDraftPrices] = useState<Record<number, number | null | undefined>>({})
  const [dirty, setDirty] = useState<Record<number, boolean>>({})
  const [saving, setSaving] = useState(false)

  const loadCompanies = async () => {
    setCompanyLoading(true)
    try {
      const res = await coreApi.listCompanies()
      setCompanies((res || []) as CompanyRow[])
      if (!companyId && Array.isArray(res) && res.length > 0) {
        setCompanyId((res[0] as any).id ?? null)
      }
    } catch (e: any) {
      message.error(e?.message || 'Failed to load companies')
    } finally {
      setCompanyLoading(false)
    }
  }

  const loadPriceLists = async (cid: number) => {
    setPriceListsLoading(true)
    try {
      const res = await masterDataApi.listPriceLists(cid)
      setPriceLists((res || []) as PriceListRow[])
      const firstId = (res as any[])?.[0]?.id
      if (priceListId == null && firstId != null) {
        setPriceListId(Number(firstId))
      }
    } catch (e: any) {
      message.error(e?.message || 'Failed to load price lists')
      setPriceLists([])
    } finally {
      setPriceListsLoading(false)
    }
  }

  const loadVersions = async (plId: number) => {
    setVersionsLoading(true)
    try {
      const res = await masterDataApi.listPriceListVersions(plId)
      setVersions((res || []) as PriceListVersionRow[])
      const firstId = (res as any[])?.[0]?.id
      if (priceListVersionId == null && firstId != null) {
        setPriceListVersionId(Number(firstId))
      }
    } catch (e: any) {
      message.error(e?.message || 'Failed to load versions')
      setVersions([])
    } finally {
      setVersionsLoading(false)
    }
  }

  const loadProducts = async (cid: number) => {
    setProductsLoading(true)
    try {
      const res = await masterDataApi.listProducts(cid)
      setProducts((res || []) as ProductRow[])
    } catch (e: any) {
      message.error(e?.message || 'Failed to load products')
      setProducts([])
    } finally {
      setProductsLoading(false)
    }
  }

  const loadPrices = async (plvId: number) => {
    setPricesLoading(true)
    try {
      const res = await masterDataApi.listProductPrices(plvId)
      setPrices((res || []) as ProductPriceRow[])
    } catch (e: any) {
      message.error(e?.message || 'Failed to load product prices')
      setPrices([])
    } finally {
      setPricesLoading(false)
    }
  }

  useEffect(() => {
    void loadCompanies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!companyId) {
      setPriceLists([])
      setPriceListId(null)
      setVersions([])
      setPriceListVersionId(null)
      setProducts([])
      setPrices([])
      setDraftPrices({})
      setDirty({})
      return
    }
    void loadPriceLists(companyId)
    void loadProducts(companyId)
  }, [companyId])

  useEffect(() => {
    setVersions([])
    setPriceListVersionId(null)
    setPrices([])
    setDraftPrices({})
    setDirty({})
    if (!priceListId) return
    void loadVersions(priceListId)
  }, [priceListId])

  useEffect(() => {
    setPrices([])
    setDraftPrices({})
    setDirty({})
    if (!priceListVersionId) return
    void loadPrices(priceListVersionId)
  }, [priceListVersionId])

  useEffect(() => {
    const map: Record<number, number | null> = {}
    for (const p of prices || []) {
      const pid = (p as any).productId
      if (pid != null) map[Number(pid)] = (p as any).price ?? null
    }
    setDraftPrices(map)
    setDirty({})
  }, [prices])

  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: c.id, label: `${c.code || c.id} - ${c.name || ''}` })),
    [companies]
  )

  const priceListOptions = useMemo(
    () => (priceLists || []).map((p) => ({ value: p.id, label: p.name || String(p.id) })),
    [priceLists]
  )

  const versionOptions = useMemo(
    () =>
      (versions || []).map((v) => ({
        value: v.id,
        label: `#${v.id} (Valid From: ${v.validFrom || '-'})${v.active === false ? ' [INACTIVE]' : ''}`
      })),
    [versions]
  )

  const gridRows: GridRow[] = useMemo(() => {
    const qq = q.trim().toLowerCase()
    const rows = (products || []).map((p) => ({
      productId: Number(p.id),
      productCode: p.code,
      productName: p.name,
      productActive: p.active,
      price: draftPrices?.[Number(p.id)] ?? null
    }))
    if (!qq) return rows
    return rows.filter((r) => `${r.productCode || ''} ${r.productName || ''}`.toLowerCase().includes(qq))
  }, [draftPrices, products, q])

  const columns: ColumnsType<GridRow> = useMemo(
    () => [
      { title: 'Product ID', dataIndex: 'productId', width: 110 },
      { title: 'Code', dataIndex: 'productCode', width: 180 },
      { title: 'Name', dataIndex: 'productName' },
      {
        title: 'Price',
        dataIndex: 'price',
        width: 220,
        render: (_: any, r) => (
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            value={draftPrices?.[r.productId] ?? null}
            onChange={(v) => {
              setDraftPrices((prev) => ({ ...prev, [r.productId]: v == null ? null : Number(v) }))
              setDirty((prev) => ({ ...prev, [r.productId]: true }))
            }}
          />
        )
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 140,
        render: (_: any, r) => (
          <Button
            size="small"
            type="primary"
            disabled={!priceListVersionId || !dirty?.[r.productId] || saving}
            loading={saving && !!dirty?.[r.productId]}
            onClick={async () => {
              if (!priceListVersionId) return
              const v = draftPrices?.[r.productId]
              if (v == null) {
                message.error('Price is required')
                return
              }
              setSaving(true)
              try {
                await masterDataApi.upsertProductPrice(priceListVersionId, { productId: r.productId, price: v })
                message.success('Saved')
                setDirty((prev) => ({ ...prev, [r.productId]: false }))
                await loadPrices(priceListVersionId)
              } catch (e: any) {
                message.error(e?.message || 'Save failed')
              } finally {
                setSaving(false)
              }
            }}
          >
            Save
          </Button>
        )
      }
    ],
    [dirty, draftPrices, priceListVersionId, saving]
  )

  const dirtyCount = useMemo(() => Object.values(dirty || {}).filter(Boolean).length, [dirty])

  const saveAll = async () => {
    if (!priceListVersionId) {
      message.error('Select price list version first')
      return
    }
    const entries = Object.entries(dirty || {}).filter(([, v]) => v)
    if (entries.length === 0) {
      message.info('No changes')
      return
    }

    setSaving(true)
    try {
      for (const [pidStr] of entries) {
        const pid = Number(pidStr)
        const price = draftPrices?.[pid]
        if (price == null) continue
        await masterDataApi.upsertProductPrice(priceListVersionId, { productId: pid, price })
      }
      message.success('Saved')
      setDirty({})
      await loadPrices(priceListVersionId)
    } catch (e: any) {
      message.error(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Product Prices
            </Typography.Title>
            <Typography.Text type="secondary">Input harga product per Price List Version (wajib untuk create Sales Order).</Typography.Text>
          </div>
          <Space>
            <Button onClick={() => void loadCompanies()} loading={companyLoading}>
              Refresh Companies
            </Button>
            <Button onClick={() => companyId && loadPriceLists(companyId)} disabled={!companyId} loading={priceListsLoading}>
              Refresh Price Lists
            </Button>
            <Button onClick={() => priceListId && loadVersions(priceListId)} disabled={!priceListId} loading={versionsLoading}>
              Refresh Versions
            </Button>
            <Button onClick={() => companyId && loadProducts(companyId)} disabled={!companyId} loading={productsLoading}>
              Refresh Products
            </Button>
            <Button onClick={() => priceListVersionId && loadPrices(priceListVersionId)} disabled={!priceListVersionId} loading={pricesLoading}>
              Refresh Prices
            </Button>
            <Button type="primary" onClick={() => void saveAll()} disabled={!priceListVersionId || dirtyCount === 0} loading={saving}>
              Save All ({dirtyCount})
            </Button>
          </Space>
        </Space>
      </Card>

      <Card>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
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

              <div style={{ minWidth: 360 }}>
                <Typography.Text strong>Price List</Typography.Text>
                <Select
                  style={{ width: '100%' }}
                  loading={priceListsLoading}
                  value={priceListId ?? undefined}
                  placeholder="Select price list"
                  options={priceListOptions}
                  onChange={(v) => setPriceListId(Number(v))}
                  showSearch
                  optionFilterProp="label"
                />
              </div>

              <div style={{ minWidth: 360 }}>
                <Typography.Text strong>Price List Version</Typography.Text>
                <Select
                  style={{ width: '100%' }}
                  loading={versionsLoading}
                  value={priceListVersionId ?? undefined}
                  placeholder="Select price list version"
                  options={versionOptions}
                  onChange={(v) => setPriceListVersionId(Number(v))}
                  showSearch
                  optionFilterProp="label"
                />
              </div>

              <div style={{ minWidth: 260 }}>
                <Typography.Text strong>Search</Typography.Text>
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="product code/name" allowClear />
              </div>
            </Space>
          </Space>

          <Table<GridRow>
            rowKey="productId"
            loading={productsLoading || pricesLoading}
            columns={columns}
            dataSource={gridRows}
            pagination={{ pageSize: 10 }}
          />
        </Space>
      </Card>
    </Space>
  )
}
