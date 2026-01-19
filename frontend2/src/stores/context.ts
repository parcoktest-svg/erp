import Cookies from 'js-cookie'
import { create } from 'zustand'

const COMPANY_KEY = 'erp_company_id'
const ORG_KEY = 'erp_org_id'

type ContextState = {
  companyId: number | null
  orgId: number | null
  setCompanyId: (id: number | string | null) => void
  setOrgId: (id: number | string | null) => void
}

export const useContextStore = create<ContextState>((set) => ({
  companyId: Cookies.get(COMPANY_KEY) ? Number(Cookies.get(COMPANY_KEY)) : null,
  orgId: Cookies.get(ORG_KEY) ? Number(Cookies.get(ORG_KEY)) : null,
  setCompanyId: (id) => {
    const companyId = id == null ? null : Number(id)
    if (companyId == null) Cookies.remove(COMPANY_KEY)
    else Cookies.set(COMPANY_KEY, String(companyId))

    Cookies.remove(ORG_KEY)
    set({ companyId, orgId: null })
  },
  setOrgId: (id) => {
    const orgId = id == null ? null : Number(id)
    if (orgId == null) Cookies.remove(ORG_KEY)
    else Cookies.set(ORG_KEY, String(orgId))
    set({ orgId })
  }
}))
