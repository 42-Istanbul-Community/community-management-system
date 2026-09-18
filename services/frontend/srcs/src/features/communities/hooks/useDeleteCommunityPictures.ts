import type { CommunityResponse } from '@/features/communities/api'
import { deleteCommunityPictures } from '@/features/communities/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * DELETE /community/pics/:slug
 * Removes the community's picture and/or background picture, then
 * updates the cached community straight away.
 */
export function useDeleteCommunityPictures(slug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (target: { picture?: boolean; backgroundPicture?: boolean }) =>
      deleteCommunityPictures(slug, target),
    onSuccess: (_data, target) => {
      queryClient.setQueryData<CommunityResponse>(
        ['community', slug],
        (current) =>
          current
            ? {
                community: {
                  ...current.community,
                  ...(target.picture && { picture: null }),
                  ...(target.backgroundPicture && {
                    background_picture: null,
                  }),
                },
              }
            : current,
      )
    },
  })
}
