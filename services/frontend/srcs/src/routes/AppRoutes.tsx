import { Route, Routes } from 'react-router'

import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { RouteAnnouncer } from '@/components/shell/RouteAnnouncer'
import {
  ExchangePage,
  HomePage,
  LoginPage,
  NotFoundPage,
  PrivacyPage,
  RegisterPage,
  TermsPage,
} from '@/pages'
import { paths } from '@/routes/paths'
import { communityRoutes, meRoutes, superadminRoutes } from '@/routes/uri'

export function AppRoutes() {
  return (
    <>
      <RouteAnnouncer />

      <Routes>
        <Route element={<AppLayout />}>
          <Route path={paths.home} element={<HomePage />} />

          {communityRoutes()}
          {meRoutes()}
          {superadminRoutes()}

          <Route path={paths.privacy} element={<PrivacyPage />} />
          <Route path={paths.terms} element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path={paths.login} element={<LoginPage />} />
          <Route path={paths.register} element={<RegisterPage />} />
          <Route path={paths.exchange} element={<ExchangePage />} />
        </Route>
      </Routes>
    </>
  )
}
