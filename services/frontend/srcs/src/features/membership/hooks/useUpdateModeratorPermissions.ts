import { updateModeratorPermissions } from '@/features/membership/api'
import type { ModeratorPermission } from '@/features/membership/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * PUT /membership/moderatorPermissions/:communityId
 * Replaces the list of things moderators are allowed to do.
 */
export function useUpdateModeratorPermissions(communityId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (permissions: ModeratorPermission[]) =>
      updateModeratorPermissions(communityId, { permissions }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['moderatorPermissions', communityId],
      })
    },
  })
}
