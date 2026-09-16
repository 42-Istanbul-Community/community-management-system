import { getAnnouncements } from '@/features/content/api'
import { toAnnouncement } from '@/features/content/lib'
import { useInfiniteQuery } from '@tanstack/react-query'

const PAGE_SIZE = 20

/**
 * GET /content/announcements
 * The announcements of a community. What comes back depends on the
 * reader's role.
 */
export function useAnnouncements(
  communityId: string | undefined,
  communitySlug: string | undefined,
) {
  return useInfiniteQuery({
    queryKey: ['announcements', communityId],
    queryFn: ({ pageParam }) =>
      getAnnouncements({
        communityId: communityId!,
        page: pageParam,
        limit: PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.announcements.length === PAGE_SIZE
        ? allPages.length + 1
        : undefined,
    select: (data) =>
      data.pages.flatMap((page) =>
        page.announcements.map((item) => toAnnouncement(item, communitySlug!)),
      ),
    enabled: Boolean(communityId && communitySlug),
  })
}
