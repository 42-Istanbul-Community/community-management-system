import type { CommunityRole } from '@/features/communities/api'

export function isMember(role: CommunityRole | undefined) {
  return role !== undefined && role !== 'normal'
}

export function canModerate(role: CommunityRole | undefined) {
  return role !== undefined && (role === 'moderator' || role === 'admin')
}

export function canAdmin(role: CommunityRole | undefined) {
  return role !== undefined && role === 'admin'
}
