import { getCommunityJoinRequests } from '@/features/membership/api'
import { useQuery } from '@tanstack/react-query'

/** Join requests sent to a community. Needs a moderator role. */
export function useCommunityJoinRequests(communityId: string | undefined) {
  return useQuery({
    queryKey: ['membershipRequests', communityId],
    queryFn: () => getCommunityJoinRequests(communityId!),
    select: (data) => data.requests,
    enabled: Boolean(communityId),
    retry: false,
  })
}
