import { createEvent } from '@/features/content/api'
import type { CreateEventPayload } from '@/features/content/api'
import { useUploadProgress } from '@/hooks'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * POST /content/events
 * Creates a new event and refreshes the community's list.
 */
export function useCreateEvent(communityId: string | undefined) {
  const queryClient = useQueryClient()
  const { progress, onUploadProgress, reset } = useUploadProgress()

  const mutation = useMutation({
    mutationFn: (payload: Omit<CreateEventPayload, 'communityId'>) =>
      createEvent({ ...payload, communityId: communityId! }, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', communityId] })
    },
    onSettled: reset,
  })

  return { ...mutation, uploadProgress: progress }
}
