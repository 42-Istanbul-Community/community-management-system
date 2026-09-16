import { getTags } from '@/features/communities/api'
import { useQuery } from '@tanstack/react-query'

/**
 * GET /community/tags
 * Every tag in use, most popular first.
 */
export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
    select: (data) => data.tags.map((tag) => tag.name),
  })
}
