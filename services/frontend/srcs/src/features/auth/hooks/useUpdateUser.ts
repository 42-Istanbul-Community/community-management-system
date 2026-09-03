import { updateUser } from '@/features/auth/api'
import type { UpdateUserPayload } from '@/features/auth/api'
import { useAuthStore } from '@/stores'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateUser() {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(userId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', userId],
      })
    },
  })
}
