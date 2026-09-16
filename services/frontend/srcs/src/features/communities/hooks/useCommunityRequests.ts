import type { CommunityRequestStatus } from '@/features/communities/api'
import { getCommunityRequests } from '@/features/communities/api'
import { useAuthStore } from '@/stores'
import { useInfiniteQuery } from '@tanstack/react-query'

const PAGE_SIZE = 5

/**
 * GET /community/communityRequests
 * Community creation requests, five at a time. Superadmins see every
 * request, everyone else only their own.
 */
export function useCommunityRequests(status?: CommunityRequestStatus) {
  const userId = useAuthStore((state) => state.user?.id)

  return useInfiniteQuery({
    queryKey: ['communityRequests', userId, status],
    queryFn: ({ pageParam }) =>
      getCommunityRequests({
        page: pageParam,
        limit: PAGE_SIZE,
        createdAt: 'desc',
        status,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.communityRequests.length === PAGE_SIZE
        ? allPages.length + 1
        : undefined,
    select: (data) => data.pages.flatMap((page) => page.communityRequests),
    enabled: Boolean(userId),
    retry: false,
  })
}
