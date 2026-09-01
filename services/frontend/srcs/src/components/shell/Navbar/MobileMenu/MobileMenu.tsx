import { useEffect } from 'react'
import { Link, NavLink as RouterNavLink } from 'react-router'

import type { MobileMenuProps } from './MobileMenu.types'
import { LanguageSwitcher } from '@/components/shell'
import { buttonStyles } from '@/components/ui'
import { cn } from '@/lib'
import { paths } from '@/routes'
import { FocusScope } from '@radix-ui/react-focus-scope'

export function MobileMenu({ links, onClose }: MobileMenuProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

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
      </div>
    </FocusScope>
  )
}
