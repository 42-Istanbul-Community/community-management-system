import { updateParticipantStatus } from '@/features/content/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * PUT /content/events/:eventId/participants/:userId
 * Approves, rejects, or marks a participant as a no-show, then refreshes
 * the participant list, the event and the event list (participantCount).
 */
export function useUpdateParticipantStatus(communityId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateParticipantStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', communityId] })
      queryClient.invalidateQueries({ queryKey: ['event'] })
      queryClient.invalidateQueries({ queryKey: ['eventParticipants'] })
    },
  })
}
