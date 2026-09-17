import { updateEvent } from '@/features/content/api'
import type { UpdateEventPayload } from '@/features/content/api'
import { useUploadProgress } from '@/hooks'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * PUT /content/events/:id
 * Updates an event and refreshes its detail and the community's list.
 */
export function useUpdateEvent(
  communityId: string | undefined,
  id: string | undefined,
) {
  const queryClient = useQueryClient()
  const { progress, onUploadProgress, reset } = useUploadProgress()

  const mutation = useMutation({
    mutationFn: (payload: UpdateEventPayload) =>
      updateEvent(id!, payload, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', communityId] })
      queryClient.invalidateQueries({ queryKey: ['event', id] })
    },
    onSettled: reset,
  })

  return { ...mutation, uploadProgress: progress }
}
