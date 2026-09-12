import { manageCommunityRequests } from '@/features/communities/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useManageCommunityRequests() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: manageCommunityRequests,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityRequests'] })
      queryClient.invalidateQueries({ queryKey: ['communities'] })
    },
  })
}
