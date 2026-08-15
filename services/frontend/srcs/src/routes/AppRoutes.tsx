import { Route, Routes } from 'react-router'

import { paths } from './paths'
import { AppLayout } from '@/components/layout/AppLayout'
import HomePage from '@/pages/HomePage/HomePage'
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={paths.home} element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
