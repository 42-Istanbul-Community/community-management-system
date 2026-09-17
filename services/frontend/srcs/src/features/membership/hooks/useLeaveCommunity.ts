import { leaveCommunity } from '@/features/membership/api'
import { useAuthStore } from '@/stores'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * DELETE /membership/leaveCommunity/:communityId
 * Leaves a community and refreshes the user's list.
 */
export function useLeaveCommunity(slug?: string) {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: leaveCommunity,
    onSuccess: (_data, communityId) => {
      queryClient.invalidateQueries({ queryKey: ['myCommunities', userId] })
      queryClient.invalidateQueries({ queryKey: ['community', slug] })
      queryClient.invalidateQueries({ queryKey: ['myRole', userId, communityId] })
      queryClient.invalidateQueries({
        queryKey: ['communityMembers', communityId],
      })
      queryClient.invalidateQueries({ queryKey: ['communityMemberCounts'] })
    },
  })
}
