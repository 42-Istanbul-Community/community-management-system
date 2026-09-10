import { Navigate, Outlet, useLocation } from 'react-router'

import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores'

export function RequireAuth() {
  const location = useLocation()
  const isAuthenticated = useAuthStore((state) => Boolean(state.user))

  if (!isAuthenticated) {
    return (
      <Navigate to={paths.login} state={{ from: location.pathname }} replace />
    )
  }

  return <Outlet />
}