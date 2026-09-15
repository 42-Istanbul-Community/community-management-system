import { useEffect } from 'react'

import { useCommunityMemberCounts } from './useCommunityMemberCounts'
import { getCommunities } from '@/features/communities/api'
import type { CommunitiesQuery } from '@/features/communities/api'
import { toCommunity } from '@/features/communities/lib'
import { useInfiniteQuery } from '@tanstack/react-query'

/**
 * GET /orchestration/communities
 * Gets the list of communities. The backend does the filtering
 * and the sorting.
 */
export function useCommunities(query: CommunitiesQuery = {}) {
  const result = useInfiniteQuery({
    queryKey: ['communities', query],
    queryFn: ({ pageParam }) => getCommunities({ ...query, cursor: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    select: (data) =>
      data.pages.flatMap((page) => page.communities.map(toCommunity)),
  })

  const {
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    data: communities,
  } = result
  const loadingAll = query.limit === undefined

  useEffect(() => {
    if (loadingAll && hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [loadingAll, hasNextPage, isFetchingNextPage, fetchNextPage])

  const data = useCommunityMemberCounts(communities)

  return {
    ...result,
    data,
    isPending: result.isPending || (loadingAll && hasNextPage),
  }
}
