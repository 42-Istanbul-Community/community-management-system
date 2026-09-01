import { Outlet, useParams } from 'react-router'

import { Container } from '@/components/ui'
import { CommunityTabs } from '@/features/communities'
import { CommunityHeader } from '@/features/communities/components'
import { useCommunity } from '@/features/communities/hooks'
import type { CommunityOutletContext } from '@/features/communities/hooks'
import { useDocumentTitle } from '@/hooks'

export function CommunityLayout() {
  const { slug } = useParams<{ slug: string }>()
  const { data: community, isPending } = useCommunity(slug)

  useDocumentTitle(community?.name ?? 'Kulüp')

  if (isPending) {
    return (
      <Container className="py-14">
        <p className="text-body text-neutral-600">Yükleniyor…</p>
      </Container>
    )
  }

  if (!community) {
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

  const context: CommunityOutletContext = { community }

  return (
    <div className="pb-20">
      <CommunityHeader community={community} />

      <Container className="mt-8">
        <p className="text-body-lg max-w-160 text-neutral-700">
          {community.description}
        </p>

        <div className="mt-10">
          <CommunityTabs slug={community.slug} />

          <div className="pt-8">
            <Outlet context={context} />
          </div>
        </div>
      </Container>
    </div>
  )
}
