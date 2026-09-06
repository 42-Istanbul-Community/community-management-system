import { useMemo } from 'react'

import { EmptyState } from '@/components/ui'
import { useUsers } from '@/features/auth/hooks'
import { AnnouncementCard } from '@/features/communities/components'
import {
  useAnnouncements,
  useCommunityContext,
} from '@/features/communities/hooks'
import { Megaphone } from 'lucide-react'

export function AnnouncementsPage() {
  const { community } = useCommunityContext()

  const { data: announcements, isPending } = useAnnouncements(
    community.id,
    community.slug,
  )

  const authorIds = useMemo(
    () => announcements?.map((item) => item.authorId) ?? [],
    [announcements],
  )

  const { data: authors } = useUsers(authorIds)

  const sorted = useMemo(() => {
    return [...(announcements ?? [])].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return b.createdAt.localeCompare(a.createdAt)
    })
  }, [announcements])

  if (isPending) {
    return <p className="text-body text-neutral-600">Yükleniyor...</p>
  }

  return sorted.length === 0 ? (
    <EmptyState
      icon={<Megaphone size={22} aria-hidden="true" />}
      title="Henüz duyuru yok"
      description="Kulüp yöneticileri bir duyuru paylaştığında burada görünecek."
    />
  ) : (
    <div className="flex flex-col gap-4">
      {sorted.map((announcement) => (
        <AnnouncementCard
          key={announcement.id}
          announcement={{
            ...announcement,
            authorName:
              authors?.[announcement.authorId]?.name ?? 'Kulüp yöneticisi',
          }}
        />
      ))}
    </div>
  )
}
