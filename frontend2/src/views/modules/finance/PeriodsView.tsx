import { Button, Card, DatePicker, Form, InputNumber, Modal, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { financeApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'
import CompanyOrgBar from '@/views/modules/common/CompanyOrgBar'

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

export default function PeriodsView() {
  const companyId = useContextStore((s) => s.companyId)

  const [fyLoading, setFyLoading] = useState(false)
  const [fiscalYears, setFiscalYears] = useState<FiscalYearRow[]>([])
  const [selectedFyId, setSelectedFyId] = useState<number | null>(null)

  const [periodLoading, setPeriodLoading] = useState(false)
  const [periods, setPeriods] = useState<PeriodRow[]>([])

  const [createOpen, setCreateOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [createForm] = Form.useForm()

  async function loadFiscalYears() {
    if (!companyId) {
      setFiscalYears([])
      setSelectedFyId(null)
      return
    }
    setFyLoading(true)
    try {
      const list = ((await financeApi.listFiscalYears(companyId)) || []) as FiscalYearRow[]
      setFiscalYears(list)
      if (!selectedFyId && list.length > 0) setSelectedFyId(list[0].id)
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || 'Failed to load fiscal years')
      setFiscalYears([])
      setSelectedFyId(null)
    } finally {
      setFyLoading(false)
    }
  }

  async function loadPeriods(fiscalYearId: number) {
    if (!companyId) {
      setPeriods([])
      return
    }
    setPeriodLoading(true)
    try {
      setPeriods(((await financeApi.listPeriods(companyId, fiscalYearId)) || []) as PeriodRow[])
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || 'Failed to load periods')
      setPeriods([])
    } finally {
      setPeriodLoading(false)
    }
  }

  useEffect(() => {
    void loadFiscalYears()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  useEffect(() => {
    if (!companyId || !selectedFyId) {
      setPeriods([])
      return
    }
    void loadPeriods(selectedFyId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, selectedFyId])

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
                  await loadFiscalYears()
                } catch (e: any) {
                  message.error(e?.response?.data?.message || e?.message || 'Failed to close fiscal year')
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
                  await loadFiscalYears()
                } catch (e: any) {
                  message.error(e?.response?.data?.message || e?.message || 'Failed to open fiscal year')
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
                  if (selectedFyId) await loadPeriods(selectedFyId)
                } catch (e: any) {
                  message.error(e?.response?.data?.message || e?.message || 'Failed to close period')
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
                  if (selectedFyId) await loadPeriods(selectedFyId)
                } catch (e: any) {
                  message.error(e?.response?.data?.message || e?.message || 'Failed to open period')
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
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Periods
            </Typography.Title>
            <Typography.Text type="secondary">Fiscal Years dan Accounting Periods.</Typography.Text>
          </div>
          <Space>
            <Button onClick={() => void loadFiscalYears()} disabled={!companyId} loading={fyLoading}>
              Refresh
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
        <CompanyOrgBar showOrg={false} />
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
        confirmLoading={saving}
        onOk={async () => {
          if (!companyId) return
          try {
            const v = await createForm.validateFields()
            setSaving(true)
            await financeApi.createFiscalYear(companyId, {
              year: v.year,
              startDate: toLocalDateString(v.startDate),
              endDate: toLocalDateString(v.endDate)
            })
            message.success('Created')
            setCreateOpen(false)
            await loadFiscalYears()
          } catch (e: any) {
            if (e?.errorFields) return
            message.error(e?.response?.data?.message || e?.message || 'Failed to create fiscal year')
          } finally {
            setSaving(false)
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
