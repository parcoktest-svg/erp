import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const http = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    (typeof window !== 'undefined' ? `http://${window.location.hostname}:8080` : 'http://localhost:8080')
})

http.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth?.token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})
