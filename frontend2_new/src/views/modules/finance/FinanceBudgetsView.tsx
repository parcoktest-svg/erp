import { Button, Card, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { coreApi, financeApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import { getApiErrorMessage } from '@/utils/error'

type CompanyRow = { id: number; code?: string; name?: string }

type FiscalYearRow = { id: number; year?: number; status?: string }

type PeriodRow = { id: number; periodNo?: number; startDate?: string; endDate?: string }

type GlRow = { id: number; code?: string; name?: string }

type BudgetRow = { id: number; fiscalYearId?: number; name?: string; description?: string; status?: string; lines?: any[] }

export default function FinanceBudgetsView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [lookupLoading, setLookupLoading] = useState(false)
  const [fiscalYears, setFiscalYears] = useState<FiscalYearRow[]>([])
  const [periods, setPeriods] = useState<PeriodRow[]>([])
  const [glAccounts, setGlAccounts] = useState<GlRow[]>([])

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<BudgetRow[]>([])

  const [createOpen, setCreateOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [createForm] = Form.useForm()

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
      const [fyRes, glRes] = await Promise.all([financeApi.listFiscalYears(cid), financeApi.listGlAccounts(cid)])
      setFiscalYears(fyRes || [])
      setGlAccounts(glRes || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load lookups'))
      setFiscalYears([])
      setGlAccounts([])
    } finally {
      setLookupLoading(false)
    }
  }

  const loadPeriods = async (cid: number, fiscalYearId: number) => {
    try {
      const res = await financeApi.listPeriods(cid, fiscalYearId)
      setPeriods(res || [])
    } catch {
      setPeriods([])
    }
  }

  const load = async (cid: number) => {
    setLoading(true)
    try {
      const res = await financeApi.listBudgets(cid)
      setRows(res || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load budgets'))
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

  const fyOptions = useMemo(
    () => fiscalYears.map((y) => ({ value: y.id, label: `${y.year ?? y.id} (${y.status || ''})` })),
    [fiscalYears]
  )

  const periodOptions = useMemo(
    () => periods.map((p) => ({ value: p.id, label: `P${p.periodNo ?? ''} ${p.startDate || ''}..${p.endDate || ''}` })),
    [periods]
  )

  const glOptions = useMemo(
    () => glAccounts.map((g) => ({ value: g.id, label: `${g.code || g.id} - ${g.name || ''}` })),
    [glAccounts]
  )

  const columns: ColumnsType<BudgetRow> = [
    { title: 'Name', dataIndex: 'name', width: 240 },
    { title: 'Status', dataIndex: 'status', width: 120, render: (v: any) => <Tag>{String(v || '')}</Tag> },
    { title: 'Fiscal Year', dataIndex: 'fiscalYearId', width: 140 },
    { title: 'Description', dataIndex: 'description' },
    {
      title: 'Actions',
      key: 'actions',
      width: 360,
      render: (_, r) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              Modal.info({
                title: `Budget Lines - ${r.name || r.id}`,
                width: 900,
                content: (
                  <Table
                    size="small"
                    rowKey={(x: any, idx) => String(x?.id || idx)}
                    pagination={{ pageSize: 10 }}
                    columns={[
                      { title: 'GL', dataIndex: 'glAccountId', width: 120 },
                      { title: 'Period', dataIndex: 'accountingPeriodId', width: 140 },
                      { title: 'Budget', dataIndex: 'budgetAmount', width: 160 },
                      { title: 'Notes', dataIndex: 'notes' }
                    ]}
                    dataSource={r.lines || []}
                  />
                )
              })
            }}
          >
            Lines
          </Button>
          <Button
            size="small"
            onClick={async () => {
              if (!companyId) return
              try {
                const res = await financeApi.budgetVsActual(companyId, r.id)
                Modal.info({
                  title: `Budget vs Actual - ${r.name || r.id}`,
                  width: 980,
                  content: (
                    <Table
                      size="small"
                      rowKey={(_, idx) => String(idx)}
                      pagination={{ pageSize: 10 }}
                      columns={[
                        { title: 'GL', dataIndex: 'glAccountId', width: 120 },
                        { title: 'Period', dataIndex: 'accountingPeriodId', width: 120 },
                        { title: 'Budget', dataIndex: 'budgetAmount', width: 140 },
                        { title: 'Actual', dataIndex: 'actualAmount', width: 140 },
                        { title: 'Variance', dataIndex: 'variance', width: 140 }
                      ]}
                      dataSource={res || []}
                    />
                  )
                })
              } catch (e: any) {
                message.error(getApiErrorMessage(e, 'Failed to load budget vs actual'))
              }
            }}
          >
            Vs Actual
          </Button>
          <Popconfirm
            title="Complete budget?"
            okText="Complete"
            onConfirm={async () => {
              if (!companyId) return
              try {
                await financeApi.completeBudget(companyId, r.id)
                message.success('Completed')
                await load(companyId)
              } catch (e: any) {
                message.error(getApiErrorMessage(e, 'Failed to complete budget'))
              }
            }}
          >
            <Button size="small" type="primary">
              Complete
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Void budget?"
            okText="Void"
            okButtonProps={{ danger: true }}
            onConfirm={async () => {
              if (!companyId) return
              try {
                await financeApi.voidBudget(companyId, r.id)
                message.success('Voided')
                await load(companyId)
              } catch (e: any) {
                message.error(getApiErrorMessage(e, 'Failed to void budget'))
              }
            }}
          >
            <Button size="small" danger>
              Void
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Budgets
            </Typography.Title>
            <Typography.Text type="secondary">Create and manage budgets, and view budget vs actual.</Typography.Text>
          </div>
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
                createForm.resetFields()
                createForm.setFieldsValue({
                  fiscalYearId: fiscalYears[0]?.id ?? null,
                  orgId: null,
                  name: '',
                  description: '',
                  lines: [{ glAccountId: glAccounts[0]?.id ?? null, accountingPeriodId: periods[0]?.id ?? null, budgetAmount: 0, notes: '' }]
                })
                setCreateOpen(true)
              }}
            >
              New Budget
            </Button>
          </Space>
        </Space>
      </Card>

      <Card>
        <Space wrap>
          <div style={{ minWidth: 320 }}>
            <Typography.Text strong>Company</Typography.Text>
            <Select style={{ width: '100%' }} loading={companyLoading} value={companyId ?? undefined} options={companyOptions} onChange={(v) => setCompanyId(v)} />
          </div>
        </Space>
      </Card>

      <Card>
        <Table<BudgetRow> rowKey="id" loading={loading} columns={columns} dataSource={rows} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        open={createOpen}
        title="Create Budget"
        width={980}
        okText="Create"
        confirmLoading={saving}
        onCancel={() => setCreateOpen(false)}
        onOk={async () => {
          if (!companyId) return
          try {
            setSaving(true)
            const v = await createForm.validateFields()
            const payload: any = {
              fiscalYearId: v.fiscalYearId != null ? Number(v.fiscalYearId) : null,
              orgId: v.orgId != null ? Number(v.orgId) : null,
              name: v.name,
              description: v.description || null,
              lines: (v.lines || []).map((ln: any) => ({
                glAccountId: ln.glAccountId != null ? Number(ln.glAccountId) : null,
                accountingPeriodId: ln.accountingPeriodId != null ? Number(ln.accountingPeriodId) : null,
                budgetAmount: ln.budgetAmount != null ? Number(ln.budgetAmount) : null,
                notes: ln.notes || null
              }))
            }
            if (payload.orgId == null) delete payload.orgId

            await financeApi.createBudget(companyId, payload)
            message.success('Created')
            setCreateOpen(false)
            await load(companyId)
          } catch (e: any) {
            if (e?.errorFields) {
              message.error('Please complete required fields')
              return
            }
            message.error(getApiErrorMessage(e, 'Failed to create budget'))
          } finally {
            setSaving(false)
          }
        }}
      >
        <Form
          form={createForm}
          layout="vertical"
          onValuesChange={(changed, all) => {
            const nextFiscalYearId = (changed as any)?.fiscalYearId
            if (companyId && nextFiscalYearId) void loadPeriods(companyId, Number(nextFiscalYearId))
            if (periods.length === 0 && companyId && all?.fiscalYearId) void loadPeriods(companyId, Number(all.fiscalYearId))
          }}
        >
          <Space wrap style={{ width: '100%' }}>
            <Form.Item name="fiscalYearId" label="Fiscal Year" rules={[{ required: true }]} style={{ width: 260 }}>
              <Select options={fyOptions} loading={lookupLoading} />
            </Form.Item>
            <Form.Item name="orgId" label="Org (optional)" style={{ width: 260 }}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>

          <Typography.Title level={5}>Lines</Typography.Title>
          <Form.List name="lines">
            {(fields, { add, remove }) => (
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline" wrap style={{ width: '100%' }}>
                    <Form.Item {...field} name={[field.name, 'glAccountId']} label="GL Account" rules={[{ required: true }]} style={{ width: 380 }}>
                      <Select showSearch optionFilterProp="label" loading={lookupLoading} options={glOptions} />
                    </Form.Item>
                    <Form.Item {...field} name={[field.name, 'accountingPeriodId']} label="Period" rules={[{ required: true }]} style={{ width: 340 }}>
                      <Select showSearch optionFilterProp="label" options={periodOptions} />
                    </Form.Item>
                    <Form.Item {...field} name={[field.name, 'budgetAmount']} label="Amount" rules={[{ required: true }]} style={{ width: 180 }}>
                      <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item {...field} name={[field.name, 'notes']} label="Notes" style={{ width: 280 }}>
                      <Input />
                    </Form.Item>
                    <Button danger onClick={() => remove(field.name)} disabled={fields.length <= 1}>
                      Remove
                    </Button>
                  </Space>
                ))}
                <Button onClick={() => add({ glAccountId: glAccounts[0]?.id ?? null, accountingPeriodId: periods[0]?.id ?? null, budgetAmount: 0, notes: '' })}>
                  Add Line
                </Button>
              </Space>
            )}
          </Form.List>
        </Form>
      </Modal>
    </Space>
  )
}
