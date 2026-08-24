import { useNavigate } from 'react-router'

import { login } from '@/features/auth/api'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores'
import { useMutation } from '@tanstack/react-query'

export function useLogin() {
  const navigate = useNavigate()
  const setToken = useAuthStore((state) => state.setToken)

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.token)
      navigate(paths.home)
    },
  })
}
