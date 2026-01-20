import { create } from 'zustand'

type ContextState = {
  companyId: number | null
  orgId: number | null
  setCompanyId: (companyId: number | null) => void
  setOrgId: (orgId: number | null) => void
  reset: () => void
}

export const useContextStore = create<ContextState>((set) => ({
  companyId: null,
  orgId: null,
  setCompanyId: (companyId) => set({ companyId }),
  setOrgId: (orgId) => set({ orgId }),
  reset: () => set({ companyId: null, orgId: null })
}))
