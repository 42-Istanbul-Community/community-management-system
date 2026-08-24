import { Link } from 'react-router'

import type { EventCardProps } from './EventCard.types'
import { Button, ProgressBar } from '@/components/ui'
import { paths } from '@/routes/paths'

const dayFormatter = new Intl.DateTimeFormat('tr-TR', { day: 'numeric' })
const monthFormatte = new Intl.DateTimeFormat('tr-TR', { month: 'short' })
const timeFormatter = new Intl.DateTimeFormat('tr-TR', {
  hour: '2-digit',
  minute: '2-digit',
})

export function EventCard({ event }: EventCardProps) {
  const { title, description, startAt, capacity, participantCount } = event
  const date = new Date(startAt)
  const isFull = capacity !== null && participantCount >= capacity

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 sm:flex-row sm:items-start">
      <div className="bg-primary-100 shrink-0 rounded-md px-3 py-2 text-center">
        <p className="font-dislay text-primary-700 text-[20px] leading-none font-bold">
          {dayFormatter.format(date)}
        </p>
        <p className="text-primary-700 mt-1 text-[11px] font-medium uppercase">
          {monthFormatte.format(date)}
        </p>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-display text-[17px] font-semibold">
          <Link
            to={paths.event(event.communitySlug, event.id)}
            className="hover:text-primary-700 transition-colors"
          >
            {title}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[15px] leading-[1.6] text-neutral-600">
          {description}
        </p>

        <p className="text-caption mt-2 text-neutral-500">
          {timeFormatter.format(date)}
        </p>

        {capacity !== null && (
          <ProgressBar
            value={participantCount}
            max={capacity}
            label={`${capacity} kişilik kontenjanın ${participantCount} tanesi doldu`}
            className="mt-3.5 max-w-80"
          />
        )}
      </div>

      <div className="shrink-0">
        {isFull ? (
          <Button size="sm" disabled>
            Kontenjan doldu
          </Button>
        ) : (
          <Button size="sm" variant="secondary">
            Katıl
          </Button>
        )}
      </div>
    </article>
  )
}
