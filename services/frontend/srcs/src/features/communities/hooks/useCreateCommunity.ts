import { createCommunity } from '@/features/communities/api'
import type { CreateCommunityPayload } from '@/features/communities/api'
import { useUploadProgress } from '@/hooks'
import { useAuthStore } from '@/stores'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * POST /community/createCommunity
 * Sends a request to open a new community and refreshes the user's list.
 */
export function useCreateCommunity() {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)
  const { progress, onUploadProgress, reset } = useUploadProgress()

  const mutation = useMutation({
    mutationFn: (payload: CreateCommunityPayload) =>
      createCommunity(payload, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['communityRequests', userId],
      })
    },
    onSettled: reset,
  })

  return { ...mutation, uploadProgress: progress }
}
