import { useNavigate } from 'react-router'

import { deleteCommunity } from '@/features/communities/api'
import { paths } from '@/routes/paths'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeleteCommunity(slug: string) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteCommunity(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] })
      navigate(paths.communities.root, { replace: true })
    },
  })
}
