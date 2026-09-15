import { useMemo } from 'react'

import type { Community } from '@/features/communities/api'
import { getCommunityMemberCounts } from '@/features/membership/api'
import { useQuery } from '@tanstack/react-query'

/**
 * The community list has no member counts.
 * This hook gets them in one extra request and adds them to
 * the communities.
 */
export function useCommunityMemberCounts(communities: Community[] | undefined) {
  const ids = useMemo(
    () => communities?.map((community) => community.id) ?? [],
    [communities],
  )

  const { data: memberCounts } = useQuery({
    queryKey: ['communityMemberCounts', ids],
    queryFn: () => getCommunityMemberCounts(ids),
    enabled: ids.length > 0,
    select: (data) =>
      Object.fromEntries(
        data.counts.map((entry) => [entry.community_id, entry.count]),
      ),
  })

  return useMemo(
    () =>
      communities?.map((community) => ({
        ...community,
        memberCount: memberCounts?.[community.id] ?? community.memberCount,
      })),
    [communities, memberCounts],
  )
}
