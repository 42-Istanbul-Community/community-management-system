import { getUser } from '@/features/auth/api'
import { useQuery } from '@tanstack/react-query'

export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId!),
    select: (data) => data.user,
    enabled: Boolean(userId),
  })
}
