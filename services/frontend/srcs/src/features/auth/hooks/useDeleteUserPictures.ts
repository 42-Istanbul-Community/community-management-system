import type { UserResponse } from '@/features/auth/api'
import { deleteUserPictures } from '@/features/auth/api'
import { useAuthStore } from '@/stores'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * DELETE /id/pics/:userId
 * Removes the signed-in user's picture and/or background picture, then
 * updates the cached profile straight away.
 */
export function useDeleteUserPictures() {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: (target: { picture?: boolean; backgroundPicture?: boolean }) =>
      deleteUserPictures(userId!, target),
    onSuccess: (_data, target) => {
      queryClient.setQueryData<UserResponse>(['me', userId], (current) =>
        current
          ? {
              user: {
                ...current.user,
                ...(target.picture && { picture: null }),
                ...(target.backgroundPicture && { background_picture: null }),
              },
            }
          : current,
      )
    },
  })
}
