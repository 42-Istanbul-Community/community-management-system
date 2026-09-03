import { useEffect } from 'react'
import { Link, NavLink as RouterNavLink, useNavigate } from 'react-router'

import type { MobileMenuProps } from './MobileMenu.types'
import { LanguageSwitcher } from '@/components/shell'
import { Avatar, buttonStyles } from '@/components/ui'
import { useUser } from '@/features/auth/hooks'
import { cn, getInitials } from '@/lib'
import { paths } from '@/routes'
import { useAuthStore } from '@/stores'
import { FocusScope } from '@radix-ui/react-focus-scope'
import { LogOut, User } from 'lucide-react'

export function MobileMenu({ links, onClose }: MobileMenuProps) {
  const navigate = useNavigate()
  const clear = useAuthStore((state) => state.clear)
  const userId = useAuthStore((state) => state.user?.id)
  const { data: me } = useUser(userId)

  const isAuthenticated = Boolean(userId)
  const name = me?.name ?? ''

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  function handleLogout() {
    clear()
    onClose()
    navigate(paths.home)
  }

  return (
    <FocusScope trapped loop asChild>
      <div
        id="mobile-menu"
        className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-neutral-200 bg-neutral-50 lg:hidden"
      >
        <nav className="flex flex-col px-8 py-4">
          {links.map((link) => (
            <RouterNavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'text-body py-3 font-medium transition-colors',
                  isActive
                    ? 'text-primary-700'
                    : 'hover:text-primary-700 text-neutral-700',
                )
              }
            >
              {link.label}
            </RouterNavLink>
          ))}
        </nav>

        {isAuthenticated ? (
          <div className="border-t border-neutral-200 px-8 py-5">
            <div className="flex items-center gap-3">
              <Avatar
                initials={getInitials(name)}
                src={me?.picture}
                name={name}
                size="sm"
                className="h-10 w-10 rounded-md text-[13px]"
              />
              {name && (
                <p className="text-body font-medium text-neutral-900">{name}</p>
              )}
            </div>

            <div className="mt-4 flex flex-col">
              <Link
                to={paths.me.root}
                onClick={onClose}
                className="text-body hover:text-primary-700 flex items-center gap-2.5 py-3 font-medium text-neutral-700 transition-colors"
              >
                <User size={16} aria-hidden="true" />
                Profilim
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="text-body text-danger flex cursor-pointer items-center gap-2.5 py-3 font-medium transition-opacity hover:opacity-80"
              >
                <LogOut size={16} aria-hidden="true" />
                Çıkış yap
              </button>
            </div>

            <div className="mt-4 border-t border-neutral-200 pt-4">
              <LanguageSwitcher />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 border-t border-neutral-200 px-8 py-5">
            <LanguageSwitcher />
            <Link
              to={paths.login}
              onClick={onClose}
              className={buttonStyles({ variant: 'secondary' })}
            >
              Giriş Yap
            </Link>
            <Link
              to={paths.register}
              onClick={onClose}
              className={buttonStyles()}
            >
              Kayıt Ol
            </Link>
          </div>
        )}
      </div>
    </FocusScope>
  )
}
