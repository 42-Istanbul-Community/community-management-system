import { getEvent } from '@/features/communities/api'
import { toEvent } from '@/features/communities/lib'
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
