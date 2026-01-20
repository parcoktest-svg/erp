import { Button, Card, DatePicker, Form, InputNumber, Modal, Select, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { coreApi, financeApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import { getApiErrorMessage } from '@/utils/error'

type CompanyRow = { id: number; code?: string; name?: string }

type FiscalYearRow = {
  id: number
  year?: number
  startDate?: string
  endDate?: string
  status?: 'OPEN' | 'CLOSED'
}

type PeriodRow = {
  id: number
  fiscalYearId?: number
  periodNo?: number
  startDate?: string
  endDate?: string
  status?: 'OPEN' | 'CLOSED'
}

function toLocalDateString(d: any): string {
  if (!d) return ''
  return dayjs(d).format('YYYY-MM-DD')
}

export default function FinancePeriodsView() {
  const companyId = useContextStore((s) => s.companyId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)

  const [companyLoading, setCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyRow[]>([])

  const [fyLoading, setFyLoading] = useState(false)
  const [fiscalYears, setFiscalYears] = useState<FiscalYearRow[]>([])

  const [selectedFyId, setSelectedFyId] = useState<number | null>(null)

  const [periodLoading, setPeriodLoading] = useState(false)
  const [periods, setPeriods] = useState<PeriodRow[]>([])

  const [createOpen, setCreateOpen] = useState(false)
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

  const loadFiscalYears = async (cid: number) => {
    setFyLoading(true)
    try {
      const res = await financeApi.listFiscalYears(cid)
      const list = (res || []) as FiscalYearRow[]
      setFiscalYears(list)
      if (!selectedFyId && list.length > 0) setSelectedFyId(list[0].id)
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load fiscal years'))
      setFiscalYears([])
      setSelectedFyId(null)
    } finally {
      setFyLoading(false)
    }
  }

  const loadPeriods = async (cid: number, fiscalYearId: number) => {
    setPeriodLoading(true)
    try {
      const res = await financeApi.listPeriods(cid, fiscalYearId)
      setPeriods((res || []) as PeriodRow[])
    } catch (e: any) {
      message.error(getApiErrorMessage(e, 'Failed to load periods'))
      setPeriods([])
    } finally {
      setPeriodLoading(false)
    }
  }

  useEffect(() => {
    void loadCompanies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!companyId) return
    void loadFiscalYears(companyId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  useEffect(() => {
    if (!companyId || !selectedFyId) {
      setPeriods([])
      return
    }
    void loadPeriods(companyId, selectedFyId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, selectedFyId])

  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: c.id, label: `${c.code || c.id} - ${c.name || ''}` })),
    [companies]
  )

  const fyColumns: ColumnsType<FiscalYearRow> = [
    { title: 'Year', dataIndex: 'year', width: 120 },
    { title: 'Start', dataIndex: 'startDate', width: 140 },
    { title: 'End', dataIndex: 'endDate', width: 140 },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: (v: any) => (String(v) === 'OPEN' ? <Tag color="green">OPEN</Tag> : <Tag color="red">CLOSED</Tag>)
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_, r) => {
        const status = String(r.status || '')
        return (
          <Space>
            <Button
              size="small"
              disabled={!companyId || status !== 'OPEN'}
              onClick={async () => {
                if (!companyId) return
                try {
                  await financeApi.closeFiscalYear(companyId, r.id)
                  message.success('Closed')
                  await loadFiscalYears(companyId)
                } catch (e: any) {
                  message.error(getApiErrorMessage(e, 'Failed to close fiscal year'))
                }
              }}
            >
              Close
            </Button>
            <Button
              size="small"
              disabled={!companyId || status !== 'CLOSED'}
              onClick={async () => {
                if (!companyId) return
                try {
                  await financeApi.openFiscalYear(companyId, r.id)
                  message.success('Opened')
                  await loadFiscalYears(companyId)
                } catch (e: any) {
                  message.error(getApiErrorMessage(e, 'Failed to open fiscal year'))
                }
              }}
            >
              Open
            </Button>
          </Space>
        )
      }
    }
  ]

  const periodColumns: ColumnsType<PeriodRow> = [
    { title: 'Period No', dataIndex: 'periodNo', width: 120 },
    { title: 'Start', dataIndex: 'startDate', width: 140 },
    { title: 'End', dataIndex: 'endDate', width: 140 },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: (v: any) => (String(v) === 'OPEN' ? <Tag color="green">OPEN</Tag> : <Tag color="red">CLOSED</Tag>)
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_, r) => {
        const status = String(r.status || '')
        return (
          <Space>
            <Button
              size="small"
              disabled={!companyId || status !== 'OPEN'}
              onClick={async () => {
                if (!companyId) return
                try {
                  await financeApi.closePeriod(companyId, r.id)
                  message.success('Closed')
                  if (selectedFyId) await loadPeriods(companyId, selectedFyId)
                } catch (e: any) {
                  message.error(getApiErrorMessage(e, 'Failed to close period'))
                }
              }}
            >
              Close
            </Button>
            <Button
              size="small"
              disabled={!companyId || status !== 'CLOSED'}
              onClick={async () => {
                if (!companyId) return
                try {
                  await financeApi.openPeriod(companyId, r.id)
                  message.success('Opened')
                  if (selectedFyId) await loadPeriods(companyId, selectedFyId)
                } catch (e: any) {
                  message.error(getApiErrorMessage(e, 'Failed to open period'))
                }
              }}
            >
              Open
            </Button>
          </Space>
        )
      }
    }
  ]

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Periods
          </Typography.Title>
          <Space>
            <Button onClick={() => companyId && loadFiscalYears(companyId)} disabled={!companyId} loading={fyLoading}>
              Refresh Fiscal Years
            </Button>
            <Button
              type="primary"
              disabled={!companyId}
              onClick={() => {
                createForm.resetFields()
                const y = dayjs().year()
                createForm.setFieldsValue({ year: y, startDate: dayjs(`${y}-01-01`), endDate: dayjs(`${y}-12-31`) })
                setCreateOpen(true)
              }}
            >
              New Fiscal Year
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

          <div style={{ minWidth: 260 }}>
            <Typography.Text strong>Fiscal Year</Typography.Text>
            <Select
              style={{ width: '100%' }}
              loading={fyLoading}
              value={selectedFyId ?? undefined}
              placeholder="Select fiscal year"
              options={fiscalYears.map((fy) => ({ value: fy.id, label: `${fy.year} (${fy.status})` }))}
              onChange={(v) => setSelectedFyId(v)}
            />
          </div>
        </Space>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 16 }}>
        <Card title="Fiscal Years">
          <Table<FiscalYearRow>
            rowKey="id"
            size="small"
            loading={fyLoading}
            columns={fyColumns}
            dataSource={fiscalYears}
            pagination={{ pageSize: 8 }}
            onRow={(r) => ({
              onClick: () => setSelectedFyId(r.id)
            })}
          />
        </Card>

        <Card title="Accounting Periods">
          <Table<PeriodRow>
            rowKey="id"
            size="small"
            loading={periodLoading}
            columns={periodColumns}
            dataSource={periods}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>

      <Modal
        open={createOpen}
        title="Create Fiscal Year"
        onCancel={() => setCreateOpen(false)}
        okText="Create"
        onOk={async () => {
          if (!companyId) return
          try {
            const values = await createForm.validateFields()
            const payload: any = {
              year: values.year,
              startDate: toLocalDateString(values.startDate),
              endDate: toLocalDateString(values.endDate)
            }
            await financeApi.createFiscalYear(companyId, payload)
            message.success('Created')
            setCreateOpen(false)
            await loadFiscalYears(companyId)
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(getApiErrorMessage(e, 'Failed to create fiscal year'))
          }
        }}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="year" label="Year" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={1900} max={3000} />
          </Form.Item>
          <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}
