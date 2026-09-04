import { createCommunity } from '@/features/communities/api'
import { useAuthStore } from '@/stores'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// export function useCreateCommunity() {
//   return useMutation({ mutationFn: createCommunity })
// }

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
