import { updateUser } from '@/features/auth/api'
import type { UpdateUserPayload } from '@/features/auth/api'
import { useUploadProgress } from '@/hooks'
import { useAuthStore } from '@/stores'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * PUT /id/:userId
 * Saves the display name or the picture and writes the new profile
 * straight into the cache.
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)
  const { progress, onUploadProgress, reset } = useUploadProgress()

  const mutation = useMutation({
    mutationFn: (payload: UpdateUserPayload) =>
      updateUser(userId!, payload, onUploadProgress),
    onSuccess: (data) => {
      queryClient.setQueryData(['me', userId], data)
    },
    onSettled: reset,
  })

  return { ...mutation, uploadProgress: progress }
}
