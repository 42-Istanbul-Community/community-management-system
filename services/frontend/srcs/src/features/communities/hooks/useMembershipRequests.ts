import { getMembershipRequests } from '@/features/communities/api'
import { useQuery } from '@tanstack/react-query'

export function useMembershipRequests(communityId: string | undefined) {
  return useQuery({
    queryKey: ['membershipRequests', communityId],
    queryFn: () => getMembershipRequests(communityId!),
    select: (data) => data.requests,
    enabled: Boolean(communityId),
    retry: false,
  })
}
