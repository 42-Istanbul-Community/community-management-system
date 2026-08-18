import { useRef, useState } from 'react'
import { Link } from 'react-router'

import { MobileMenu } from './MobileMenu'
import type { NavLink } from './Navbar.types'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { Logo } from '@/components/layout/Logo'
import { Container, buttonStyles } from '@/components/ui'
import { paths } from '@/routes/paths/paths'
import { Menu, X } from 'lucide-react'

const navLinks: NavLink[] = [
  { label: 'Başlarken', href: '#to-begin-with' },
  { label: 'Keşfet', href: '#discover' },
  { label: 'SSS', href: '#faq' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur-[10px]">
      <Container className="flex h-18 items-center justify-between gap-8">
        <Logo />

        <nav className="hidden items-center gap-7.5 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-body hover:text-primary-700 font-medium text-neutral-700 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3.5 lg:flex">
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
          className="flex cursor-pointer items-center justify-center rounded-sm p-2 text-neutral-700 transition-colors hover:bg-neutral-100 lg:hidden"
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
