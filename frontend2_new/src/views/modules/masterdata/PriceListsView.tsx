import { Button, Card, DatePicker, Form, Input, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography, message } from 'antd'
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

type CurrencyRow = {
  id: number
  code?: string
  name?: string
}

type PriceListRow = {
  id: number
  name?: string
  currencyId?: number
  salesPriceList?: boolean
  active?: boolean
}

type PriceListVersionRow = {
  id: number
  validFrom?: string
  active?: boolean
}

export default function PriceListsView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [currenciesLoading, setCurrenciesLoading] = useState(false)
  const [currencies, setCurrencies] = useState<CurrencyRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<PriceListRow[]>([])

  const [q, setQ] = useState('')

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<PriceListRow | null>(null)
  const [form] = Form.useForm()

  const [versionsOpen, setVersionsOpen] = useState(false)
  const [versionsLoading, setVersionsLoading] = useState(false)
  const [versions, setVersions] = useState<PriceListVersionRow[]>([])
  const [versionsPriceList, setVersionsPriceList] = useState<PriceListRow | null>(null)

  const [versionCreateOpen, setVersionCreateOpen] = useState(false)
  const [versionCreateSaving, setVersionCreateSaving] = useState(false)
  const [versionForm] = Form.useForm()

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

  const loadCurrencies = async (cid: number) => {
    setCurrenciesLoading(true)
    try {
      const res = await masterDataApi.listCurrencies(cid)
      setCurrencies((res || []) as CurrencyRow[])
    } catch (e: any) {
      message.error(e?.message || 'Failed to load currencies')
      setCurrencies([])
    } finally {
      setCurrenciesLoading(false)
    }
  }

  const load = async (cid: number) => {
    setLoading(true)
    try {
      const res = await masterDataApi.listPriceLists(cid)
      setRows((res || []) as PriceListRow[])
    } catch (e: any) {
      message.error(e?.message || 'Failed to load price lists')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  const loadVersions = async (priceListId: number) => {
    setVersionsLoading(true)
    try {
      const res = await masterDataApi.listPriceListVersions(priceListId)
      setVersions((res || []) as PriceListVersionRow[])
    } catch (e: any) {
      message.error(e?.message || 'Failed to load price list versions')
      setVersions([])
    } finally {
      setVersionsLoading(false)
    }
  }

  useEffect(() => {
    void loadCompanies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!companyId) return
    void load(companyId)
    void loadCurrencies(companyId)
  }, [companyId])

  const currencyOptions = useMemo(
    () => (currencies || []).map((c: any) => ({ value: c.id, label: `${c.code || c.id} - ${c.name || ''}`.trim() })),
    [currencies]
  )

  const currencyLabelById = useMemo(() => {
    const m = new Map<number, string>()
    for (const c of currencies || []) {
      const id = Number((c as any)?.id)
      if (!id) continue
      m.set(id, `${(c as any)?.code || id} - ${(c as any)?.name || ''}`.trim())
    }
    return m
  }, [currencies])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    if (!qq) return rows
    return rows.filter((r) => `${r.name || ''}`.toLowerCase().includes(qq))
  }, [q, rows])

  const columns: ColumnsType<PriceListRow> = useMemo(
    () => [
      { title: 'ID', dataIndex: 'id', width: 90 },
      { title: 'Name', dataIndex: 'name' },
      {
        title: 'Currency',
        dataIndex: 'currencyId',
        width: 220,
        render: (v: any) => {
          const id = Number(v)
          return currencyLabelById.get(id) || (v == null ? '-' : String(v))
        }
      },
      {
        title: 'Sales',
        dataIndex: 'salesPriceList',
        width: 110,
        render: (v: boolean) => (v ? <Tag color="blue">YES</Tag> : <Tag>NO</Tag>)
      },
      {
        title: 'Active',
        dataIndex: 'active',
        width: 110,
        render: (v: boolean) => (v ? <Tag color="green">YES</Tag> : <Tag color="red">NO</Tag>)
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 260,
        render: (_: any, r) => (
          <Space>
            <Button
              size="small"
              onClick={() => {
                setEditing(r)
                setOpen(true)
                form.setFieldsValue({ name: r.name, currencyId: r.currencyId, salesPriceList: r.salesPriceList ?? true, active: r.active ?? true })
              }}
            >
              Edit
            </Button>
            <Button
              size="small"
              onClick={async () => {
                setVersionsPriceList(r)
                setVersionsOpen(true)
                await loadVersions(Number(r.id))
              }}
            >
              Versions
            </Button>
            <Popconfirm
              title="Delete price list?"
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={async () => {
                if (!companyId) return
                try {
                  await masterDataApi.deletePriceList(companyId, r.id)
                  message.success('Deleted')
                  await load(companyId)
                } catch (e: any) {
                  message.error(e?.message || 'Failed to delete')
                }
              }}
            >
              <Button size="small" danger>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        )
      }
    ],
    [companyId, currencyLabelById, form]
  )

  const versionColumns: ColumnsType<PriceListVersionRow> = useMemo(
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
              Price Lists
            </Typography.Title>
            <Typography.Text type="secondary">Buat price list dan versinya agar bisa dipilih di Sales Order.</Typography.Text>
          </div>
          <Space>
            <Button onClick={() => loadCompanies()} loading={companyLoading}>
              Refresh Companies
            </Button>
            <Button onClick={() => companyId && loadCurrencies(companyId)} disabled={!companyId} loading={currenciesLoading}>
              Refresh Currencies
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
                form.setFieldsValue({ salesPriceList: true, active: true })
              }}
              disabled={!companyId}
            >
              New
            </Button>
          </Space>
        </Space>
      </Card>

      <Card>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Space wrap>
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

            <div style={{ minWidth: 260 }}>
              <Typography.Text strong>Search</Typography.Text>
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="name" allowClear />
            </div>
          </Space>

          <Table<PriceListRow> rowKey="id" loading={loading} columns={columns} dataSource={filtered} pagination={{ pageSize: 10 }} />
        </Space>
      </Card>

      <Modal
        title={editing ? 'Edit Price List' : 'Create Price List'}
        open={open}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
          form.resetFields()
        }}
        onOk={async () => {
          if (!companyId) return
          try {
            const values = await form.validateFields()
            if (editing) {
              await masterDataApi.updatePriceList(companyId, editing.id, values)
              message.success('Updated')
            } else {
              await masterDataApi.createPriceList(companyId, values)
              message.success('Created')
            }
            setOpen(false)
            setEditing(null)
            form.resetFields()
            await load(companyId)
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(e?.message || 'Save failed')
          }
        }}
        okText={editing ? 'Save' : 'Create'}
        width={720}
        destroyOnClose
      >
        <Form layout="vertical" form={form} initialValues={{ salesPriceList: true, active: true }}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="currencyId" label="Currency" rules={[{ required: true, message: 'Currency is required' }]}>
            <Select showSearch optionFilterProp="label" options={currencyOptions} placeholder="Select currency" />
          </Form.Item>
          <Form.Item name="salesPriceList" label="Sales Price List" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={versionsPriceList ? `Price List Versions - ${versionsPriceList.name || versionsPriceList.id}` : 'Price List Versions'}
        open={versionsOpen}
        onCancel={() => {
          setVersionsOpen(false)
          setVersionsPriceList(null)
          setVersions([])
        }}
        footer={
          <Space>
            <Button
              type="primary"
              onClick={() => {
                if (!versionsPriceList?.id) return
                versionForm.resetFields()
                versionForm.setFieldsValue({ validFrom: dayjs() })
                setVersionCreateOpen(true)
              }}
              disabled={!versionsPriceList?.id}
            >
              New Version
            </Button>
            <Button
              onClick={async () => {
                if (!versionsPriceList?.id) return
                await loadVersions(Number(versionsPriceList.id))
              }}
              loading={versionsLoading}
              disabled={!versionsPriceList?.id}
            >
              Refresh
            </Button>
            <Button onClick={() => setVersionsOpen(false)}>Close</Button>
          </Space>
        }
        width={700}
        destroyOnClose
      >
        <Table<PriceListVersionRow> rowKey="id" loading={versionsLoading} columns={versionColumns} dataSource={versions} pagination={{ pageSize: 10 }} />
      </Modal>

      <Modal
        title="Create Price List Version"
        open={versionCreateOpen}
        onCancel={() => {
          setVersionCreateOpen(false)
          versionForm.resetFields()
        }}
        onOk={async () => {
          if (!versionsPriceList?.id) return
          setVersionCreateSaving(true)
          try {
            const values = await versionForm.validateFields()
            await masterDataApi.createPriceListVersion(Number(versionsPriceList.id), {
              validFrom: dayjs(values.validFrom).format('YYYY-MM-DD')
            })
            message.success('Created')
            setVersionCreateOpen(false)
            versionForm.resetFields()
            await loadVersions(Number(versionsPriceList.id))
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(e?.message || 'Save failed')
          } finally {
            setVersionCreateSaving(false)
          }
        }}
        okText="Create"
        okButtonProps={{ loading: versionCreateSaving }}
        width={520}
        destroyOnClose
      >
        <Form layout="vertical" form={versionForm}>
          <Form.Item name="validFrom" label="Valid From" rules={[{ required: true, message: 'Valid From is required' }]}>
            <DatePicker style={{ width: '100%' }} placeholder="DD-MM-YYYY" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}
