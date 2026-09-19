import { manageCommunityRequests } from '@/features/communities/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * POST /orchestration/manage_communities
 * Approves or rejects community creation requests. Superadmin only.
 * Approving creates the community, so the list is refreshed too.
 */
export function useManageCommunityRequests() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: manageCommunityRequests,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityRequests'] })
      queryClient.invalidateQueries({ queryKey: ['communities'] })
      queryClient.invalidateQueries({ queryKey: ['myCommunities'] })
    },
  })
}
