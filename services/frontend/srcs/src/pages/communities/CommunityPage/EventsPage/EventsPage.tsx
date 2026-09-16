import { Link } from 'react-router'

import { Button, EmptyState } from '@/components/ui'
import { useCommunityContext } from '@/features/communities/hooks'
import { EventCard } from '@/features/content/components'
import { useEvents } from '@/features/content/hooks'
import { useCommunityPermissions } from '@/features/membership/hooks'
import { paths } from '@/routes/paths'
import { CalendarClock, Plus } from 'lucide-react'

export function EventsPage() {
  const { community } = useCommunityContext()
  const { data: events, isPending } = useEvents(community.id, community.slug)
  const { canModerate } = useCommunityPermissions(community.id)

  if (isPending) {
    return <p className="text-body text-neutral-600">Yükleniyor...</p>
  }

  const sorted = [...(events ?? [])].sort((a, b) =>
    a.startAt.localeCompare(b.startAt),
  )

  const createButton = canModerate && (
    <Link to={paths.communities.newEvent(community.slug)}>
      <Button size="sm">
        <Plus size={15} aria-hidden="true" />
        Etkinlik oluştur
      </Button>
    </Link>
  )

  return sorted.length === 0 ? (
    <EmptyState
      icon={<CalendarClock size={22} aria-hidden="true" />}
      title="Yaklaşan etkinlik yok"
      description="Yeni bir etkinlik planlandığında burada görünecek."
      action={createButton}
    />
  ) : (
    <div className="flex flex-col gap-4">
      {createButton && <div className="flex justify-end">{createButton}</div>}

      {sorted.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
