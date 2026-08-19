import { Link } from 'react-router'

import { FooterColumn } from './FooterColumn'
import { Container } from '@/components/ui'
import { paths } from '@/routes/paths/paths'

const productLinks = [{ label: 'Kulüpler', to: paths.communities }]

const communityLinks = [
  { label: 'GitHub', href: 'https://github.com/42-Istanbul-Community' },
  {
    label: 'Katkıda bulunun',
    href: 'https://github.com/42-Istanbul-Community/community-management-system',
  },
  { label: 'Sürüm notları', href: '#' },
]

const legalLinks = [
  { label: 'Gizlilik Politikası', to: paths.privacy },
  { label: 'Kullanım Şartları', to: paths.terms },
]

export function Footer() {
  return (
    <footer className="bg-neutral-900 pt-18 pb-8">
      <Container>
        <div className="grid gap-10 pb-11 sm:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="sm:col-span-3 lg:col-span-1">
            <Link
              to={paths.home}
              className="font-display text-[22px] font-bold tracking-tight text-white"
            >
              cms<span className="text-primary-600">.</span>
            </Link>
            <p className="mt-3.5 max-w-70 text-[14px] leading-[1.65] text-neutral-400">
              Öğrenci kulüpleri için açık kaynak topluluk yönetim sistemi.
            </p>
          </div>
          <FooterColumn title="Ürün">
            {productLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-[14px] text-neutral-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </FooterColumn>
          <FooterColumn title="Topluluk">
            {communityLinks.map((link) => {
              const isExternal = link.href.startsWith('http')

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="text-[14px] text-neutral-400 transition-colors hover:text-white"
                >
                  {link.label}
                  {isExternal && (
                    <span className="sr-only"> (yeni sekmede açılır)</span>
                  )}
                </a>
              )
            })}
          </FooterColumn>
          <FooterColumn title="Yasal">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-[14px] text-neutral-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </FooterColumn>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-700 pt-6 max-sm:justify-center max-sm:text-center">
          <span className="text-caption text-neutral-400">
            © 2026 CMS · Tüm hakları saklıdır.
          </span>
          <span className="text-caption text-neutral-400">
            AGPL-3.0 ile açık kaynak · katkılarınızı bekliyoruz.
          </span>
        </div>
      </Container>
    </footer>
  )
}
