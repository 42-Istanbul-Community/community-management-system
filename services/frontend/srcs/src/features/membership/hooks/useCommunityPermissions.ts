import { useMyRole } from './useMyRole'
import { useAuthStore } from '@/stores'

export function useCommunityPermissions(communityId: string | undefined) {
  const globalRole = useAuthStore((state) => state.user?.role)
  const { data: role, isPending } = useMyRole(communityId)

  const isSuperAdmin = globalRole === 'super_admin'

  return {
    role,
    isPending: isSuperAdmin ? false : isPending,
    isMember: isSuperAdmin || (role !== undefined && role !== 'normal'),
    canModerate: isSuperAdmin || role === 'moderator' || role === 'admin',
    canAdmin: isSuperAdmin || role === 'admin',
  }
}
