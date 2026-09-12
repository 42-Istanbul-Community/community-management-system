import { Route, Routes } from 'react-router'

import { RequireAuth, RequireRole } from './guards'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { CommunityLayout } from '@/components/layout/CommunityLayout'
import { RouteAnnouncer } from '@/components/shell/RouteAnnouncer'
import {
  AnnouncementDetailPage,
  AnnouncementsPage,
  ApplicationsPage,
  CommunitiesPage,
  CommunityRequestsPage,
  EventDetailPage,
  EventsPage,
  ExchangePage,
  HomePage,
  LoginPage,
  MeEditPage,
  MePage,
  MembersPage,
  NewCommunityPage,
  NotFoundPage,
  OverviewPage,
  PrivacyPage,
  RegisterPage,
  RequestsPage,
  SettingsPage,
  SuperAdminPage,
  TermsPage,
  UsersPage,
} from '@/pages'
import { paths } from '@/routes/paths'

export function AppRoutes() {
  return (
    <>
      <RouteAnnouncer />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path={paths.home} element={<HomePage />} />
          <Route path={paths.communities.root} element={<CommunitiesPage />} />

          <Route path={paths.patterns.community} element={<CommunityLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route
            path={paths.patterns.announcement}
            element={<AnnouncementDetailPage />}
          />
          <Route path={paths.patterns.event} element={<EventDetailPage />} />

          <Route element={<RequireAuth />}>
            <Route path={paths.me.root} element={<MePage />} />
            <Route path={paths.me.edit} element={<MeEditPage />} />
            <Route path={paths.me.requests} element={<RequestsPage />} />
            <Route
              path={paths.me.newCommunity}
              element={<NewCommunityPage />}
            />
          </Route>

          <Route element={<RequireRole role="super_admin" />}>
            <Route path={paths.superadmin.root} element={<SuperAdminPage />} />
            <Route
              path={paths.superadmin.communityRequests}
              element={<CommunityRequestsPage />}
            />
            <Route path={paths.superadmin.users} element={<UsersPage />} />
          </Route>

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
