import { resolveJoinRequests } from '@/features/membership/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * PUT /membership/communityRequests/resolve
 * Accepts or rejects join requests and refreshes the lists.
 */
export function useResolveJoinRequests(communityId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: resolveJoinRequests,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['communityJoinRequests', communityId],
      })
      queryClient.invalidateQueries({
        queryKey: ['communityMembers', communityId],
      })
    },
  })
}
