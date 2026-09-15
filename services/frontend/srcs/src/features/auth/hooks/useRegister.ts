import { useNavigate } from 'react-router'

import { login, register } from '@/features/auth/api'
import type { RegisterPayload } from '@/features/auth/api'
import { useUploadProgress } from '@/hooks'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores'
import { useMutation } from '@tanstack/react-query'

/**
 * POST /orchestration/register, then POST /auth/login
 * Creates an account and signs in right away. If the sign-in fails the
 * user is sent to the sign-in page instead.
 */
export function useRegister() {
  const navigate = useNavigate()
  const setToken = useAuthStore((state) => state.setToken)
  const { progress, onUploadProgress, reset } = useUploadProgress()

  const mutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      await register(payload, onUploadProgress)

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
        navigate(paths.me.root)
        return
      }
      navigate(paths.login)
    },
    onSettled: reset,
  })

  return { ...mutation, uploadProgress: progress }
}
