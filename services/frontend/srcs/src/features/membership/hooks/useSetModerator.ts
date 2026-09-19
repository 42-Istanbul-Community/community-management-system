import { setModerator } from '@/features/membership/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * PUT /membership/setModerator
 * Promotes or demotes a member and refreshes the community's member list.
 */
export function useSetModerator(communityId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      isModerator,
    }: {
      userId: string
      isModerator: boolean
    }) => setModerator({ communityId: communityId!, userId, isModerator }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['communityMembers', communityId],
      })
    },
  })
}
