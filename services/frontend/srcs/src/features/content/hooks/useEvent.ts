import { getEvent } from '@/features/content/api'
import { toEvent } from '@/features/content/lib'
import { useQuery } from '@tanstack/react-query'

export function useEvent(
  id: string | undefined,
  communitySlug: string | undefined,
) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => getEvent(id!),
    select: (data) => toEvent(data.event, communitySlug!),
    enabled: Boolean(id && communitySlug),
  })
}
