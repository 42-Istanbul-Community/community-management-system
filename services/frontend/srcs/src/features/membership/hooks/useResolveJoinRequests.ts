import { resolveJoinRequests } from '@/features/membership/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * POST /membership/communityRequests/resolve
 * Accepts or rejects a join request and refreshes the lists.
 */
export function useResolveJoinRequests(
  communityId: string | undefined,
  communitySlug?: string,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      requestId,
      status,
    }: {
      requestId: string
      status: 'approved' | 'rejected'
    }) =>
      resolveJoinRequests({
        requestIds: [requestId],
        action: status === 'approved' ? 'approve' : 'reject',
        communityId: communityId!,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['membershipRequests', communityId],
      })
      queryClient.invalidateQueries({
        queryKey: ['communityMembers', communityId],
      })
      queryClient.invalidateQueries({
        queryKey: ['community', communitySlug],
      })
    },
  })
}
