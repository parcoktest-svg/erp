import { Button, Select, Space, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { coreApi } from '@/utils/api'
import { useContextStore } from '@/stores/context'

type Props = {
  showOrg?: boolean
}

export default function CompanyOrgBar({ showOrg = true }: Props) {
  const companyId = useContextStore((s) => s.companyId)
  const orgId = useContextStore((s) => s.orgId)
  const setCompanyId = useContextStore((s) => s.setCompanyId)
  const setOrgId = useContextStore((s) => s.setOrgId)

  const [companies, setCompanies] = useState<any[]>([])
  const [orgs, setOrgs] = useState<any[]>([])

  const companyOptions = useMemo(
    () =>
      (companies || []).map((c) => ({
        label: `${c.code} - ${c.name}`,
        value: c.id
      })),
    [companies]
  )

  const orgOptions = useMemo(
    () =>
      (orgs || []).map((o) => ({
        label: `${o.code} - ${o.name}`,
        value: o.id
      })),
    [orgs]
  )

  async function loadCompanies() {
    try {
      setCompanies((await coreApi.listCompanies()) || [])
    } catch {
      setCompanies([])
    }
  }

  async function loadOrgs(cId: number | null) {
    if (!cId) {
      setOrgs([])
      return
    }
    try {
      setOrgs((await coreApi.listOrgs(cId)) || [])
    } catch {
      setOrgs([])
    }
  }

  async function refresh() {
    await loadCompanies()
    await loadOrgs(companyId)
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    void loadOrgs(companyId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  return (
    <Space wrap size={12} align="center">
      <Space size={8} align="center">
        <Typography.Text type="secondary">Company</Typography.Text>
        <Select
          showSearch
          filterOption={(input, option) => String(option?.label || '').toLowerCase().includes(input.toLowerCase())}
          style={{ minWidth: 220 }}
          placeholder="Select company"
          value={companyId ?? undefined}
          options={companyOptions}
          onChange={(v) => {
            setCompanyId(v ?? null)
          }}
        />
        <Button size="small" onClick={() => void refresh()}>
          Refresh
        </Button>
      </Space>

      {showOrg ? (
        <Space size={8} align="center">
          <Typography.Text type="secondary">Org</Typography.Text>
          <Select
            showSearch
            filterOption={(input, option) => String(option?.label || '').toLowerCase().includes(input.toLowerCase())}
            style={{ minWidth: 220 }}
            placeholder="Select org"
            value={orgId ?? undefined}
            disabled={!companyId}
            options={orgOptions}
            onChange={(v) => {
              setOrgId(v ?? null)
            }}
          />
        </Space>
      ) : null}
    </Space>
  )
}
