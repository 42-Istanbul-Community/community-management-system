import { useEffect } from 'react'

import { getCommunityMembers } from '@/features/membership/api'
import { useInfiniteQuery } from '@tanstack/react-query'

const PAGE_SIZE = 50

/**
 * GET /membership/members/:communityId
 * The members of a community, ordered by role. Names come from the id
 * service separately.
 */
export function useCommunityMembers(communityId: string | undefined) {
  const result = useInfiniteQuery({
    queryKey: ['communityMembers', communityId],
    queryFn: ({ pageParam }) =>
      getCommunityMembers(communityId!, { page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.members.length === PAGE_SIZE ? allPages.length + 1 : undefined,
    select: (data) => data.pages.flatMap((page) => page.members),
    enabled: Boolean(communityId),
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
