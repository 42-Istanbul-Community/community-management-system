import { getCommunityRequests } from '@/features/communities/api'
import { useAuthStore } from '@/stores'
import { useInfiniteQuery } from '@tanstack/react-query'

const PAGE_SIZE = 5

export function useCommunityRequests() {
  const userId = useAuthStore((state) => state.user?.id)

  return useInfiniteQuery({
    queryKey: ['communityRequests', userId],
    queryFn: ({ pageParam }) =>
      getCommunityRequests({
        page: pageParam,
        limit: PAGE_SIZE,
        createdAt: 'desc',
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
