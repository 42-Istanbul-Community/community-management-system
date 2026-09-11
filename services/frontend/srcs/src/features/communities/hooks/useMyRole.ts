import { getUserRole } from '@/features/communities/api'
import { useAuthStore } from '@/stores'
import { useQuery } from '@tanstack/react-query'

export function useMyRole(communityId: string | undefined) {
  const userId = useAuthStore((state) => state.user?.id)
  const globalRole = useAuthStore((state) => state.user?.role)

  const query = useQuery({
    queryKey: ['myRole', userId, communityId],
    queryFn: () => getUserRole(userId!, communityId!),
    // queryFn: () => Promise.resolve({ role: 'super_admin' }),
    select: (data) => data.role,
    enabled: Boolean(userId && communityId) && globalRole !== 'super_admin',
    retry: false,
  })

  // console.log(query.data)
  return query
}
