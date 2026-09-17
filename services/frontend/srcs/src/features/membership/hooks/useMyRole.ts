import { getUserRole } from '@/features/membership/api'
import { useAuthStore } from '@/stores'
import { useQuery } from '@tanstack/react-query'

/**
 * GET /membership/userRole/:userId/:communityId
 * The user's role in a community. Skipped for superadmins, who are
 * treated as admins everywhere.
 */
export function useMyRole(communityId: string | undefined) {
  const userId = useAuthStore((state) => state.user?.id)
  const globalRole = useAuthStore((state) => state.user?.role)

  return useQuery({
    queryKey: ['myRole', userId, communityId],
    queryFn: () => getUserRole(userId!, communityId!),
    select: (data) => data.role,
    enabled: Boolean(userId && communityId) && globalRole !== 'super_admin',
    retry: false,
  })
}
