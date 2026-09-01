import { Link, Outlet } from 'react-router'

import { Logo } from '@/components/layout'
import { paths } from '@/routes'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-105">
          <header className="mb-8 flex justify-center">
            <Logo />
          </header>
          <main className="rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
            <Outlet />
          </main>
          <footer className="mt-6 flex justify-center gap-5">
            <Link
              to={paths.privacy}
              className="text-caption text-neutral-500 underline-offset-4 transition-colors hover:text-neutral-800 hover:underline"
            >
              Gizlilik Politikası
            </Link>
            <Link
              to={paths.terms}
              className="text-caption text-neutral-500 underline-offset-4 transition-colors hover:text-neutral-800 hover:underline"
            >
              Kullanım Şartları
            </Link>
          </footer>
        </div>
      </div>
    </div>
  )
}
