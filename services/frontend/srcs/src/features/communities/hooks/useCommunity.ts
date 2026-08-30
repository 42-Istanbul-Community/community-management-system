import { getCommunities } from '@/features/communities/api'
import { toClub } from '@/features/communities/lib'
import { useQuery } from '@tanstack/react-query'

export function useCommunity(slug: string | undefined) {
  return useQuery({
    queryKey: ['communities'],
    queryFn: () => getCommunities({ limit: 10 }),
    select: (data) => {
      const match = data.communities.find((item) => item.slug === slug)
      return match ? toClub(match) : null
    },
    enabled: Boolean(slug),
  })
}
