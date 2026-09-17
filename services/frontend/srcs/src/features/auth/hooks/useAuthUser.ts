import { getAuthUser } from '@/features/auth/api'
import { useAuthStore } from '@/stores'
import { useQuery } from '@tanstack/react-query'

/**
 * GET /auth/user/:userId
 * The signed-in user's own email.
 */
export function useAuthUser() {
  const userId = useAuthStore((state) => state.user?.id)

  return useQuery({
    queryKey: ['authUser', userId],
    queryFn: () => getAuthUser(userId!),
    enabled: Boolean(userId),
  })
}
