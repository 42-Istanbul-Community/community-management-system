import type { AuthUser } from './authStore.types'

export function decodeToken(token: string): AuthUser | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    const normalized = payload.replace(/-/g, '+').replace(/-/g, '/')
    const decoded = JSON.parse(atob(normalized)) as {
      user_id?: string
      role?: string
      exp?: number
    }
    if (!decoded.user_id) return null
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null

    return { id: decoded.user_id, role: decoded.role ?? 'normal' }
  } catch {
    return null
  }
}
