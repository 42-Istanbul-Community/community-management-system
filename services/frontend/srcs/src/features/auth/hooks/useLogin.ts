import { useLocation, useNavigate } from 'react-router'

import { login } from '@/features/auth/api'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores'
import { useMutation } from '@tanstack/react-query'

/**
 * POST /auth/login
 * Signs in and returns the user to the page they came from, or home when
 * they opened the sign-in page directly.
 */
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
