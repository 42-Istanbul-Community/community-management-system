import { useRef, useState } from 'react'
import { Link, NavLink as RouterNavLink } from 'react-router'

import { MobileMenu } from './MobileMenu'
import type { NavLink } from './Navbar.types'
import { LanguageSwitcher } from '@/components/layout'
import { Logo } from '@/components/layout'
import { Container, buttonStyles } from '@/components/ui'
import { cn } from '@/lib'
import { paths } from '@/routes'
import { Menu, X } from 'lucide-react'

const navLinks: NavLink[] = [{ label: 'Kulüpler', to: paths.communities.root }]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur-[10px]">
      <Container className="flex h-18 items-center gap-8">
        <Logo />

        <nav className="hidden items-center gap-7.5 lg:flex">
          {navLinks.map((link) => (
            <RouterNavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-body font-medium transition-colors',
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

        <div className="ms-auto hidden shrink-0 items-center gap-3.5 lg:flex">
          <LanguageSwitcher />
          <Link
            to={paths.login}
            className="text-body hover:text-primary-700 font-medium text-neutral-700 transition-colors"
          >
            Giriş Yap
          </Link>
          <Link to={paths.register} className={buttonStyles({ size: 'sm' })}>
            Kayıt Ol
          </Link>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          className="ms-auto flex cursor-pointer items-center justify-center rounded-sm p-2 text-neutral-700 transition-colors hover:bg-neutral-100 lg:hidden"
        >
          {isOpen ? (
            <X size={22} aria-hidden="true" />
          ) : (
            <Menu size={22} aria-hidden="true" />
          )}
        </button>
      </Container>

      {isOpen && (
        <MobileMenu
          links={navLinks}
          onClose={() => {
            setIsOpen(false)
            toggleRef.current?.focus()
          }}
        />
      )}
    </header>
  )
}
