import { deleteUser } from '@/features/auth/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * DELETE /orchestration/user/:userId
 * Removes a user. Super admin only.
 */
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userList'] })
    },
  })
}
