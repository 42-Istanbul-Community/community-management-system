import type { AuthUser } from './authStore.types'
import type { JwtPayload } from './decodeToken.types'
import type { UserRole } from '@/features/auth'
import { jwtDecode } from 'jwt-decode'

const roles: UserRole[] = ['super_admin', 'normal']

function isUserRole(value: unknown): value is UserRole {
  return roles.includes(value as UserRole)
}

export function decodeToken(token: string): AuthUser | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token)

    if (!decoded.user_id) return null
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null

    return {
      id: decoded.user_id,
      role: isUserRole(decoded.role) ? decoded.role : 'normal',
    }
  } catch {
    return null
  }
}
