import Cookies from 'js-cookie'
import { create } from 'zustand'
import { authApi } from '@/utils/api'

const TOKEN_KEY = 'erp_token'
const ROLE_KEY = 'erp_role'

type AuthState = {
  token: string
  role: string
  isAuthenticated: boolean
  login: (input: { email: string; password: string }) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: Cookies.get(TOKEN_KEY) || '',
  role: Cookies.get(ROLE_KEY) || '',
  isAuthenticated: Boolean(Cookies.get(TOKEN_KEY) || ''),
  login: async ({ email, password }) => {
    const res = await authApi.signin({ email, password })
    const token = res?.jwt || res?.token || ''
    if (!token) throw new Error('Login failed: token not found in response')

    const role = res?.role || ''

    Cookies.set(TOKEN_KEY, token)
    if (role) Cookies.set(ROLE_KEY, role)

    set({ token, role, isAuthenticated: true })
  },
  logout: () => {
    Cookies.remove(TOKEN_KEY)
    Cookies.remove(ROLE_KEY)
    set({ token: '', role: '', isAuthenticated: false })
  }
}))
