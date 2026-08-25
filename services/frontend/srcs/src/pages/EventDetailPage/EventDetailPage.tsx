import { useState } from 'react'
import { useParams } from 'react-router'

import {
  AttachmentList,
  Breadcrumb,
  Button,
  Container,
  ProgressBar,
} from '@/components/ui'
import { useDocumentTitle } from '@/hooks'
import { clubs, events } from '@/mocks'
import { paths } from '@/routes'
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react'

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('tr-TR', {
  hour: '2-digit',
  minute: '2-digit',
})

export default function EventDetailPage() {
  const { slug, id } = useParams<{ slug: string; id: string }>()
  const [now] = useState(() => Date.now())

  const club = clubs.find((item) => item.slug === slug)
  const event = events.find(
    (item) => item.id === id && item.communitySlug === slug,
  )

  useDocumentTitle(event?.title ?? 'Etkinlik Bulunamadı')

  if (!club || !event) {
    return (
      <Container className="py-14">
        <h1 className="font-display text-h2 font-semibold tracking-tight">
          Etkinlik bulunamadı
        </h1>
        <p className="text-body-lg mt-3 text-neutral-700">
          Aradığınız etkinlik kaldırılmış olabilir.
        </p>
      </Container>
    )
  }

  const startDate = new Date(event.startAt)
  const endDate = event.endAt ? new Date(event.endAt) : null
  const isFull =
    event.capacity !== null && event.participantCount >= event.capacity
  const isPast = startDate.getTime() < now

  const timeRange = endDate
    ? `${timeFormatter.format(startDate)} - ${timeFormatter.format(endDate)}`
    : timeFormatter.format(startDate)

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-180">
        <Breadcrumb
          items={[
            { label: 'Kulüpler', to: paths.communities },
            { label: club.name, to: paths.community(club.slug) },
            { label: 'Etkinlik' },
          ]}
        />

        <article className="mt-8">
          <h1 className="font-display text-h2 font-semibold tracking-[-0.02em]">
            {event.title}
          </h1>
          <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
            <dl className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <dt className="shrink-0">
                  <CalendarDays
                    size={17}
                    className="text-neutral-500"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Tarih</span>
                </dt>
                <dd className="text-body text-neutral-800">
                  {dateFormatter.format(startDate)}
                </dd>
              </div>

              <div className="flex items-center gap-3">
                <dt className="shrink-0">
                  <Clock
                    size={17}
                    className="text-neutral-500"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Saat</span>
                </dt>
                <dd className="text-body text-neutral-800">{timeRange}</dd>
              </div>

              {event.location && (
                <div className="flex items-center gap-3">
                  <dt className="shrink-0">
                    <MapPin
                      size={17}
                      className="text-neutral-500"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Konum</span>
                  </dt>
                  <dd className="text-body text-neutral-800">
                    {event.location}
                  </dd>
                </div>
              )}

              <div className="flex items-center gap-3">
                <dt className="shrink-0">
                  <Users
                    size={17}
                    className="text-neutral-500"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Katılım</span>
                </dt>
                <dd className="min-w-0 flex-1">
                  {event.capacity !== null ? (
                    <ProgressBar
                      value={event.participantCount}
                      max={event.capacity}
                      label={`${event.capacity} kişilik kontenjanın ${event.participantCount} tanesi doldu`}
                      className="max-w-80"
                    />
                  ) : (
                    <span className="text-body text-neutral-800">
                      {event.participantCount} kişi katılıyor
                    </span>
                  )}
                </dd>
              </div>
            </dl>

            <div className="mt-5 border-t border-neutral-100 pt-5">
              {isPast ? (
                <Button disabled size="lg" className="w-full sm:w-auto">
                  Etkinlik sona erdi
                </Button>
              ) : isFull ? (
                <Button disabled size="lg" className="w-full sm:w-auto">
                  Kontenjan doldu
                </Button>
              ) : (
                <Button size="lg" className="w-full">
                  Katıl
                </Button>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 text-[17px] leading-[1.75] text-neutral-800">
            {event.description.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <AttachmentList attachments={event.attachments} />
        </article>
      </div>
    </Container>
  )
}
