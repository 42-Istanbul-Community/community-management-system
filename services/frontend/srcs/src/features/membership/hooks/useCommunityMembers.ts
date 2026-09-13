import { getCommunityMembers } from '@/features/membership/api'
import { useQuery } from '@tanstack/react-query'

/**
 * GET /membership/members/:communityId
 * The members of a community, ordered by role. Names come from the id
 * service separately.
 */
export function useCommunityMembers(communityId: string | undefined) {
  return useQuery({
    queryKey: ['communityMembers', communityId],
    queryFn: () => getCommunityMembers(communityId!),
    select: (data) => data.members,
    enabled: Boolean(communityId),
  })
}
