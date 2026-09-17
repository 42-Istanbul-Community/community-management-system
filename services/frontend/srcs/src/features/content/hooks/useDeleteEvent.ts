import { deleteEvent } from '@/features/content/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * DELETE /content/events/:id
 * Removes an event and refreshes the community's list.
 */
export function useDeleteEvent(communityId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', communityId] })
    },
  })
}
