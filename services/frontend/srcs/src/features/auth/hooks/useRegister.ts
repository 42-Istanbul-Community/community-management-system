import { useNavigate } from 'react-router'

import { login, register } from '@/features/auth/api'
import type { RegisterPayload } from '@/features/auth/api'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores'
import { useMutation } from '@tanstack/react-query'

export function useRegister() {
  const navigate = useNavigate()
  const setToken = useAuthStore((state) => state.setToken)

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      await register(payload)

      try {
        const session = await login({
          email: payload.email,
          password: payload.password,
        })
        return { token: session.token }
      } catch {
        return { token: null }
      }
    },
    onSuccess: (result) => {
      if (result.token) {
        setToken(result.token)
        navigate(paths.home)
        return
      }
      navigate(paths.login)
    },
  })
}
