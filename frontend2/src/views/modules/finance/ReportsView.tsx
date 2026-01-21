import { Button, Card, DatePicker, Form, Select, Space, Table, Tabs, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { financeApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import CompanyOrgBar from '@/views/modules/common/CompanyOrgBar'

type AgingRow = {
  businessPartnerId?: number
  businessPartnerName?: string
  bucket0To30?: any
  bucket31To60?: any
  bucket61To90?: any
  bucketOver90?: any
  totalOpen?: any
}

type GlSummaryRow = { accountCode?: any; debitTotal?: any; creditTotal?: any; balance?: any }

type TrialBalanceRow = { accountCode?: string; accountName?: string; accountType?: string; debitTotal?: any; creditTotal?: any; balance?: any }

type ProfitLossRow = { accountCode?: string; accountName?: string; accountType?: string; amount?: any }

type BalanceSheetRow = { accountCode?: string; accountName?: string; accountType?: string; amount?: any }

function toLocalDateString(d: any): string {
  if (!d) return ''
  return dayjs(d).format('YYYY-MM-DD')
}

export default function ReportsView() {
  const companyId = useContextStore((s) => s.companyId)

  const [agingLoading, setAgingLoading] = useState(false)
  const [agingRows, setAgingRows] = useState<AgingRow[]>([])
  const [agingTotals, setAgingTotals] = useState<any>(null)
  const [agingForm] = Form.useForm()

  const [glSummaryLoading, setGlSummaryLoading] = useState(false)
  const [glSummaryRows, setGlSummaryRows] = useState<GlSummaryRow[]>([])
  const [glSummaryTotals, setGlSummaryTotals] = useState<any>(null)
  const [glSummaryForm] = Form.useForm()

  const [trialLoading, setTrialLoading] = useState(false)
  const [trialRows, setTrialRows] = useState<TrialBalanceRow[]>([])
  const [trialTotals, setTrialTotals] = useState<any>(null)
  const [trialForm] = Form.useForm()

  const [plLoading, setPlLoading] = useState(false)
  const [plRows, setPlRows] = useState<ProfitLossRow[]>([])
  const [plTotals, setPlTotals] = useState<any>(null)
  const [plForm] = Form.useForm()

  const [bsLoading, setBsLoading] = useState(false)
  const [bsRows, setBsRows] = useState<BalanceSheetRow[]>([])
  const [bsTotals, setBsTotals] = useState<any>(null)
  const [bsForm] = Form.useForm()

  useEffect(() => {
    setAgingRows([])
    setAgingTotals(null)
    setGlSummaryRows([])
    setGlSummaryTotals(null)
    setTrialRows([])
    setTrialTotals(null)
    setPlRows([])
    setPlTotals(null)
    setBsRows([])
    setBsTotals(null)
  }, [companyId])

  const agingColumns: ColumnsType<AgingRow> = [
    { title: 'Partner', dataIndex: 'businessPartnerName' },
    { title: '0-30', dataIndex: 'bucket0To30', width: 120 },
    { title: '31-60', dataIndex: 'bucket31To60', width: 120 },
    { title: '61-90', dataIndex: 'bucket61To90', width: 120 },
    { title: '>90', dataIndex: 'bucketOver90', width: 120 },
    { title: 'Total Open', dataIndex: 'totalOpen', width: 140 }
  ]

  const glSummaryColumns: ColumnsType<GlSummaryRow> = [
    { title: 'Account Code', dataIndex: 'accountCode' },
    { title: 'Debit', dataIndex: 'debitTotal', width: 140 },
    { title: 'Credit', dataIndex: 'creditTotal', width: 140 },
    { title: 'Balance', dataIndex: 'balance', width: 140 }
  ]

  const trialColumns: ColumnsType<TrialBalanceRow> = [
    { title: 'Account Code', dataIndex: 'accountCode', width: 140 },
    { title: 'Account Name', dataIndex: 'accountName' },
    { title: 'Type', dataIndex: 'accountType', width: 120 },
    { title: 'Debit', dataIndex: 'debitTotal', width: 140 },
    { title: 'Credit', dataIndex: 'creditTotal', width: 140 },
    { title: 'Balance', dataIndex: 'balance', width: 140 }
  ]

  const plColumns: ColumnsType<ProfitLossRow> = [
    { title: 'Account Code', dataIndex: 'accountCode', width: 140 },
    { title: 'Account Name', dataIndex: 'accountName' },
    { title: 'Type', dataIndex: 'accountType', width: 120 },
    { title: 'Amount', dataIndex: 'amount', width: 160 }
  ]

  const bsColumns: ColumnsType<BalanceSheetRow> = [
    { title: 'Account Code', dataIndex: 'accountCode', width: 140 },
    { title: 'Account Name', dataIndex: 'accountName' },
    { title: 'Type', dataIndex: 'accountType', width: 120 },
    { title: 'Amount', dataIndex: 'amount', width: 160 }
  ]

  const totalsText = useMemo(() => {
    const fmt = (v: any) => (v == null ? '-' : String(v))
    return {
      aging: {
        t0: fmt(agingTotals?.total0To30),
        t1: fmt(agingTotals?.total31To60),
        t2: fmt(agingTotals?.total61To90),
        t3: fmt(agingTotals?.totalOver90),
        t4: fmt(agingTotals?.totalOpen)
      },
      gl: {
        debit: fmt(glSummaryTotals?.totalDebit),
        credit: fmt(glSummaryTotals?.totalCredit)
      },
      trial: {
        debit: fmt(trialTotals?.totalDebit),
        credit: fmt(trialTotals?.totalCredit)
      },
      pl: {
        revenue: fmt(plTotals?.totalRevenue),
        expense: fmt(plTotals?.totalExpense),
        net: fmt(plTotals?.netIncome)
      },
      bs: {
        assets: fmt(bsTotals?.totalAssets),
        liabilities: fmt(bsTotals?.totalLiabilities),
        equity: fmt(bsTotals?.totalEquity)
      }
    }
  }, [agingTotals, bsTotals, glSummaryTotals, plTotals, trialTotals])

  const runAging = async () => {
    if (!companyId) return
    try {
      const v = await agingForm.validateFields()
      setAgingLoading(true)
      const res = await financeApi.agingReport(companyId, {
        invoiceType: v.invoiceType,
        asOfDate: v.asOfDate ? toLocalDateString(v.asOfDate) : undefined
      })
      setAgingRows(res?.partners || [])
      setAgingTotals(res)
    } catch (e: any) {
      if (e?.errorFields) return
      message.error(e?.response?.data?.message || e?.message || 'Failed to load aging report')
      setAgingRows([])
      setAgingTotals(null)
    } finally {
      setAgingLoading(false)
    }
  }

  const runGlSummary = async () => {
    if (!companyId) return
    try {
      const v = await glSummaryForm.validateFields()
      setGlSummaryLoading(true)
      const res = await financeApi.glSummaryReport(companyId, {
        fromDate: toLocalDateString(v.fromDate),
        toDate: toLocalDateString(v.toDate)
      })
      setGlSummaryRows(res?.rows || [])
      setGlSummaryTotals(res)
    } catch (e: any) {
      if (e?.errorFields) return
      message.error(e?.response?.data?.message || e?.message || 'Failed to load GL summary report')
      setGlSummaryRows([])
      setGlSummaryTotals(null)
    } finally {
      setGlSummaryLoading(false)
    }
  }

  const runTrial = async () => {
    if (!companyId) return
    try {
      const v = await trialForm.validateFields()
      setTrialLoading(true)
      const res = await financeApi.trialBalanceReport(companyId, {
        fromDate: toLocalDateString(v.fromDate),
        toDate: toLocalDateString(v.toDate)
      })
      setTrialRows(res?.rows || [])
      setTrialTotals(res)
    } catch (e: any) {
      if (e?.errorFields) return
      message.error(e?.response?.data?.message || e?.message || 'Failed to load trial balance report')
      setTrialRows([])
      setTrialTotals(null)
    } finally {
      setTrialLoading(false)
    }
  }

  const runPL = async () => {
    if (!companyId) return
    try {
      const v = await plForm.validateFields()
      setPlLoading(true)
      const res = await financeApi.profitLossReport(companyId, {
        fromDate: toLocalDateString(v.fromDate),
        toDate: toLocalDateString(v.toDate)
      })
      setPlRows(res?.rows || [])
      setPlTotals(res)
    } catch (e: any) {
      if (e?.errorFields) return
      message.error(e?.response?.data?.message || e?.message || 'Failed to load profit/loss report')
      setPlRows([])
      setPlTotals(null)
    } finally {
      setPlLoading(false)
    }
  }

  const runBS = async () => {
    if (!companyId) return
    try {
      const v = await bsForm.validateFields()
      setBsLoading(true)
      const res = await financeApi.balanceSheetReport(companyId, {
        asOfDate: v.asOfDate ? toLocalDateString(v.asOfDate) : undefined
      })
      setBsRows(res?.rows || [])
      setBsTotals(res)
    } catch (e: any) {
      if (e?.errorFields) return
      message.error(e?.response?.data?.message || e?.message || 'Failed to load balance sheet report')
      setBsRows([])
      setBsTotals(null)
    } finally {
      setBsLoading(false)
    }
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Typography.Title level={4} style={{ margin: 0 }}>
          Finance Reports
        </Typography.Title>
      </Card>

      <Card>
        <CompanyOrgBar showOrg={false} />
      </Card>

      <Card>
        <Tabs
          items={[
            {
              key: 'aging',
              label: 'Aging',
              children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form form={agingForm} layout="vertical" initialValues={{ invoiceType: 'AR', asOfDate: dayjs() }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                      <Form.Item name="invoiceType" label="Invoice Type" rules={[{ required: true }]}>
                        <Select options={[{ value: 'AR', label: 'AR' }, { value: 'AP', label: 'AP' }]} />
                      </Form.Item>
                      <Form.Item name="asOfDate" label="As Of Date (optional)">
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                      <Button type="primary" onClick={() => void runAging()} disabled={!companyId} loading={agingLoading}>
                        Run
                      </Button>
                    </div>
                  </Form>

                  <Card size="small">
                    <Space wrap>
                      <div>Total 0-30: {totalsText.aging.t0}</div>
                      <div>Total 31-60: {totalsText.aging.t1}</div>
                      <div>Total 61-90: {totalsText.aging.t2}</div>
                      <div>Total &gt;90: {totalsText.aging.t3}</div>
                      <div>Total Open: {totalsText.aging.t4}</div>
                    </Space>
                  </Card>

                  <Table<AgingRow>
                    rowKey={(r) => String(r.businessPartnerId)}
                    loading={agingLoading}
                    columns={agingColumns}
                    dataSource={agingRows}
                    pagination={{ pageSize: 10 }}
                  />
                </Space>
              )
            },
            {
              key: 'glSummary',
              label: 'GL Summary',
              children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form
                    form={glSummaryForm}
                    layout="vertical"
                    initialValues={{ fromDate: dayjs().startOf('month'), toDate: dayjs().endOf('month') }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                      <Form.Item name="fromDate" label="From" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item name="toDate" label="To" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                      <Button type="primary" onClick={() => void runGlSummary()} disabled={!companyId} loading={glSummaryLoading}>
                        Run
                      </Button>
                    </div>
                  </Form>

                  <Card size="small">
                    <Space wrap>
                      <div>Total Debit: {totalsText.gl.debit}</div>
                      <div>Total Credit: {totalsText.gl.credit}</div>
                    </Space>
                  </Card>

                  <Table<GlSummaryRow>
                    rowKey={(r, idx) => String(r.accountCode || idx)}
                    loading={glSummaryLoading}
                    columns={glSummaryColumns}
                    dataSource={glSummaryRows}
                    pagination={{ pageSize: 10 }}
                  />
                </Space>
              )
            },
            {
              key: 'trial',
              label: 'Trial Balance',
              children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form form={trialForm} layout="vertical" initialValues={{ fromDate: dayjs().startOf('month'), toDate: dayjs().endOf('month') }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                      <Form.Item name="fromDate" label="From" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item name="toDate" label="To" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                      <Button type="primary" onClick={() => void runTrial()} disabled={!companyId} loading={trialLoading}>
                        Run
                      </Button>
                    </div>
                  </Form>

                  <Card size="small">
                    <Space wrap>
                      <div>Total Debit: {totalsText.trial.debit}</div>
                      <div>Total Credit: {totalsText.trial.credit}</div>
                    </Space>
                  </Card>

                  <Table<TrialBalanceRow>
                    rowKey={(r, idx) => String(r.accountCode || idx)}
                    loading={trialLoading}
                    columns={trialColumns}
                    dataSource={trialRows}
                    pagination={{ pageSize: 10 }}
                  />
                </Space>
              )
            },
            {
              key: 'pl',
              label: 'Profit & Loss',
              children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form form={plForm} layout="vertical" initialValues={{ fromDate: dayjs().startOf('month'), toDate: dayjs().endOf('month') }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                      <Form.Item name="fromDate" label="From" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item name="toDate" label="To" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                      <Button type="primary" onClick={() => void runPL()} disabled={!companyId} loading={plLoading}>
                        Run
                      </Button>
                    </div>
                  </Form>

                  <Card size="small">
                    <Space wrap>
                      <div>Total Revenue: {totalsText.pl.revenue}</div>
                      <div>Total Expense: {totalsText.pl.expense}</div>
                      <div>Net Income: {totalsText.pl.net}</div>
                    </Space>
                  </Card>

                  <Table<ProfitLossRow>
                    rowKey={(r, idx) => String(r.accountCode || idx)}
                    loading={plLoading}
                    columns={plColumns}
                    dataSource={plRows}
                    pagination={{ pageSize: 10 }}
                  />
                </Space>
              )
            },
            {
              key: 'bs',
              label: 'Balance Sheet',
              children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form form={bsForm} layout="vertical" initialValues={{ asOfDate: dayjs() }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'end' }}>
                      <Form.Item name="asOfDate" label="As Of Date (optional)">
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                      <Button type="primary" onClick={() => void runBS()} disabled={!companyId} loading={bsLoading}>
                        Run
                      </Button>
                    </div>
                  </Form>

                  <Card size="small">
                    <Space wrap>
                      <div>Total Assets: {totalsText.bs.assets}</div>
                      <div>Total Liabilities: {totalsText.bs.liabilities}</div>
                      <div>Total Equity: {totalsText.bs.equity}</div>
                    </Space>
                  </Card>

                  <Table<BalanceSheetRow>
                    rowKey={(r, idx) => String(r.accountCode || idx)}
                    loading={bsLoading}
                    columns={bsColumns}
                    dataSource={bsRows}
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
