import { Button, Card, Form, InputNumber, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { coreApi, manufacturingApi, masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import { getApiErrorMessage } from '@/utils/error'

type CompanyRow = { id: number; code?: string; name?: string }

type OrgRow = { id: number; code?: string; name?: string }

type ProductRow = { id: number; code?: string; name?: string }

type BomLineRow = { id?: number; componentProductId?: number; qty?: any }

type BomRow = {
  id: number
  orgId?: number | null
  productId?: number
  version?: number
  active?: boolean
  lines?: BomLineRow[]
}

export default function BomsView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [lookupLoading, setLookupLoading] = useState(false)
  const [orgs, setOrgs] = useState<OrgRow[]>([])
  const [products, setProducts] = useState<ProductRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<BomRow[]>([])

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<BomRow | null>(null)
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
      const [orgRes, prodRes] = await Promise.all([coreApi.listOrgs(cid), masterDataApi.listProducts(cid)])
      setOrgs(orgRes || [])
      setProducts(prodRes || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load lookups'))
      setOrgs([])
      setProducts([])
    } finally {
      setLookupLoading(false)
    }
  }

  const load = async (cid: number) => {
    setLoading(true)
    try {
      const res = await manufacturingApi.listBoms(cid)
      setRows(res || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load BOMs'))
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
    if (!companyId) return
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
    () => products.map((p) => ({ value: p.id, label: `${p.code || p.id} - ${p.name || ''}` })),
    [products]
  )

  const productLabelById = useMemo(() => {
    const m = new Map<number, string>()
    for (const p of products) m.set(p.id, `${p.code || p.id} - ${p.name || ''}`)
    return m
  }, [products])

  const columns: ColumnsType<BomRow> = [
    { title: 'ID', dataIndex: 'id', width: 90 },
    {
      title: 'Product',
      dataIndex: 'productId',
      render: (v: any) => productLabelById.get(Number(v)) || v
    },
    { title: 'Version', dataIndex: 'version', width: 110 },
    {
      title: 'Active',
      dataIndex: 'active',
      width: 110,
      render: (v: any) => (v ? <Tag color="green">YES</Tag> : <Tag color="red">NO</Tag>)
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 260,
      render: (_, r) => (
        <Space>
          <Button
            size="small"
            onClick={async () => {
              if (!companyId) return
              try {
                const full = await manufacturingApi.getBom(companyId, r.id)
                setEditing(full)
                form.resetFields()
                form.setFieldsValue({
                  orgId: full?.orgId ?? null,
                  productId: full?.productId,
                  version: full?.version,
                  active: Boolean(full?.active),
                  lines: (full?.lines || []).map((ln: any) => ({ componentProductId: ln.componentProductId, qty: ln.qty }))
                })
                if (!(full?.lines || []).length) {
                  form.setFieldsValue({ lines: [{ componentProductId: products[0]?.id ?? null, qty: 1 }] })
                }
                setOpen(true)
              } catch (e: any) {
                message.error(getApiErrorMessage(e, 'Failed to load BOM'))
              }
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete BOM?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={async () => {
              if (!companyId) return
              try {
                await manufacturingApi.deleteBom(companyId, r.id)
                message.success('Deleted')
                await load(companyId)
              } catch (e: any) {
                message.error(getApiErrorMessage(e, 'Failed to delete BOM'))
              }
            }}
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
          <Button
            size="small"
            onClick={() => {
              Modal.info({
                title: `Lines - BOM ${r.id}`,
                width: 860,
                content: (
                  <Table
                    size="small"
                    rowKey={(x: any, idx) => String(x?.id || idx)}
                    pagination={false}
                    columns={[
                      {
                        title: 'Component',
                        dataIndex: 'componentProductId',
                        render: (v: any) => productLabelById.get(Number(v)) || v
                      },
                      { title: 'Qty', dataIndex: 'qty', width: 160 }
                    ]}
                    dataSource={r.lines || []}
                  />
                )
              })
            }}
          >
            Lines
          </Button>
        </Space>
      )
    }
  ]

  const resetNew = () => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({
      orgId: null,
      productId: products[0]?.id ?? null,
      version: 1,
      active: true,
      lines: [{ componentProductId: products[0]?.id ?? null, qty: 1 }]
    })
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            BOMs
          </Typography.Title>
          <Space>
            <Button onClick={() => companyId && loadLookups(companyId)} disabled={!companyId} loading={lookupLoading}>
              Refresh Lookups
            </Button>
            <Button onClick={() => companyId && load(companyId)} disabled={!companyId} loading={loading}>
              Refresh
            </Button>
            <Button
              type="primary"
              disabled={!companyId}
              onClick={() => {
                resetNew()
                setOpen(true)
              }}
            >
              New BOM
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
        </Space>
      </Card>

      <Card>
        <Table<BomRow> rowKey="id" loading={loading} columns={columns} dataSource={rows} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        open={open}
        title={editing ? `Edit BOM - ${editing.id}` : 'Create BOM'}
        width={980}
        onCancel={() => setOpen(false)}
        okText={editing ? 'Update' : 'Create'}
        onOk={async () => {
          if (!companyId) return
          try {
            const values = await form.validateFields()
            const payload: any = {
              orgId: values.orgId ?? null,
              productId: values.productId,
              version: values.version,
              active: Boolean(values.active),
              lines: (values.lines || []).map((l: any) => ({ componentProductId: l.componentProductId, qty: l.qty }))
            }
            if (!payload.orgId) delete payload.orgId

            if (editing) {
              await manufacturingApi.updateBom(companyId, editing.id, payload)
              message.success('Updated')
            } else {
              await manufacturingApi.createBom(companyId, payload)
              message.success('Created')
            }
            setOpen(false)
            await load(companyId)
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(getApiErrorMessage(e, editing ? 'Failed to update BOM' : 'Failed to create BOM'))
          }
        }}
      >
        <Form form={form} layout="vertical" initialValues={{ orgId: null, active: true, version: 1 }}>
          <Space wrap style={{ width: '100%' }}>
            <Form.Item name="orgId" label="Org (optional)" style={{ width: 260 }}>
              <Select allowClear showSearch optionFilterProp="label" loading={lookupLoading} options={orgOptions} />
            </Form.Item>

            <Form.Item name="productId" label="Finished Product" rules={[{ required: true }]} style={{ width: 380 }}>
              <Select showSearch optionFilterProp="label" loading={lookupLoading} options={productOptions} />
            </Form.Item>

            <Form.Item name="version" label="Version" rules={[{ required: true }]} style={{ width: 160 }}>
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>

            <Form.Item name="active" label="Active" valuePropName="checked" style={{ width: 120 }}>
              <Switch />
            </Form.Item>
          </Space>

          <Typography.Title level={5}>Lines</Typography.Title>
          <Form.List name="lines">
            {(fields, { add, remove }) => (
              <Space direction="vertical" style={{ width: '100%' }} size={8}>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline" wrap style={{ width: '100%' }}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'componentProductId']}
                      label="Component Product"
                      rules={[{ required: true }]}
                      style={{ width: 520 }}
                    >
                      <Select showSearch optionFilterProp="label" loading={lookupLoading} options={productOptions} />
                    </Form.Item>

                    <Form.Item {...field} name={[field.name, 'qty']} label="Qty" rules={[{ required: true }]} style={{ width: 180 }}>
                      <InputNumber style={{ width: '100%' }} min={0.0001} />
                    </Form.Item>

                    <Button danger onClick={() => remove(field.name)} disabled={fields.length <= 1}>
                      Remove
                    </Button>
                  </Space>
                ))}

                <Button onClick={() => add({ componentProductId: products[0]?.id ?? null, qty: 1 })}>Add Line</Button>
              </Space>
            )}
          </Form.List>
        </Form>
      </Modal>
    </Space>
  )
}
