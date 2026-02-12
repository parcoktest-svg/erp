import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ContextState = {
  companyId: number | null
  orgId: number | null
  setCompanyId: (companyId: number | null) => void
  setOrgId: (orgId: number | null) => void
  reset: () => void
}

export const useContextStore = create<ContextState>()(
  persist(
    (set) => ({
      companyId: null,
      orgId: null,
      setCompanyId: (companyId) => set({ companyId }),
      setOrgId: (orgId) => set({ orgId }),
      reset: () => set({ companyId: null, orgId: null })
    }),
    {
      name: 'erp_context'
    }
  )
)
