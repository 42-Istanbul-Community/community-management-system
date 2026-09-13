import { createCommunity } from '@/features/communities/api'
import { useAuthStore } from '@/stores'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * POST /community/createCommunity
 * Sends a request to open a new community and refreshes the user's list.
 */
export function useCreateCommunity() {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['communityRequests', userId],
      })
    },
  })
}
