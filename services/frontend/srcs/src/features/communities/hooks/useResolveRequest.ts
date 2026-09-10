import { resolveMembershipRequests } from '@/features/communities/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useResolveRequest(communityId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: resolveMembershipRequests,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['membershipRequests', communityId],
      })
      queryClient.invalidateQueries({
        queryKey: ['communityMembers', communityId],
      })
    },
  })
}
