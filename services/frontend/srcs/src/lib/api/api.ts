import { ApiError } from './ApiError'
import type { ApiErrorBody, RequestOptions } from './api.types'
import { useAuthStore } from '@/stores'

const BASE_URL = import.meta.env.VITE_API_URL

function extractMessage(body: ApiErrorBody): string | undefined {
  if (typeof body.error === 'string') return body.error
  if (typeof body.detail === 'string') return body.detail

  if (typeof body.message === 'string') return body.message
  if (body.message && typeof body.message === 'object')
    return body.message.error

  return undefined
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body } = options

  const { token, user, clear } = useAuthStore.getState()
  const authToken = options.token ?? token

  const isFormData = body instanceof FormData
  const headers: Record<string, string> = {}

  if (authToken) headers.Authorization = `Bearer ${authToken}`

  if (user) headers['X-User-ID'] = user.id

  if (body && !isFormData) headers['Content-Type'] = 'application/json'

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401) clear()

    throw new ApiError(
      extractMessage(data ?? {}) ?? 'Beklenmeyen bir hata oluştu.',
      response.status,
    )
  }

  return data as T
}
