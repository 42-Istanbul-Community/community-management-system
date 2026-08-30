import { getCommunities } from '@/features/communities/api'
import { toCommunity } from '@/features/communities/lib'
import { useQuery } from '@tanstack/react-query'

export function useCommunities() {
  return useQuery({
    queryKey: ['communities'],
    queryFn: () => getCommunities({ limit: 20 }),
    select: (data) => data.communities.map(toCommunity),
  })
}
