import { EmptyState } from '@/components/ui'
import { AnnouncementCard } from '@/features/communities/components'
import { announcements } from '@/mocks'
import { Megaphone } from 'lucide-react'

export default function AnnouncementsPage() {
  const sorted = [...announcements].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return b.createdAt.localeCompare(a.createdAt)
  })

  return sorted.length === 0 ? (
    <EmptyState
      icon={<Megaphone size={22} aria-hidden="true" />}
      title="Henüz duyuru yok"
      description="Kulüp yöneticileri bir duyuru paylaştığında burada görünecek."
    />
  ) : (
    <div className="flex flex-col gap-4">
      {sorted.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </div>
  )
}
