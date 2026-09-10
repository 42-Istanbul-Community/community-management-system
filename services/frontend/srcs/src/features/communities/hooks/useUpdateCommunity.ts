import { updateCommunity } from '@/features/communities/api'
import type { UpdateCommunityPayload } from '@/features/communities/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateCommunity(slug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateCommunityPayload) =>
      updateCommunity(slug, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(['community', slug], data)
      queryClient.invalidateQueries({ queryKey: ['communities'] })
    },
  })
}
