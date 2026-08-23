import { EventCard } from '../EventCard'
import type { EventsTabProps } from './EventsTab.types'
import { EmptyState } from '@/components/ui'
import { CalendarClock } from 'lucide-react'

export function EventsTab({ events }: EventsTabProps) {
  const sorted = [...events].sort((a, b) => a.startAt.localeCompare(b.startAt))

  return events.length === 0 ? (
    <EmptyState
      icon={<CalendarClock size={22} aria-hidden="true" />}
      title="Yaklaşan etkinlik yok"
      description="Yeni bir etkinlik planladığında burada görünecek"
    />
  ) : (
    <div className="flex flex-col gap-4">
      {sorted.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
