import { useEffect, useRef } from 'react'
import { Link } from 'react-router'

import type { BadgeTone } from '@/components/ui'
import { Badge, Button, Container, EmptyState } from '@/components/ui'
import type { CommunityRequestStatus } from '@/features/communities/api'
import { useCommunityRequests } from '@/features/communities/hooks'
import { useDocumentTitle } from '@/hooks'
import { paths } from '@/routes/paths'
import { ArrowLeft, Inbox } from 'lucide-react'

const statusLabels: Record<CommunityRequestStatus, string> = {
  pending: 'Yanıt bekliyor',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
}

const statusTones: Record<CommunityRequestStatus, BadgeTone> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'neutral',
}

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function RequestsPage() {
  useDocumentTitle('Başvurularım')

  const {
    data: requests,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCommunityRequests()

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = sentinelRef.current
    if (!element || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage()
      },
      { rootMargin: '200px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage])

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-140">
        <Link
          to={paths.me.root}
          className="text-caption hover:text-primary-700 inline-flex items-center gap-1.5 font-medium text-neutral-600 transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Profilime dön
        </Link>

        <h1 className="font-display text-h2 mt-5 font-semibold tracking-[-0.02em]">
          Başvurularım
        </h1>
        <p className="text-body-lg mt-3 text-neutral-700">
          Kulüp açma taleplerinizin durumunu buradan takip edebilirsiniz.
        </p>

        <div className="mt-10">
          {isPending ? (
            <p className="text-body text-neutral-600">Yükleniyor...</p>
          ) : requests && requests.length > 0 ? (
            <>
              <ul className="flex flex-col gap-3">
                {requests.map((request) => (
                  <li
                    key={request.id}
                    className="rounded-lg border border-neutral-200 bg-white p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-body font-medium text-neutral-900">
                          {request.name}
                        </p>
                        <p className="text-caption mt-1 text-neutral-500">
                          {dateFormatter.format(new Date(request.created_at))}{' '}
                          tarihinde gönderildi
                        </p>
                      </div>

                      <Badge tone={statusTones[request.status]}>
                        {statusLabels[request.status]}
                      </Badge>
                    </div>

                    {request.description && (
                      <p className="text-caption mt-3 line-clamp-2 text-neutral-600">
                        {request.description}
                      </p>
                    )}

                    {request.message && (
                      <p className="text-caption mt-3 border-t border-neutral-100 pt-3 text-neutral-600">
                        <span className="font-medium text-neutral-700">
                          Mesajınız:{' '}
                        </span>
                        {request.message}
                      </p>
                    )}
                  </li>
                ))}
              </ul>

              <div ref={sentinelRef} aria-hidden="true" className="h-px" />

              {isFetchingNextPage && (
                <p className="text-caption mt-4 text-center text-neutral-500">
                  Yükleniyor…
                </p>
              )}
            </>
          ) : (
            <EmptyState
              icon={<Inbox size={22} aria-hidden="true" />}
              title="Henüz bir başvurunuz yok"
              description="Kulüp açma talebi oluşturduğunuzda burada görünecek."
              action={
                <Link to={paths.me.newCommunity}>
                  <Button variant="secondary">Kulüp aç</Button>
                </Link>
              }
            />
          )}
        </div>
      </div>
    </Container>
  )
}
