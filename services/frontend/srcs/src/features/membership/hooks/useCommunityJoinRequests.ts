import { useEffect } from 'react'

import { getCommunityJoinRequests } from '@/features/membership/api'
import { useInfiniteQuery } from '@tanstack/react-query'

const PAGE_SIZE = 50

/**
 * GET /membership/communityRequests/:communityId
 * Join requests sent to a community. Needs a moderator role.
 */
export function useCommunityJoinRequests(
  communityId: string | undefined,
  enabled = true,
) {
  const result = useInfiniteQuery({
    queryKey: ['membershipRequests', communityId],
    queryFn: ({ pageParam }) =>
      getCommunityJoinRequests(communityId!, {
        page: pageParam,
        limit: PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.requests.length === PAGE_SIZE ? allPages.length + 1 : undefined,
    select: (data) => data.pages.flatMap((page) => page.requests),
    enabled: Boolean(communityId) && enabled,
    staleTime: 0,
  })

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = result

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return {
    ...result,
    isPending: result.isPending || hasNextPage,
  }
}
