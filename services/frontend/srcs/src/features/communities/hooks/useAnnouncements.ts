import { getAnnouncements } from '@/features/communities/api'
import { toAnnouncement } from '@/features/communities/lib'
import { useQuery } from '@tanstack/react-query'

export function useAnnouncements(
  communityId: string | undefined,
  communitySlug: string | undefined,
) {
  return useQuery({
    queryKey: ['announcements', communityId],
    queryFn: () => getAnnouncements({ communityId: communityId! }),
    select: (data) =>
      data.announcements.map((item) => toAnnouncement(item, communitySlug!)),
    enabled: Boolean(communityId && communitySlug),
  })
}
