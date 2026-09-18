import { kickMember } from '@/features/membership/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * POST /membership/kickMember
 * Removes a member and refreshes the community's member list.
 */
export function useKickMember(communityId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => kickMember({ communityId: communityId!, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityMembers', communityId] })
      queryClient.invalidateQueries({ queryKey: ['communityMemberCounts'] })
    },
  })
}
