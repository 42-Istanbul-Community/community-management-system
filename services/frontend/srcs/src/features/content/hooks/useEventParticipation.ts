import { joinEvent, leaveEvent } from '@/features/content/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * POST and DELETE /content/events/:eventId/participants
 * Joins or leaves an event and refreshes both the list and the detail.
 */
export function useEventParticipation(communityId: string | undefined) {
  const queryClient = useQueryClient()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['events', communityId] })
    queryClient.invalidateQueries({ queryKey: ['event'] })
  }

  const join = useMutation({ mutationFn: joinEvent, onSuccess: invalidate })
  const leave = useMutation({ mutationFn: leaveEvent, onSuccess: invalidate })

  return { join, leave }
}
