import { getUserRole } from '@/features/communities/api'
import { useAuthStore } from '@/stores'
import { useQuery } from '@tanstack/react-query'

export function useMyRole(communityId: string | undefined) {
  const userId = useAuthStore((state) => state.user?.id)

  return useQuery({
    queryKey: ['myRole', userId, communityId],
    queryFn: () => getUserRole(userId!, communityId!),
    select: (data) => data.role,
    enabled: Boolean(userId && communityId),
  })
}
