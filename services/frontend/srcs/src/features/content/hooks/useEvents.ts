import { getEvents } from '@/features/content/api'
import { toEvent } from '@/features/content/lib'
import { useQuery } from '@tanstack/react-query'

/**
 * GET /content/events
 * The events of a community, each saying whether the reader joined.
 */
export function useEvents(
  communityId: string | undefined,
  communitySlug: string | undefined,
) {
  return useQuery({
    queryKey: ['events', communityId],
    queryFn: () => getEvents({ communityId: communityId! }),
    select: (data) => data.events.map((item) => toEvent(item, communitySlug!)),
    enabled: Boolean(communityId && communitySlug),
  })
}
