import type { ApiCommunity } from '@/features/communities/api'
import type { Club } from '@/mocks'

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? '')
    .join('')
    .toLocaleUpperCase('tr')
}

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
