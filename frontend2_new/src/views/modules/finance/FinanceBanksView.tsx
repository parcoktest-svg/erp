import { Button, Card, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { coreApi, financeApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import { getApiErrorMessage } from '@/utils/error'

type CompanyRow = { id: number; code?: string; name?: string }

type OrgRow = { id: number; code?: string; name?: string }

type GlRow = { id: number; code?: string; name?: string }

type BankAccountRow = { id: number; orgId?: number; name?: string; bankName?: string; accountNo?: string; currencyCode?: string; glAccountId?: number; active?: boolean }

type StatementRow = { id: number; bankAccountId?: number; statementDate?: string; description?: string; status?: string; lines?: any[] }

function toLocalDateString(d: any) {
  return d ? dayjs(d).format('YYYY-MM-DD') : ''
}

export default function FinanceBanksView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [lookupLoading, setLookupLoading] = useState(false)
  const [orgs, setOrgs] = useState<OrgRow[]>([])
  const [glAccounts, setGlAccounts] = useState<GlRow[]>([])

  const [accountsLoading, setAccountsLoading] = useState(false)
  const [accounts, setAccounts] = useState<BankAccountRow[]>([])

  const [statementsLoading, setStatementsLoading] = useState(false)
  const [statements, setStatements] = useState<StatementRow[]>([])

  const [accountModalOpen, setAccountModalOpen] = useState(false)
  const [accountSaving, setAccountSaving] = useState(false)
  const [accountForm] = Form.useForm()

  const [statementModalOpen, setStatementModalOpen] = useState(false)
  const [statementSaving, setStatementSaving] = useState(false)
  const [statementForm] = Form.useForm()

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
      const [orgRes, glRes] = await Promise.all([coreApi.listOrgs(cid), financeApi.listGlAccounts(cid)])
      setOrgs(orgRes || [])
      setGlAccounts(glRes || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load lookups'))
      setOrgs([])
      setGlAccounts([])
    } finally {
      setLookupLoading(false)
    }
  }

  const loadAccounts = async (cid: number) => {
    setAccountsLoading(true)
    try {
      const res = await financeApi.listBankAccounts(cid)
      setAccounts(res || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load bank accounts'))
      setAccounts([])
    } finally {
      setAccountsLoading(false)
    }
  }

  const loadStatements = async (cid: number) => {
    setStatementsLoading(true)
    try {
      const res = await financeApi.listBankStatements(cid)
      setStatements(res || [])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load bank statements'))
      setStatements([])
    } finally {
      setStatementsLoading(false)
    }
  }

  useEffect(() => {
    void loadCompanies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!companyId) return
    void loadLookups(companyId)
    void Promise.all([loadAccounts(companyId), loadStatements(companyId)])
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
  const glOptions = useMemo(
    () => glAccounts.map((g) => ({ value: g.id, label: `${g.code || g.id} - ${g.name || ''}` })),
    [glAccounts]
  )
  const accountOptions = useMemo(
    () => accounts.map((a) => ({ value: a.id, label: `${a.name || a.id} (${a.currencyCode || ''})` })),
    [accounts]
  )

  const accountsColumns: ColumnsType<BankAccountRow> = [
    { title: 'Name', dataIndex: 'name', width: 220 },
    { title: 'Bank', dataIndex: 'bankName', width: 180 },
    { title: 'Account No', dataIndex: 'accountNo', width: 160 },
    { title: 'Currency', dataIndex: 'currencyCode', width: 110 },
    { title: 'Active', dataIndex: 'active', width: 90, render: (v: any) => <Tag>{String(!!v)}</Tag> }
  ]

  const statementsColumns: ColumnsType<StatementRow> = [
    { title: 'ID', dataIndex: 'id', width: 90 },
    { title: 'Status', dataIndex: 'status', width: 120, render: (v: any) => <Tag>{String(v || '')}</Tag> },
    { title: 'Date', dataIndex: 'statementDate', width: 140 },
    { title: 'Bank Account', dataIndex: 'bankAccountId', width: 160 },
    { title: 'Description', dataIndex: 'description' },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, r) => (
        <Button
          size="small"
          onClick={async () => {
            if (!companyId) return
            try {
              const detail = await financeApi.getBankStatement(companyId, r.id)
              Modal.info({
                title: `Statement ${detail?.id || r.id}`,
                width: 980,
                content: (
                  <Table
                    size="small"
                    rowKey={(x: any, idx) => String(x?.id || idx)}
                    pagination={{ pageSize: 10 }}
                    dataSource={detail?.lines || []}
                    columns={[
                      { title: 'Trx Date', dataIndex: 'trxDate', width: 140 },
                      { title: 'Amount', dataIndex: 'amount', width: 160 },
                      { title: 'Description', dataIndex: 'description' }
                    ]}
                  />
                )
              })
            } catch (e: any) {
              message.error(getApiErrorMessage(e, 'Failed to load statement'))
            }
          }}
        >
          View
        </Button>
      )
    }
  ]

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Banks
            </Typography.Title>
            <Typography.Text type="secondary">Manage bank accounts and bank statements.</Typography.Text>
          </div>
          <Space>
            <Button onClick={() => companyId && loadLookups(companyId)} disabled={!companyId} loading={lookupLoading}>
              Refresh Lookups
            </Button>
            <Button onClick={() => companyId && Promise.all([loadAccounts(companyId), loadStatements(companyId)])} disabled={!companyId}>
              Refresh
            </Button>
            <Button
              type="primary"
              disabled={!companyId}
              onClick={() => {
                accountForm.resetFields()
                accountForm.setFieldsValue({ orgId: null, name: '', bankName: '', accountNo: '', currencyCode: 'IDR', glAccountId: null, active: true })
                setAccountModalOpen(true)
              }}
            >
              New Account
            </Button>
            <Button
              disabled={!companyId}
              onClick={() => {
                statementForm.resetFields()
                statementForm.setFieldsValue({ orgId: null, bankAccountId: accounts[0]?.id ?? null, statementDate: dayjs(), description: '', lines: [{ trxDate: dayjs(), description: '', amount: 0 }] })
                setStatementModalOpen(true)
              }}
            >
              New Statement
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

      <Card title="Bank Accounts">
        <Table<BankAccountRow> rowKey="id" loading={accountsLoading} columns={accountsColumns} dataSource={accounts} pagination={{ pageSize: 10 }} />
      </Card>

      <Card title="Bank Statements">
        <Table<StatementRow> rowKey="id" loading={statementsLoading} columns={statementsColumns} dataSource={statements} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        open={accountModalOpen}
        title="Create Bank Account"
        okText="Create"
        confirmLoading={accountSaving}
        onCancel={() => setAccountModalOpen(false)}
        onOk={async () => {
          if (!companyId) return
          try {
            setAccountSaving(true)
            const v = await accountForm.validateFields()
            await financeApi.createBankAccount(companyId, {
              orgId: v.orgId != null ? Number(v.orgId) : null,
              name: v.name,
              bankName: v.bankName,
              accountNo: v.accountNo,
              currencyCode: v.currencyCode,
              glAccountId: v.glAccountId != null ? Number(v.glAccountId) : null,
              active: !!v.active
            })
            message.success('Created')
            setAccountModalOpen(false)
            await loadAccounts(companyId)
          } catch (e: any) {
            if (e?.errorFields) {
              message.error('Please complete required fields')
              return
            }
            message.error(getApiErrorMessage(e, 'Failed to create bank account'))
          } finally {
            setAccountSaving(false)
          }
        }}
      >
        <Form form={accountForm} layout="vertical">
          <Space wrap style={{ width: '100%' }}>
            <Form.Item name="orgId" label="Org (optional)" style={{ width: 260 }}>
              <Select allowClear showSearch optionFilterProp="label" loading={lookupLoading} options={orgOptions} />
            </Form.Item>
            <Form.Item name="currencyCode" label="Currency" rules={[{ required: true }]} style={{ width: 200 }}>
              <Input />
            </Form.Item>
            <Form.Item name="glAccountId" label="GL Account" rules={[{ required: true }]} style={{ width: 320 }}>
              <Select showSearch optionFilterProp="label" loading={lookupLoading} options={glOptions} />
            </Form.Item>
          </Space>
          <Space wrap style={{ width: '100%' }}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]} style={{ width: 320 }}>
              <Input />
            </Form.Item>
            <Form.Item name="bankName" label="Bank Name" rules={[{ required: true }]} style={{ width: 320 }}>
              <Input />
            </Form.Item>
            <Form.Item name="accountNo" label="Account No" rules={[{ required: true }]} style={{ width: 320 }}>
              <Input />
            </Form.Item>
          </Space>
          <Form.Item name="active" label="Active" rules={[{ required: true }]}>
            <Select options={[{ value: true, label: 'Active' }, { value: false, label: 'Inactive' }]} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={statementModalOpen}
        title="Create Bank Statement"
        okText="Create"
        confirmLoading={statementSaving}
        onCancel={() => setStatementModalOpen(false)}
        onOk={async () => {
          if (!companyId) return
          try {
            setStatementSaving(true)
            const v = await statementForm.validateFields()
            await financeApi.createBankStatement(companyId, {
              orgId: v.orgId != null ? Number(v.orgId) : null,
              bankAccountId: v.bankAccountId != null ? Number(v.bankAccountId) : null,
              statementDate: toLocalDateString(v.statementDate),
              description: v.description || null,
              lines: (v.lines || []).map((ln: any) => ({ trxDate: toLocalDateString(ln.trxDate), description: ln.description || null, amount: ln.amount != null ? Number(ln.amount) : null }))
            })
            message.success('Created')
            setStatementModalOpen(false)
            await loadStatements(companyId)
          } catch (e: any) {
            if (e?.errorFields) {
              message.error('Please complete required fields')
              return
            }
            message.error(getApiErrorMessage(e, 'Failed to create bank statement'))
          } finally {
            setStatementSaving(false)
          }
        }}
      >
        <Form form={statementForm} layout="vertical">
          <Space wrap style={{ width: '100%' }}>
            <Form.Item name="orgId" label="Org (optional)" style={{ width: 260 }}>
              <Select allowClear showSearch optionFilterProp="label" loading={lookupLoading} options={orgOptions} />
            </Form.Item>
            <Form.Item name="bankAccountId" label="Bank Account" rules={[{ required: true }]} style={{ width: 360 }}>
              <Select showSearch optionFilterProp="label" options={accountOptions} />
            </Form.Item>
            <Form.Item name="statementDate" label="Statement Date" rules={[{ required: true }]} style={{ width: 260 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>

          <Typography.Title level={5}>Lines</Typography.Title>
          <Form.List name="lines">
            {(fields, { add, remove }) => (
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline" wrap style={{ width: '100%' }}>
                    <Form.Item {...field} name={[field.name, 'trxDate']} label="Trx Date" rules={[{ required: true }]} style={{ width: 200 }}>
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item {...field} name={[field.name, 'amount']} label="Amount" rules={[{ required: true }]} style={{ width: 200 }}>
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item {...field} name={[field.name, 'description']} label="Description" style={{ width: 420 }}>
                      <Input />
                    </Form.Item>
                    <Button danger onClick={() => remove(field.name)} disabled={fields.length <= 1}>
                      Remove
                    </Button>
                  </Space>
                ))}
                <Button onClick={() => add({ trxDate: dayjs(), amount: 0, description: '' })}>Add Line</Button>
              </Space>
            )}
          </Form.List>
        </Form>
      </Modal>
    </Space>
  )
}
