import type {
  ExchangeResponse,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from './auth.types'
import { apiRequest } from '@/lib'

export function login(payload: LoginPayload) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export function register({ email, password, name, picture }: RegisterPayload) {
  const formData = new FormData()
  formData.append('email', email)
  formData.append('password', password)
  formData.append('name', name)

  if (picture) formData.append('picture', picture)

  return apiRequest<RegisterResponse>('/orchestration/register', {
    method: 'POST',
    body: formData,
  })
}

export function exchange(token: string) {
  return apiRequest<ExchangeResponse>('/orchestration/exchange', {
    method: 'POST',
    body: { token },
  })
}
