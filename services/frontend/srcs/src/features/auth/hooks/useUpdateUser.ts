import { useNavigate } from 'react-router'

import { updateUser } from '@/features/auth/api'
import type { UpdateUserPayload } from '@/features/auth/api'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateUser() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(userId!, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(['me', userId], data)
      navigate(paths.me.root)
    },
  })
}
