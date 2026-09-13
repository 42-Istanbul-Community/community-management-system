import { useNavigate } from 'react-router'

import { exchange } from '@/features/auth/api'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores'
import { useMutation } from '@tanstack/react-query'

/**
 * POST /orchestration/exchange
 * Turns the one-time token from a 42 or Google sign-in into a session and
 * sends the user home.
 */
export function useExchange() {
  const navigate = useNavigate()
  const setToken = useAuthStore((state) => state.setToken)

  return useMutation({
    mutationFn: exchange,
    onSuccess: (data) => {
      setToken(data.token)
      navigate(paths.home, { replace: true })
    },
  })
}
