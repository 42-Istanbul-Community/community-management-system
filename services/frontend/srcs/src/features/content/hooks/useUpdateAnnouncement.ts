import { updateAnnouncement } from '@/features/content/api'
import type { UpdateAnnouncementPayload } from '@/features/content/api'
import { useUploadProgress } from '@/hooks'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * PUT /content/announcements/:id
 * Updates an announcement and refreshes its detail and the community's list.
 */
export function useUpdateAnnouncement(
  communityId: string | undefined,
  id: string | undefined,
) {
  const queryClient = useQueryClient()
  const { progress, onUploadProgress, reset } = useUploadProgress()

  const mutation = useMutation({
    mutationFn: (payload: UpdateAnnouncementPayload) =>
      updateAnnouncement(id!, payload, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['announcements', communityId],
      })
      queryClient.invalidateQueries({ queryKey: ['announcement', id] })
    },
    onSettled: reset,
  })

  return { ...mutation, uploadProgress: progress }
}
