import { getEvents } from '@/features/communities/api'
import { toEvent } from '@/features/communities/lib'
import { useQuery } from '@tanstack/react-query'

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
