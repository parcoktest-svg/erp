import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { authApi } from '@/utils/api'

const TOKEN_KEY = 'erp_token'
const ROLE_KEY = 'erp_role'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: Cookies.get(TOKEN_KEY) || '',
    role: Cookies.get(ROLE_KEY) || ''
  }),
  getters: {
    isAuthenticated: (s) => Boolean(s.token)
  },
  actions: {
    async login({ email, password }) {
      const res = await authApi.signin({ email, password })
      const token = res?.jwt || res?.token || ''
      if (!token) throw new Error('Login failed: token not found in response')

      this.token = token
      this.role = res?.role || ''
      Cookies.set(TOKEN_KEY, this.token)
      if (this.role) Cookies.set(ROLE_KEY, this.role)
    },
    logout() {
      this.token = ''
      this.role = ''
      Cookies.remove(TOKEN_KEY)
      Cookies.remove(ROLE_KEY)
    }
  }
})
