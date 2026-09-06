import { getUserRequests } from '@/features/communities/api'
import { useAuthStore } from '@/stores'
import { useQuery } from '@tanstack/react-query'

export function useMyRequests() {
  const userId = useAuthStore((state) => state.user?.id)

  return useQuery({
    queryKey: ['myRequests', userId],
    queryFn: () => getUserRequests(userId!),
    select: (data) => data.requests,
    enabled: Boolean(userId),
    retry: false,
  })
}
