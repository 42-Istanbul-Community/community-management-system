import { useAuthStore } from '@/stores'
import axios from 'axios'

const DEBUG = import.meta.env.DEV

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

client.interceptors.request.use((config) => {
  const { token, user } = useAuthStore.getState()

  if (token) config.headers.Authorization = `Bearer ${token}`
  if (user) {
    config.headers['X-User-ID'] = user.id
    config.headers['X-User-Role'] = user.role
  }

  if (DEBUG) {
    const method = config.method?.toUpperCase()
    console.groupCollapsed(`→ ${method} ${config.url}`)
    console.log('headers', {
      'X-User-ID': config.headers['X-User-ID'],
      'X-User-Role': config.headers['X-User-Role'],
    })
    if (config.data) console.log('body', config.data)
    console.groupEnd()
  }

  return config
})

client.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.groupCollapsed(`← ${response.status} ${response.config.url}`)
      console.log(response.data)
      console.groupEnd()
    }

    return response
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (DEBUG) {
        console.groupCollapsed(
          `× ${error.response?.status ?? '?'} ${error.config?.url}`,
        )
        console.log(error.response?.data ?? error.message)
        console.groupEnd()
      }

      if (error.response?.status === 401) {
        useAuthStore.getState().clear()
      }
    }

    return Promise.reject(error)
  },
)
