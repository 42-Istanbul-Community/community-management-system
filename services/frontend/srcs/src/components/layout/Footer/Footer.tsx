import { Link } from 'react-router'

import { FooterColumn } from './FooterColumn'
import { Container } from '@/components/ui'
import { paths } from '@/routes/paths'

const productLinks = [
  { label: 'Keşfet', href: '#kesfet' },
  { label: 'Kulüpler', href: '#kulupler' },
  { label: 'Etkinlikler', href: '#etkinlikler' },
  { label: 'Duyurular', href: '#duyurular' },
]

const communityLinks = [
  { label: 'Github', href: 'https://github.com/42-Istanbul-Community' },
  {
    label: 'Katkıda bulunun',
    href: 'https://github.com/42-Istanbul-Community/community-management-system',
  },
  { label: 'Sürüm notları', href: '#' },
]

const legalLinks = [
  { label: 'Gizlilik Politikası', to: '#' },
  { label: 'Kullanım Şartları', to: '#' },
]

export function Footer() {
  return (
    <footer className="bg-neutral-900 pt-18 pb-8">
      <Container>
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-10 pb-11">
          <div>
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
              <a
                key={link.label}
                href={link.href}
                className="text-[14px] text-neutral-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </FooterColumn>
          <FooterColumn title="Topluluk">
            {communityLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[14px] text-neutral-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
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
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-700 pt-6">
          <span className="text-caption text-neutral-500">
            © 2026 CMS · Tüm hakları saklıdır.
          </span>
          <span className="text-caption text-neutral-500">
            AGPL-3.0 ile açık kaynak · katkılarınızı bekliyoruz.
          </span>
        </div>
      </Container>
    </footer>
  )
}
