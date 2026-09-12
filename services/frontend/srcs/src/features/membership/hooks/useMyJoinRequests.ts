import { getUserJoinRequests } from '@/features/membership/api'
import { useAuthStore } from '@/stores'
import { useQuery } from '@tanstack/react-query'

/** Join requests the signed-in user has sent. */
export function useMyJoinRequests() {
  const userId = useAuthStore((state) => state.user?.id)

  return useQuery({
    queryKey: ['myJoinRequests', userId],
    queryFn: () => getUserJoinRequests(userId!),
    select: (data) => data.requests,
    enabled: Boolean(userId),
  })
}
