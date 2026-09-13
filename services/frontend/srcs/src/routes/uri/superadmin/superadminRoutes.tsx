import { Route } from 'react-router'

import { CommunityRequestsPage, SuperAdminPage, UsersPage } from '@/pages'
import { RequireRole } from '@/routes/guards'
import { paths } from '@/routes/paths'

export function superadminRoutes() {
  return (
    <Route element={<RequireRole role="super_admin" />}>
      <Route path={paths.superadmin.root} element={<SuperAdminPage />} />
      <Route
        path={paths.superadmin.communityRequests}
        element={<CommunityRequestsPage />}
      />
      <Route path={paths.superadmin.users} element={<UsersPage />} />
    </Route>
  )
}
