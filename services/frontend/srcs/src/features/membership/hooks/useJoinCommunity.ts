import { joinCommunity } from '@/features/membership/api'
import { useAuthStore } from '@/stores'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useJoinCommunity() {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: joinCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCommunities', userId] })
      queryClient.invalidateQueries({ queryKey: ['myJoinRequests', userId] })
    },
  })
}
