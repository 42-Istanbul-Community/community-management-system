import { useLocation, useNavigate } from 'react-router'

import { login } from '@/features/auth/api'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores'
import { useMutation } from '@tanstack/react-query'

export function useLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const setToken = useAuthStore((state) => state.setToken)

  const from = (location.state as { from?: string } | null)?.from

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.token)
      navigate(from ?? paths.home, { replace: true })
    },
  })
}
