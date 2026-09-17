import { getEventParticipants } from '@/features/content/api'
import { useQuery } from '@tanstack/react-query'

/**
 * GET /content/events/:id/participants
 * Everyone who has joined, requested to join, or no-showed the event.
 */
export function useEventParticipants(eventId: string | undefined) {
  return useQuery({
    queryKey: ['eventParticipants', eventId],
    queryFn: () => getEventParticipants(eventId!),
    select: (data) => data.participants,
    enabled: Boolean(eventId),
  })
}
