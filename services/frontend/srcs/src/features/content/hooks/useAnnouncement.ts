import { getAnnouncement } from '@/features/content/api'
import { toAnnouncement } from '@/features/content/lib'
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
