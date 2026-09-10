import { getUserCommunities } from '@/features/communities/api'
import { useAuthStore } from '@/stores'
import { useQuery } from '@tanstack/react-query'

export function useMyCommunities() {
  const userId = useAuthStore((state) => state.user?.id)

  return useQuery({
    queryKey: ['myCommunities', userId],
    queryFn: () => getUserCommunities(userId!),
    select: (data) => data.communities,
    enabled: Boolean(userId),
  })
}
