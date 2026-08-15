import { Outlet } from 'react-router'

import { Footer } from '../Footer/Footer'
import { Navbar } from '@/components/layout/Navbar'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
