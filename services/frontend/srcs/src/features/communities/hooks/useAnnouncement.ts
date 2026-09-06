import { getAnnouncement } from '@/features/communities/api'
import { toAnnouncement } from '@/features/communities/lib'
import { useQuery } from '@tanstack/react-query'

export function useAnnouncement(
  id: string | undefined,
  communitySlug: string | undefined,
) {
  return useQuery({
    queryKey: ['announcement', id],
    queryFn: () => getAnnouncement(id!),
    select: (data) => toAnnouncement(data.announcement, communitySlug!),
    enabled: Boolean(id && communitySlug),
  })
}
