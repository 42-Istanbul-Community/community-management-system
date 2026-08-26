import { Outlet, useParams } from 'react-router'

import { CommunityHeader } from '../CommunityHeader'
import type { CommunityOutletContext } from './CommunityLayout.types'
import { Container } from '@/components/ui'
import { useDocumentTitle } from '@/hooks'
import { clubs } from '@/mocks'
import { CommunityTabs } from '@/pages/CommunityTabs'

export default function CommunityLayout() {
  const { slug } = useParams<{ slug: string }>()
  const club = clubs.find((item) => item.slug === slug)

  useDocumentTitle(club?.name ?? 'Kulüp bulunamadı')

  if (!club) {
    return (
      <Container className="py-14">
        <h1 className="font-display text-h2 font-semibold tracking-tight">
          Kulüp bulunamadı
        </h1>
        <p className="text-body-lg mt-3 text-neutral-700">
          Aradığınız kulüp kaldırılmış olabilir.
        </p>
      </Container>
    )
  }

  const context: CommunityOutletContext = { club }

  return (
    <div className="pb-20">
      <CommunityHeader club={club} />

      <Container className="mt-8">
        <p className="text-body-lg max-w-160 text-neutral-700">
          {club.description}
        </p>

        <div className="mt-10">
          <CommunityTabs slug={club.slug} />

          <div className="pt-8">
            <Outlet context={context} />
          </div>
        </div>
      </Container>
    </div>
  )
}
