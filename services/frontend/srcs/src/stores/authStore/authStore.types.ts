import type { UserRole } from '@/features/auth/api'

export type AuthUser = {
  id: string
  role: UserRole
}

export type AuthState = {
  token: string | null
  user: AuthUser | null
  setToken: (token: string) => void
  clear: () => void
}
