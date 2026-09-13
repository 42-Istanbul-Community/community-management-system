import { getAnnouncements } from '@/features/content/api'
import { toAnnouncement } from '@/features/content/lib'
import { useQuery } from '@tanstack/react-query'

/**
 * GET /content/announcements
 * The announcements of a community. What comes back depends on the
 * reader's role.
 */
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
