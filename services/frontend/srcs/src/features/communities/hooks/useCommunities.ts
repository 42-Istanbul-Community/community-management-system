import { useEffect } from 'react'

import { getCommunities } from '@/features/communities/api'
import type { CommunitiesQuery } from '@/features/communities/api'
import { toCommunity } from '@/features/communities/lib'
import { useInfiniteQuery } from '@tanstack/react-query'

export function useCommunities(query: CommunitiesQuery = {}) {
  const result = useInfiniteQuery({
    queryKey: ['communities', query],
    queryFn: ({ pageParam }) => getCommunities({ ...query, cursor: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    select: (data) =>
      data.pages.flatMap((page) => page.communities.map(toCommunity)),
  })

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = result
  const loadingAll = query.limit === undefined

  useEffect(() => {
    if (loadingAll && hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [loadingAll, hasNextPage, isFetchingNextPage, fetchNextPage])

  return {
    ...result,
    isPending: result.isPending || (loadingAll && hasNextPage),
  }
}
