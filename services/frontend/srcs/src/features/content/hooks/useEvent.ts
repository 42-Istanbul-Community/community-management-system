import { getEvent } from '@/features/content/api'
import { toEvent } from '@/features/content/lib'
import { useQuery } from '@tanstack/react-query'

/**
 * GET /content/events/:id
 * One event. This response does not carry isJoined, so the detail page
 * always shows the join button.
 */
export function useEvent(
  id: string | undefined,
  communitySlug: string | undefined,
) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => getEvent(id!),
    select: (data) => toEvent(data.event, communitySlug!),
    enabled: Boolean(id && communitySlug),
  })
}
