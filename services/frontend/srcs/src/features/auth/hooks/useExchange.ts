import { useNavigate } from 'react-router'

import { exchange } from '@/features/auth/api'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores'
import { useMutation } from '@tanstack/react-query'

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
