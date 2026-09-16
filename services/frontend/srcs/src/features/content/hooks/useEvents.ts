import { getEvents } from '@/features/content/api'
import { toEvent } from '@/features/content/lib'
import { useInfiniteQuery } from '@tanstack/react-query'

const PAGE_SIZE = 20

/**
 * GET /content/events
 * The events of a community, each saying whether the reader joined.
 */
export function useEvents(
  communityId: string | undefined,
  communitySlug: string | undefined,
) {
  return useInfiniteQuery({
    queryKey: ['events', communityId],
    queryFn: ({ pageParam }) =>
      getEvents({ communityId: communityId!, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.events.length === PAGE_SIZE ? allPages.length + 1 : undefined,
    select: (data) =>
      data.pages.flatMap((page) =>
        page.events.map((item) => toEvent(item, communitySlug!)),
      ),
    enabled: Boolean(communityId && communitySlug),
  })
}
