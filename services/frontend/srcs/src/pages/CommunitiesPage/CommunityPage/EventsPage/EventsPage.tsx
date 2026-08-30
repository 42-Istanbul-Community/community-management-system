import { EmptyState } from '@/components/ui'
import { EventCard } from '@/features/communities/components'
import { events } from '@/mocks'
import { CalendarClock } from 'lucide-react'

export default function EventsPage() {
  const sorted = [...events].sort((a, b) => a.startAt.localeCompare(b.startAt))

  return sorted.length === 0 ? (
    <EmptyState
      icon={<CalendarClock size={22} aria-hidden="true" />}
      title="Yaklaşan etkinlik yok"
      description="Yeni bir etkinlik planlandığında burada görünecek."
    />
  ) : (
    <div className="flex flex-col gap-4">
      {sorted.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
