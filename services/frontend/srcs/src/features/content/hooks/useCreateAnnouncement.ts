import { createAnnouncement } from '@/features/content/api'
import type { CreateAnnouncementPayload } from '@/features/content/api'
import { useUploadProgress } from '@/hooks'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * POST /content/announcements
 * Shares a new announcement and refreshes the community's list.
 */
export function useCreateAnnouncement(communityId: string | undefined) {
  const queryClient = useQueryClient()
  const { progress, onUploadProgress, reset } = useUploadProgress()

  const mutation = useMutation({
    mutationFn: (payload: Omit<CreateAnnouncementPayload, 'communityId'>) =>
      createAnnouncement(
        { ...payload, communityId: communityId! },
        onUploadProgress,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['announcements', communityId],
      })
    },
    onSettled: reset,
  })

  return { ...mutation, uploadProgress: progress }
}
