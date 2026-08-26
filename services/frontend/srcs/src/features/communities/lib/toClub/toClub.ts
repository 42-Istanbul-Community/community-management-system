import type { ApiCommunity } from '@/features/communities/api'
import { getInitials } from '@/lib'
import type { Club } from '@/mocks'

export function toClub(community: ApiCommunity): Club {
  return {
    slug: community.slug,
    name: community.name,
    initials: getInitials(community.name),
    description: community.description ?? '',
    tags: [],
    memberCount: 0,
    createdAt: community.created_at,
    access: community.access,
  }
}
