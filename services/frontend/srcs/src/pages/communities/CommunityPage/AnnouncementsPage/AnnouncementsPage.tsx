import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router'

import { Button, EmptyState } from '@/components/ui'
import { useUsers } from '@/features/auth/hooks'
import { useCommunityContext } from '@/features/communities/hooks'
import { AnnouncementCard } from '@/features/content/components'
import { useAnnouncements } from '@/features/content/hooks'
import { useCommunityPermissions } from '@/features/membership/hooks'
import { paths } from '@/routes/paths'
import { Megaphone, Plus } from 'lucide-react'

export function AnnouncementsPage() {
  const { community } = useCommunityContext()

  const {
    data: announcements,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAnnouncements(community.id, community.slug)
  const { canModerate } = useCommunityPermissions(community.id)

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

  if (isPending) {
    return <p className="text-body text-neutral-600">Yükleniyor...</p>
  }

  const createButton = canModerate && (
    <Link to={paths.communities.newAnnouncement(community.slug)}>
      <Button size="sm">
        <Plus size={15} aria-hidden="true" />
        Duyuru paylaş
      </Button>
    </Link>
  )

  return sorted.length === 0 ? (
    <EmptyState
      icon={<Megaphone size={22} aria-hidden="true" />}
      title="Henüz duyuru yok"
      description="Kulüp yöneticileri bir duyuru paylaştığında burada görünecek."
      action={createButton}
    />
  ) : (
    <div className="flex flex-col gap-4">
      {createButton && <div className="flex justify-end">{createButton}</div>}

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

      <div ref={sentinelRef} aria-hidden="true" className="h-px" />

      {isFetchingNextPage && (
        <p className="text-caption text-center text-neutral-500">
          Yükleniyor…
        </p>
      )}
    </div>
  )
}
