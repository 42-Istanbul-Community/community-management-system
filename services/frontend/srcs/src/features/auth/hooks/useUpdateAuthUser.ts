import type { UpdateAuthUserPayload } from '@/features/auth/api'
import { updateAuthUser } from '@/features/auth/api'
import { useAuthStore } from '@/stores'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * PUT /auth/user/:userId
 * Changes the signed-in user's own email and/or password.
 */
export function useUpdateAuthUser() {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: (payload: UpdateAuthUserPayload) =>
      updateAuthUser(userId!, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(['authUser', userId], data)
    },
  })
}
