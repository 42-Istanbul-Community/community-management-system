import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'

import type { BadgeTone } from '@/components/ui'
import {
  Alert,
  Badge,
  Button,
  Container,
  EmptyState,
  Select,
} from '@/components/ui'
import { useUsers } from '@/features/auth/hooks'
import type { CommunityRequestStatus } from '@/features/communities/api'
import {
  useCommunityRequests,
  useManageCommunityRequests,
} from '@/features/communities/hooks'
import { useDocumentTitle } from '@/hooks'
import { paths } from '@/routes/paths'
import { ArrowLeft, Check, Inbox, X } from 'lucide-react'

type StatusFilter = CommunityRequestStatus | 'all'

const filterOptions = [
  { value: 'pending', label: 'Bekleyenler' },
  { value: 'approved', label: 'Onaylananlar' },
  { value: 'rejected', label: 'Reddedilenler' },
  { value: 'all', label: 'Tümü' },
]

const statusLabels: Record<CommunityRequestStatus, string> = {
  pending: 'Bekliyor',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
}

const statusTones: Record<CommunityRequestStatus, BadgeTone> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
}

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function CommunityRequestsPage() {
  useDocumentTitle('Kulüp talepleri')

  const [filter, setFilter] = useState<StatusFilter>('pending')

  const {
    data: requests,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCommunityRequests()

  const manage = useManageCommunityRequests()

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

  const all = requests ?? []
  const visible =
    filter === 'all' ? all : all.filter((item) => item.status === filter)

  const userIds = all.map((request) => request.user_id)
  const { data: users } = useUsers(userIds)

  function decide(id: string, status: 'approved' | 'rejected') {
    manage.mutate({ requestIds: [{ id, status }] })
  }

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-160">
        <Link
          to={paths.superadmin.root}
          className="text-caption hover:text-primary-700 inline-flex items-center gap-1.5 font-medium text-neutral-600 transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Yönetime dön
        </Link>

        <h1 className="font-display text-h2 mt-5 font-semibold tracking-[-0.02em]">
          Kulüp talepleri
        </h1>
        <p className="text-body-lg mt-3 text-neutral-700">
          Onaylanan talepler yeni bir kulüp olarak yayına alınır.
        </p>

        {manage.error && (
          <Alert tone="danger" className="mt-6">
            {manage.error.message}
          </Alert>
        )}

        <div className="mt-8 flex justify-end">
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as StatusFilter)}
            options={filterOptions}
            ariaLabel="Duruma göre filtrele"
          />
        </div>

        <div className="mt-5">
          {isPending ? (
            <p className="text-body text-neutral-600">Yükleniyor...</p>
          ) : visible.length === 0 ? (
            <EmptyState
              icon={<Inbox size={22} aria-hidden="true" />}
              title="Talep yok"
              description="Bu durumda bekleyen bir kulüp talebi bulunmuyor."
            />
          ) : (
            <>
              <ul className="flex flex-col gap-3">
                {visible.map((request) => (
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
                          {users?.[request.user_id]?.name ?? 'Kullanıcı'} ·{' '}
                          {dateFormatter.format(new Date(request.created_at))}
                        </p>
                      </div>

                      <Badge tone={statusTones[request.status]}>
                        {statusLabels[request.status]}
                      </Badge>
                    </div>

                    {request.description && (
                      <p className="text-caption mt-3 text-neutral-600">
                        {request.description}
                      </p>
                    )}

                    {request.message && (
                      <p className="text-caption mt-3 border-t border-neutral-100 pt-3 text-neutral-600">
                        <span className="font-medium text-neutral-700">
                          Mesaj:{' '}
                        </span>
                        {request.message}
                      </p>
                    )}

                    {request.status === 'pending' && (
                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          disabled={manage.isPending}
                          onClick={() => decide(request.id, 'approved')}
                        >
                          <Check size={15} aria-hidden="true" />
                          Onayla
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={manage.isPending}
                          onClick={() => decide(request.id, 'rejected')}
                        >
                          <X size={15} aria-hidden="true" />
                          Reddet
                        </Button>
                      </div>
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
          )}
        </div>
      </div>
    </Container>
  )
}
