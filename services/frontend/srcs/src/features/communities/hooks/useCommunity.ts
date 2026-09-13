import { getCommunity } from '@/features/communities/api'
import { toCommunity } from '@/features/communities/lib'
import { useQuery } from '@tanstack/react-query'

/**
 * GET /community/communities/:slug
 * One community by slug. Private ones only load for members.
 */
export function useCommunity(slug: string | undefined) {
  return useQuery({
    queryKey: ['community', slug],
    queryFn: () => getCommunity(slug!),
    select: (data) => toCommunity(data.community),
    enabled: Boolean(slug),
  })
}
