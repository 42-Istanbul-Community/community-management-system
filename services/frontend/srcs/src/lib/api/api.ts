import { ApiError } from './ApiError'
import type { ApiErrorBody, RequestOptions } from './api.types'
import { client } from './client'
import axios from 'axios'

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
  const { method = 'GET', body, token } = options

  try {
    const response = await client.request<T>({
      url: path,
      method,
      data: body,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0
      const data = (error.response?.data ?? {}) as ApiErrorBody

      throw new ApiError(
        extractMessage(data) ?? 'Beklenmeyen bir hata oluştu.',
        status,
      )
    }

    throw error
  }
}
