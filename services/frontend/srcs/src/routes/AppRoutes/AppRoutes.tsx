import { Navigate, Route, Routes } from 'react-router'

import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { RouteAnnouncer } from '@/components/layout/RouteAnnouncer'
import {
  AnnouncementDetailPage,
  AnnouncementsPage,
  CommunitiesPage,
  CommunityLayout,
  EventDetailPage,
  EventsPage,
  HomePage,
  LoginPage,
  MembersPage,
  NotFoundPage,
  PrivacyPage,
  RegisterPage,
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
          <Route path={paths.communities} element={<CommunitiesPage />} />

          <Route path={paths.communityPattern} element={<CommunityLayout />}>
            <Route index element={<Navigate to="announcements" replace />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="members" element={<MembersPage />} />
          </Route>

          <Route
            path={paths.announcementPattern}
            element={<AnnouncementDetailPage />}
          />
          <Route path={paths.eventPattern} element={<EventDetailPage />} />

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
