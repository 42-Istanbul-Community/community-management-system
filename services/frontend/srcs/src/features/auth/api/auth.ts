import type {
  ExchangeResponse,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from './auth.types'
import { apiRequest } from '@/lib'
import type { AxiosProgressEvent } from 'axios'

/**
 * POST /auth/login
 * Signs in with an email and a password.
 */
export function login(payload: LoginPayload) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  })
}

/**
 * POST /orchestration/register
 * Creates an account. The picture is optional and can be changed later.
 */
export function register(
  { email, password, name, picture }: RegisterPayload,
  onUploadProgress?: (event: AxiosProgressEvent) => void,
) {
  const formData = new FormData()
  formData.append('email', email)
  formData.append('password', password)
  formData.append('name', name)

  if (picture) formData.append('picture', picture)

  return apiRequest<RegisterResponse>('/orchestration/register', {
    method: 'POST',
    body: formData,
    onUploadProgress,
  })
}

/**
 * POST /orchestration/exchange
 * Turns the one-time token from a 42 or Google sign-in into a session
 * token. The token only works once.
 */
export function exchange(token: string) {
  return apiRequest<ExchangeResponse>('/orchestration/exchange', {
    method: 'POST',
    body: { token },
  })
}
