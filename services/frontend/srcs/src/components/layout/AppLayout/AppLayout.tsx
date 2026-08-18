import { Outlet } from 'react-router'

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <a
        href="#main-content"
        className="focus:bg-primary-600 focus:text-caption sr-only focus:not-sr-only focus:fixed focus:inset-s-4 focus:top-9 focus:z-100 focus:-translate-y-1/2 focus:rounded-md focus:px-4 focus:py-2.5 focus:font-medium focus:text-white focus:shadow-md"
      >
        Ana içeriğe geç
      </a>

      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
