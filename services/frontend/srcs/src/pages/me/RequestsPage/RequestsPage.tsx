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

  const { data: requests, isPending } = useCommunityRequests()
  console.log(requests)

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
          Kulüp katılım ve kulüp açma taleplerinizin durumunu buradan takip
          edebilirsiniz.
        </p>

        <div className="mt-10">
          {isPending ? (
            <p className="text-body text-neutral-600">Yükleniyor...</p>
          ) : requests && requests.length > 0 ? (
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

                  {request.message && (
                    <p className="text-caption mt-3 border-t border-neutral-100 pt-3 text-neutral-600">
                      {request.message}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<Inbox size={22} aria-hidden="true" />}
              title="Henüz bir başvurunuz yok"
              description="Bir kulübe katılma isteği gönderdiğinizde veya kulüp açma talebi oluşturduğunuzda burada görünecek."
              action={
                <Link to={paths.communities.root}>
                  <Button variant="secondary">Kulüpleri keşfet</Button>
                </Link>
              }
            />
          )}
        </div>
      </div>
    </Container>
  )
}
