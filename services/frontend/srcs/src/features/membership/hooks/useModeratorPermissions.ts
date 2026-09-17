import { getModeratorPermissions } from '@/features/membership/api'
import { useQuery } from '@tanstack/react-query'

/**
 * GET /membership/moderatorPermissions/:communityId
 * What moderators of this community are allowed to do.
 */
export function useModeratorPermissions(communityId: string | undefined) {
  return useQuery({
    queryKey: ['moderatorPermissions', communityId],
    queryFn: () => getModeratorPermissions(communityId!),
    select: (data) => data.permission,
    enabled: Boolean(communityId),
  })
}
