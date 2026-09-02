import { getMe } from '@/features/auth/api'
import { useAuthStore } from '@/stores'
import { useQuery } from '@tanstack/react-query'

export function useMe() {
  const userId = useAuthStore((state) => state.user?.id)

  return useQuery({
    queryKey: ['me', userId],
    queryFn: getMe,
    select: (data) => data.user,
    enabled: Boolean(userId),
  })
}
