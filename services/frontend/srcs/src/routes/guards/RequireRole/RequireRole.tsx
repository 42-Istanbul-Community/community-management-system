import { Navigate, Outlet, useLocation } from 'react-router'

import type { RequireRoleProps } from './RequireRole.types'
import { paths } from '@/routes'
import { useAuthStore } from '@/stores'

export function RequireRole({ role }: RequireRoleProps) {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return (
      <Navigate to={paths.login} state={{ from: location.pathname }} replace />
    )
  }

  console.log('user_role: ', user.role)
  if (user.role !== role) {
    return <Navigate to={paths.home} />
  }

  return <Outlet />
}
