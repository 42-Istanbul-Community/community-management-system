import { Link } from 'react-router'

import { Logo } from '@/components/layout/Logo'
import { Container, buttonStyles } from '@/components/ui'
import { paths } from '@/routes/paths'

const navLinks = [
  { label: 'Keşfet', href: '#kesfet' },
  { label: 'Kulüpler', href: '#kulupler' },
  { label: 'Hakkında', href: '#hakkinda' },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur-[10px]">
      <Container className="flex h-18 items-center justify-between gap-8">
        <Logo />

        <nav className="flex items-center gap-7.5">
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

        <div className="flex shrink-0 items-center gap-3.5">
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
      </Container>
    </header>
  )
}
