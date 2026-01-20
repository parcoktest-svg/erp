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
  Typography,
  message
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { coreApi, inventoryApi, manufacturingApi, masterDataApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import { getApiErrorMessage } from '@/utils/error'

type CompanyRow = { id: number; code?: string; name?: string }

type OrgRow = { id: number; code?: string; name?: string }

type LocatorRow = { id: number; code?: string; name?: string }

type BomRow = { id: number; productId?: number; version?: number; active?: boolean }

type ProductRow = { id: number; code?: string; name?: string }

type WorkOrderRow = {
  id: number
  documentNo?: string
  status?: string
  workDate?: string
  bomId?: number
  productId?: number
  qty?: any
  fromLocatorId?: number
  toLocatorId?: number
  orgId?: number | null
  description?: string
  issueMovementDocNo?: string
  receiptMovementDocNo?: string
  issueReversalMovementDocNo?: string
  receiptReversalMovementDocNo?: string
}

function toLocalDateString(d: any): string {
  if (!d) return ''
  return dayjs(d).format('YYYY-MM-DD')
}

export default function WorkOrdersView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [lookupLoading, setLookupLoading] = useState(false)
  const [orgs, setOrgs] = useState<OrgRow[]>([])
  const [locators, setLocators] = useState<LocatorRow[]>([])
  const [boms, setBoms] = useState<BomRow[]>([])
  const [products, setProducts] = useState<ProductRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<WorkOrderRow[]>([])

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<WorkOrderRow | null>(null)
  const [form] = Form.useForm()

  const [completeOpen, setCompleteOpen] = useState(false)
  const [completeId, setCompleteId] = useState<number | null>(null)
  const [completeForm] = Form.useForm()

  const [voidOpen, setVoidOpen] = useState(false)
  const [voidId, setVoidId] = useState<number | null>(null)
  const [voidForm] = Form.useForm()

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
      const [orgRes, locRes, bomRes, prodRes] = await Promise.all([
        coreApi.listOrgs(cid),
        inventoryApi.listLocators(cid),
        manufacturingApi.listBoms(cid),
        masterDataApi.listProducts(cid)
      ])
      setOrgs(orgRes || [])
      setLocators(locRes || [])
      setBoms(bomRes || [])
      setProducts(prodRes || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load lookups'))
      setOrgs([])
      setLocators([])
      setBoms([])
      setProducts([])
    } finally {
      setLookupLoading(false)
    }
  }

  const load = async (cid: number) => {
    setLoading(true)
    try {
      const res = await manufacturingApi.listWorkOrders(cid)
      setRows(res || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load work orders'))
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

  const locatorOptions = useMemo(
    () => locators.map((l) => ({ value: l.id, label: `${l.code || l.id} - ${l.name || ''}` })),
    [locators]
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

  const columns: ColumnsType<WorkOrderRow> = [
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
    { title: 'Work Date', dataIndex: 'workDate', width: 130 },
    {
      title: 'BOM',
      dataIndex: 'bomId',
      width: 240,
      render: (v: any) => {
        const bom = boms.find((b) => b.id === Number(v))
        if (!bom) return v
        return `BOM ${bom.id} - ${productLabelById.get(Number(bom.productId)) || bom.productId}`
      }
    },
    { title: 'Qty', dataIndex: 'qty', width: 120 },
    {
      title: 'From',
      dataIndex: 'fromLocatorId',
      width: 200,
      render: (v: any) => {
        const loc = locators.find((l) => l.id === Number(v))
        return loc ? `${loc.code || loc.id} - ${loc.name || ''}` : v
      }
    },
    {
      title: 'To',
      dataIndex: 'toLocatorId',
      width: 200,
      render: (v: any) => {
        const loc = locators.find((l) => l.id === Number(v))
        return loc ? `${loc.code || loc.id} - ${loc.name || ''}` : v
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 520,
      render: (_, r) => {
        const status = String(r.status || '')
        const canEdit = status === 'DRAFTED'
        const canDelete = status === 'DRAFTED'
        const canComplete = status === 'DRAFTED'
        const canVoid = status === 'DRAFTED'

        return (
          <Space wrap>
            <Button
              size="small"
              disabled={!canEdit}
              onClick={async () => {
                if (!companyId) return
                try {
                  const full = await manufacturingApi.getWorkOrder(companyId, r.id)
                  setEditing(full)
                  form.resetFields()
                  form.setFieldsValue({
                    orgId: full?.orgId ?? null,
                    bomId: full?.bomId,
                    workDate: full?.workDate ? dayjs(full.workDate) : dayjs(),
                    qty: full?.qty,
                    fromLocatorId: full?.fromLocatorId,
                    toLocatorId: full?.toLocatorId,
                    description: full?.description || ''
                  })
                  setOpen(true)
                } catch (e: any) {
                  message.error(getApiErrorMessage(e, 'Failed to load work order'))
                }
              }}
            >
              Edit
            </Button>

            <Popconfirm
              title="Delete work order?"
              okText="Delete"
              okButtonProps={{ danger: true }}
              disabled={!canDelete}
              onConfirm={async () => {
                if (!companyId) return
                try {
                  await manufacturingApi.deleteWorkOrder(companyId, r.id)
                  message.success('Deleted')
                  await load(companyId)
                } catch (e: any) {
                  message.error(getApiErrorMessage(e, 'Failed to delete work order'))
                }
              }}
            >
              <Button size="small" danger disabled={!canDelete}>
                Delete
              </Button>
            </Popconfirm>

            <Button
              size="small"
              type="primary"
              disabled={!canComplete}
              onClick={() => {
                setCompleteId(r.id)
                completeForm.resetFields()
                completeForm.setFieldsValue({ completionDate: dayjs() })
                setCompleteOpen(true)
              }}
            >
              Complete
            </Button>

            <Button
              size="small"
              disabled={!canVoid}
              onClick={() => {
                setVoidId(r.id)
                voidForm.resetFields()
                voidForm.setFieldsValue({ voidDate: dayjs(), reason: '' })
                setVoidOpen(true)
              }}
            >
              Void
            </Button>

            <Button
              size="small"
              onClick={() => {
                Modal.info({
                  title: `Movements - ${r.documentNo || r.id}`,
                  width: 820,
                  content: (
                    <Space direction="vertical">
                      <div>Issue Movement: {r.issueMovementDocNo || '-'}</div>
                      <div>Receipt Movement: {r.receiptMovementDocNo || '-'}</div>
                      <div>Issue Reversal: {r.issueReversalMovementDocNo || '-'}</div>
                      <div>Receipt Reversal: {r.receiptReversalMovementDocNo || '-'}</div>
                    </Space>
                  )
                })
              }}
            >
              Movements
            </Button>
          </Space>
        )
      }
    }
  ]

  const resetNew = () => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({
      orgId: null,
      bomId: boms[0]?.id ?? null,
      workDate: dayjs(),
      qty: 1,
      fromLocatorId: locators[0]?.id ?? null,
      toLocatorId: locators[0]?.id ?? null,
      description: ''
    })
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Work Orders
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
              New Work Order
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
        <Table<WorkOrderRow> rowKey="id" loading={loading} columns={columns} dataSource={rows} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        open={open}
        title={editing ? `Edit Work Order - ${editing.documentNo || editing.id}` : 'Create Work Order'}
        width={980}
        onCancel={() => setOpen(false)}
        okText={editing ? 'Update' : 'Create'}
        onOk={async () => {
          if (!companyId) return
          try {
            const values = await form.validateFields()
            const payload: any = {
              orgId: values.orgId ?? null,
              bomId: values.bomId,
              workDate: toLocalDateString(values.workDate),
              qty: values.qty,
              fromLocatorId: values.fromLocatorId,
              toLocatorId: values.toLocatorId,
              description: values.description || null
            }
            if (!payload.orgId) delete payload.orgId

            if (editing) {
              await manufacturingApi.updateWorkOrder(companyId, editing.id, payload)
              message.success('Updated')
            } else {
              await manufacturingApi.createWorkOrder(companyId, payload)
              message.success('Created')
            }
            setOpen(false)
            await load(companyId)
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(getApiErrorMessage(e, editing ? 'Failed to update work order' : 'Failed to create work order'))
          }
        }}
      >
        <Form form={form} layout="vertical" initialValues={{ orgId: null }}>
          <Space wrap style={{ width: '100%' }}>
            <Form.Item name="orgId" label="Org (optional)" style={{ width: 260 }}>
              <Select allowClear showSearch optionFilterProp="label" loading={lookupLoading} options={orgOptions} />
            </Form.Item>

            <Form.Item name="bomId" label="BOM" rules={[{ required: true }]} style={{ width: 520 }}>
              <Select showSearch optionFilterProp="label" loading={lookupLoading} options={bomOptions} />
            </Form.Item>

            <Form.Item name="workDate" label="Work Date" rules={[{ required: true }]} style={{ width: 200 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <Space wrap style={{ width: '100%' }}>
            <Form.Item name="qty" label="Qty" rules={[{ required: true }]} style={{ width: 220 }}>
              <InputNumber style={{ width: '100%' }} min={0.0001} />
            </Form.Item>

            <Form.Item name="fromLocatorId" label="From Locator" rules={[{ required: true }]} style={{ width: 360 }}>
              <Select showSearch optionFilterProp="label" loading={lookupLoading} options={locatorOptions} />
            </Form.Item>

            <Form.Item name="toLocatorId" label="To Locator" rules={[{ required: true }]} style={{ width: 360 }}>
              <Select showSearch optionFilterProp="label" loading={lookupLoading} options={locatorOptions} />
            </Form.Item>
          </Space>

          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={completeOpen}
        title="Complete Work Order"
        onCancel={() => setCompleteOpen(false)}
        okText="Complete"
        onOk={async () => {
          if (!companyId || !completeId) return
          try {
            const values = await completeForm.validateFields()
            await manufacturingApi.completeWorkOrder(companyId, completeId, { completionDate: toLocalDateString(values.completionDate) })
            message.success('Completed')
            setCompleteOpen(false)
            await load(companyId)
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(getApiErrorMessage(e, 'Failed to complete work order'))
          }
        }}
      >
        <Form form={completeForm} layout="vertical" initialValues={{ completionDate: dayjs() }}>
          <Form.Item name="completionDate" label="Completion Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={voidOpen}
        title="Void Work Order"
        onCancel={() => setVoidOpen(false)}
        okText="Void"
        okButtonProps={{ danger: true }}
        onOk={async () => {
          if (!companyId || !voidId) return
          try {
            const values = await voidForm.validateFields()
            await manufacturingApi.voidWorkOrder(companyId, voidId, { voidDate: toLocalDateString(values.voidDate), reason: values.reason || null })
            message.success('Voided')
            setVoidOpen(false)
            await load(companyId)
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(getApiErrorMessage(e, 'Failed to void work order'))
          }
        }}
      >
        <Form form={voidForm} layout="vertical" initialValues={{ voidDate: dayjs(), reason: '' }}>
          <Form.Item name="voidDate" label="Void Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="reason" label="Reason">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}
