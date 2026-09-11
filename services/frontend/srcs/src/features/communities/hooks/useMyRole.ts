import { getUserRole } from '@/features/communities/api'
import { useAuthStore } from '@/stores'
import { useQuery } from '@tanstack/react-query'

export function useMyRole(communityId: string | undefined) {
  const userId = useAuthStore((state) => state.user?.id)

  const query = useQuery({
    queryKey: ['myRole', userId, communityId],
    queryFn: () => getUserRole(userId!, communityId!),
    // queryFn: () => Promise.resolve({ role: 'superadmin' }),
    select: (data) => data.role,
    enabled: Boolean(userId && communityId),
  })

  return query
}
