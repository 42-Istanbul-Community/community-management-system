import { Route, Routes } from 'react-router'

import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { CommunityLayout } from '@/components/layout/CommunityLayout'
import { RouteAnnouncer } from '@/components/layout/RouteAnnouncer'
import {
  AnnouncementDetailPage,
  AnnouncementsPage,
  ApplicationsPage,
  CommunitiesPage,
  EventDetailPage,
  EventsPage,
  HomePage,
  LoginPage,
  MembersPage,
  NotFoundPage,
  OverviewPage,
  PrivacyPage,
  RegisterPage,
  SettingsPage,
  TermsPage,
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

          <Route path={paths.privacy} element={<PrivacyPage />} />
          <Route path={paths.terms} element={<TermsPage />} />
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
