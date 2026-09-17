import { toCommunity } from '@/features/communities/lib'
import { getUserCommunities } from '@/features/membership/api'
import { useAuthStore } from '@/stores'
import { useQuery } from '@tanstack/react-query'

/**
 * GET /membership/userCommunity/:userId
 * The communities the signed-in user belongs to.
 */
export function useMyCommunities() {
  const userId = useAuthStore((state) => state.user?.id)

  return useQuery({
    queryKey: ['myCommunities', userId],
    queryFn: () => getUserCommunities(userId!),
    select: (data) => data.communities.map(toCommunity),
    enabled: Boolean(userId),
  })
}
