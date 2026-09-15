import { useEvents } from './useEvents'
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
  communityId: string | undefined,
) {
  const { data: events } = useEvents(communityId, communitySlug)

  return useQuery({
    queryKey: ['event', id],
    queryFn: () => getEvent(id!),
    select: (data) => {
      const event = toEvent(data.event, communitySlug!)
      const listed = events?.find((item) => item.id === id)
      return listed ? { ...event, isJoined: listed.isJoined } : event
    },
    enabled: Boolean(id && communitySlug),
  })
}
