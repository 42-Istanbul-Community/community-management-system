import { updateCommunity } from '@/features/communities/api'
import type { UpdateCommunityPayload } from '@/features/communities/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * PUT /community/communities/:slug
 * Saves the community settings. The fresh record goes straight into the
 * cache so the page does not refetch it.
 */
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
