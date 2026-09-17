import { useNavigate } from 'react-router'

import { deleteCommunity } from '@/features/communities/api'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * DELETE /orchestration/communities/:slug
 * Removes a community and goes back to the list.
 */
export function useDeleteCommunity(slug: string) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: () => deleteCommunity(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] })
      queryClient.invalidateQueries({ queryKey: ['myCommunities', userId] })
      navigate(paths.communities.root, { replace: true })
    },
  })
}
