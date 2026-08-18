import { useEffect } from 'react'
import { Link } from 'react-router'

import type { MobileMenuProps } from './MobileMenu.types'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { buttonStyles } from '@/components/ui'
import { paths } from '@/routes/paths'
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
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="text-body hover:text-primary-700 py-3 font-medium text-neutral-700 transition-colors"
            >
              {link.label}
            </a>
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
