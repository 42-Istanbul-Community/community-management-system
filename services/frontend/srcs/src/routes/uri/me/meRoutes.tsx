import { Route } from 'react-router'

import { MeEditPage, MePage, NewCommunityPage, RequestsPage } from '@/pages'
import { RequireAuth } from '@/routes/guards'
import { paths } from '@/routes/paths'

export function meRoutes() {
  return (
    <Route element={<RequireAuth />}>
      <Route path={paths.me.root} element={<MePage />} />
      <Route path={paths.me.edit} element={<MeEditPage />} />
      <Route path={paths.me.requests} element={<RequestsPage />} />
      <Route path={paths.me.newCommunity} element={<NewCommunityPage />} />
    </Route>
  )
}
