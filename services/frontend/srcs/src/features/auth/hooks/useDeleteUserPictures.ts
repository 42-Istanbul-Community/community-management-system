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
      const patch = (current: UserResponse | undefined) =>
        current
          ? {
              user: {
                ...current.user,
                ...(target.picture && { picture: null }),
                ...(target.backgroundPicture && { background_picture: null }),
              },
            }
          : current

      queryClient.setQueryData<UserResponse>(['me', userId], patch)
      queryClient.setQueryData<UserResponse>(['user', userId], patch)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
