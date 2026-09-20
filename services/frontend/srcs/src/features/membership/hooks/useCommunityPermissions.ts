import { useModeratorPermissions } from './useModeratorPermissions'
import { useMyRole } from './useMyRole'
import type { ModeratorPermission } from '@/features/membership/api'
import { useAuthStore } from '@/stores'

/** The permissions the settings page lets someone change. */
const settingsPermissions: ModeratorPermission[] = [
  'setDescription',
  'setTags',
  'setVisibility',
  'setAccessibility',
  'setStatus',
  'setPicture',
  'setBackgroundPicture',
]

/**
 * What the signed-in user may do in a community. Superadmins and admins
 * pass every check, moderators only pass what the admin granted them.
 */
export function useCommunityPermissions(communityId: string | undefined) {
  const globalRole = useAuthStore((state) => state.user?.role)
  const { data: role, isPending: isRolePending } = useMyRole(communityId)

  const isSuperAdmin = globalRole === 'super_admin'
  const isModerator = role === 'moderator'

  const { data: granted, isPending: isGrantedPending } =
    useModeratorPermissions(communityId, isModerator)

  function can(permission: ModeratorPermission) {
    if (isSuperAdmin || role === 'admin') return true
    return isModerator && (granted?.includes(permission) ?? false)
  }

  return {
    role,
    isPending: isSuperAdmin
      ? false
      : isRolePending || (isModerator && isGrantedPending),
    isMember: isSuperAdmin || (role !== undefined && role !== 'normal'),
    canModerate: isSuperAdmin || role === 'moderator' || role === 'admin',
    canAdmin: isSuperAdmin || role === 'admin',
    can,
    canEditSettings: settingsPermissions.some(can),
  }
}
