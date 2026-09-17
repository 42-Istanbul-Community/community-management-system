import { useAuthStore } from '@/stores'
import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

const DEVELOPMENT = import.meta.env.VITE_ENVIRONMENT === 'development'

function readBody(data: unknown) {
  if (data instanceof FormData) return Object.fromEntries(data.entries())
  return data
}

function trace(
  config: InternalAxiosRequestConfig,
  status: number | string,
  statusText: string,
  body: unknown,
  isError: boolean,
) {
  console.groupCollapsed(
    `%c${status} ${statusText.toUpperCase()}%c | %c${config.method?.toUpperCase()} ${config.url}`,
    `color: ${isError ? '#e5484d' : '#30a46c'}; font-weight: bold`,
    'color: #888; font-weight: bold',
    'color: inherit; font-weight: bold',
  )

  console.log('headers', {
    Authorization: config.headers?.Authorization,
    'X-User-ID': config.headers?.['X-User-ID'],
    'X-User-Role': config.headers?.['X-User-Role'],
  })

  if (config.data) console.log('request', readBody(config.data))
  console.log('response', body)
  console.groupEnd()
}

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

  return config
})

client.interceptors.response.use(
  (response) => {
    if (DEVELOPMENT)
      trace(
        response.config,
        response.status,
        response.statusText,
        response.data,
        false,
      )
    return response
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (DEVELOPMENT && error.config) {
        trace(
          error.config,
          error.response?.status ?? 'network',
          error.response?.statusText ?? 'UNKNOWN',
          error.response?.data ?? error.message,
          true,
        )
      }

      const status = error.response?.status
      const isStaleSession =
        status === 401 || (status === 404 && error.config?.url === '/id/')

      if (isStaleSession) {
        useAuthStore.getState().clear()
      }
    }

    return Promise.reject(error)
  },
)
