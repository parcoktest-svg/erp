import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

const COMPANY_KEY = 'erp_company_id'
const ORG_KEY = 'erp_org_id'

export const useContextStore = defineStore('context', {
  state: () => ({
    companyId: Cookies.get(COMPANY_KEY) ? Number(Cookies.get(COMPANY_KEY)) : null,
    orgId: Cookies.get(ORG_KEY) ? Number(Cookies.get(ORG_KEY)) : null
  }),
  actions: {
    setCompanyId(id) {
      this.companyId = id == null ? null : Number(id)
      if (this.companyId == null) Cookies.remove(COMPANY_KEY)
      else Cookies.set(COMPANY_KEY, String(this.companyId))

      this.orgId = null
      Cookies.remove(ORG_KEY)
    },
    setOrgId(id) {
      this.orgId = id == null ? null : Number(id)
      if (this.orgId == null) Cookies.remove(ORG_KEY)
      else Cookies.set(ORG_KEY, String(this.orgId))
    }
  }
})
