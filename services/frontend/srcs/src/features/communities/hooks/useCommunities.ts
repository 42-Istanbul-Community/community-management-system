import { getCommunities } from '@/features/communities/api'
import type { CommunitiesQuery } from '@/features/communities/api'
import { toCommunity } from '@/features/communities/lib'
import { useQuery } from '@tanstack/react-query'

/**
 * GET /orchestration/communities
 * The community list. Filters and sorting go straight to the endpoint.
 */
export function useCommunities(query: CommunitiesQuery = {}) {
  return useQuery({
    queryKey: ['communities', query],
    queryFn: () => getCommunities(query),
    select: (data) => data.communities.map(toCommunity),
  })
}
