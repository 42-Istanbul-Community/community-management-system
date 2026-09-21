import { joinCommunity } from '@/features/membership/api'
import { useAuthStore } from '@/stores'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * POST /membership/communityRequests
 * Joins an open community right away, or sends a request to a restricted
 * one.
 */
export function useJoinCommunity(slug?: string) {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: joinCommunity,
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({ queryKey: ['myCommunities', userId] })
      queryClient.invalidateQueries({ queryKey: ['myJoinRequests', userId] })
      queryClient.invalidateQueries({ queryKey: ['community', slug] })
      queryClient.invalidateQueries({
        queryKey: ['myRole', userId, payload.communityId],
      })
      queryClient.invalidateQueries({
        queryKey: ['communityMembers', payload.communityId],
      })
      queryClient.invalidateQueries({ queryKey: ['communityMemberCounts'] })
    },
  })
}
