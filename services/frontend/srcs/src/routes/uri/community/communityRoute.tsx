import { Route } from 'react-router'

import { CommunityLayout } from '@/components/layout/CommunityLayout'
import {
  AnnouncementDetailPage,
  AnnouncementsPage,
  ApplicationsPage,
  CommunitiesPage,
  EventDetailPage,
  EventsPage,
  MembersPage,
  OverviewPage,
  SettingsPage,
} from '@/pages'
import { paths } from '@/routes/paths'

const { root, patterns, segments } = paths.communities

export function communityRoutes() {
  return (
    <>
      <Route path={root} element={<CommunitiesPage />} />

      <Route path={patterns.detail} element={<CommunityLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path={segments.announcements} element={<AnnouncementsPage />} />
        <Route path={segments.events} element={<EventsPage />} />
        <Route path={segments.members} element={<MembersPage />} />
        <Route path={segments.applications} element={<ApplicationsPage />} />
        <Route path={segments.settings} element={<SettingsPage />} />
      </Route>

      <Route
        path={patterns.announcement}
        element={<AnnouncementDetailPage />}
      />
      <Route path={patterns.event} element={<EventDetailPage />} />
    </>
  )
}
