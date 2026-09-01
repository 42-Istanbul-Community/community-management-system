import { Link } from 'react-router'

import { HeroPreviewCard } from './HeroPreviewCard'
import { Container, buttonStyles } from '@/components/ui'
import { paths } from '@/routes'
import { Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <Container className="flex flex-wrap items-center gap-12 pt-24 pb-26">
      <div className="min-w-80 flex-1 basis-125">
        <span className="bg-primary-100 text-caption text-primary-700 mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-medium">
          <Sparkles className="size-3.5" />
          Ücretsiz ve açık kaynak
        </span>
        <h1 className="font-display text-display font-semibold tracking-tight text-neutral-900">
          Kulübünüzü tek bir yerden yönetin.
        </h1>
        <p className="text-body-lg mt-5.5 max-w-130 text-neutral-700">
          Duyurular, etkinlikler ve üyelik başvuruları dağınık sohbet
          gruplarında kaybolmasın.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link to={paths.register} className={buttonStyles({ size: 'lg' })}>
            Hemen Başla
          </Link>
          <Link
            to={paths.communities.root}
            className={buttonStyles({ variant: 'secondary', size: 'lg' })}
          >
            Kulüpleri Keşfet
          </Link>
        </div>
      </div>
      <div className="flex min-w-80 flex-1 basis-105 justify-center">
        <HeroPreviewCard />
      </div>
    </Container>
  )
}
