import { Route, Routes } from 'react-router'

import { paths } from './paths'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { RouteAnnouncer } from '@/components/layout/RouteAnnouncer'
import CommunitiesPage from '@/pages/CommunitiesPage'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'
import RegisterPage from '@/pages/RegisterPage'

export function AppRoutes() {
  return (
    <>
      <RouteAnnouncer />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path={paths.home} element={<HomePage />} />
          <Route path={paths.communities} element={<CommunitiesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path={paths.login} element={<LoginPage />} />
          <Route path={paths.register} element={<RegisterPage />} />
        </Route>
      </Routes>
    </>
  )
}
