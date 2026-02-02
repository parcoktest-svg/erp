import { Button, Card, DatePicker, Form, Modal, Select, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
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

export default function PriceListVersionsView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [priceListsLoading, setPriceListsLoading] = useState(false)
  const [priceLists, setPriceLists] = useState<PriceListRow[]>([])
  const [priceListId, setPriceListId] = useState<number | null>(null)

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<PriceListVersionRow[]>([])

  const [createOpen, setCreateOpen] = useState(false)
  const [createSaving, setCreateSaving] = useState(false)
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

  const load = async (plId: number) => {
    setLoading(true)
    try {
      const res = await masterDataApi.listPriceListVersions(plId)
      setRows((res || []) as PriceListVersionRow[])
    } catch (e: any) {
      message.error(e?.message || 'Failed to load price list versions')
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
      setPriceLists([])
      setPriceListId(null)
      setRows([])
      return
    }
    void loadPriceLists(companyId)
  }, [companyId])

  useEffect(() => {
    if (!priceListId) {
      setRows([])
      return
    }
    void load(priceListId)
  }, [priceListId])

  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: c.id, label: `${c.code || c.id} - ${c.name || ''}` })),
    [companies]
  )

  const priceListOptions = useMemo(
    () => (priceLists || []).map((p) => ({ value: p.id, label: p.name || String(p.id) })),
    [priceLists]
  )

  const columns: ColumnsType<PriceListVersionRow> = useMemo(
    () => [
      { title: 'ID', dataIndex: 'id', width: 90 },
      { title: 'Valid From', dataIndex: 'validFrom', width: 160 },
      {
        title: 'Active',
        dataIndex: 'active',
        width: 110,
        render: (v: boolean) => (v ? <Tag color="green">YES</Tag> : <Tag color="red">NO</Tag>)
      }
    ],
    []
  )

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Price List Versions
            </Typography.Title>
            <Typography.Text type="secondary">Buat version untuk price list supaya bisa dipakai di Sales Order.</Typography.Text>
          </div>
          <Space>
            <Button onClick={() => void loadCompanies()} loading={companyLoading}>
              Refresh Companies
            </Button>
            <Button onClick={() => companyId && loadPriceLists(companyId)} disabled={!companyId} loading={priceListsLoading}>
              Refresh Price Lists
            </Button>
            <Button onClick={() => priceListId && load(priceListId)} disabled={!priceListId} loading={loading}>
              Refresh
            </Button>
            <Button
              type="primary"
              onClick={() => {
                if (!priceListId) {
                  message.error('Select a price list first')
                  return
                }
                form.resetFields()
                form.setFieldsValue({ validFrom: dayjs() })
                setCreateOpen(true)
              }}
              disabled={!priceListId}
            >
              New Version
            </Button>
          </Space>
        </Space>
      </Card>

      <Card>
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
          </Space>
        </Space>

        <div style={{ marginTop: 12 }}>
          <Table<PriceListVersionRow> rowKey="id" loading={loading} columns={columns} dataSource={rows} pagination={{ pageSize: 10 }} />
        </div>
      </Card>

      <Modal
        title="Create Price List Version"
        open={createOpen}
        onCancel={() => {
          setCreateOpen(false)
          form.resetFields()
        }}
        onOk={async () => {
          if (!priceListId) return
          setCreateSaving(true)
          try {
            const values = await form.validateFields()
            await masterDataApi.createPriceListVersion(priceListId, { validFrom: dayjs(values.validFrom).format('YYYY-MM-DD') })
            message.success('Created')
            setCreateOpen(false)
            form.resetFields()
            await load(priceListId)
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(e?.message || 'Save failed')
          } finally {
            setCreateSaving(false)
          }
        }}
        okText="Create"
        okButtonProps={{ loading: createSaving }}
        width={520}
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="validFrom" label="Valid From" rules={[{ required: true, message: 'Valid From is required' }]}>
            <DatePicker style={{ width: '100%' }} placeholder="DD-MM-YYYY" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}
