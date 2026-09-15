import { Link, Outlet, useParams } from 'react-router'

import { Button, Container, EmptyState } from '@/components/ui'
import { CommunityTabs } from '@/features/communities'
import { CommunityHeader } from '@/features/communities/components'
import { useCommunity } from '@/features/communities/hooks'
import type { CommunityOutletContext } from '@/features/communities/hooks'
import { useDocumentTitle } from '@/hooks'
import { ApiError } from '@/lib'
import { paths } from '@/routes/paths'
import { Lock, SearchX } from 'lucide-react'

export function CommunityLayout() {
  const { slug } = useParams<{ slug: string }>()
  const { data: community, isPending, error } = useCommunity(slug)

  useDocumentTitle(community?.name ?? 'Kulüp')

  if (isPending) {
    return (
      <Container className="py-14">
        <p className="text-body text-neutral-600">Yükleniyor…</p>
      </Container>
    )
  }

  if (!community) {
    const isForbidden = error instanceof ApiError && error.status === 403

    return (
      <Container className="py-14">
        <EmptyState
          icon={
            isForbidden ? (
              <Lock size={22} aria-hidden="true" />
            ) : (
              <SearchX size={22} aria-hidden="true" />
            )
          }
          title={isForbidden ? 'Bu kulübe erişiminiz yok' : 'Kulüp bulunamadı'}
          description={
            isForbidden
              ? 'Bu özel kulübü görüntülemek için üye olmanız gerekiyor.'
              : 'Aradığınız kulüp kaldırılmış olabilir.'
          }
          action={
            <Link to={paths.communities.root}>
              <Button variant="secondary">Kulüplere geri dön</Button>
            </Link>
          }
        />
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
          <CommunityTabs slug={community.slug} communityId={community.id} />

          <div className="pt-8">
            <Outlet context={context} />
          </div>
        </div>
      </Container>
    </div>
  )
}
