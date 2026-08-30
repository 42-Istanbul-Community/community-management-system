import type { ApiCommunity } from '@/features/communities/api'
import { getInitials } from '@/lib'
import type { Club } from '@/mocks'

const tagNames: string[] = [
  'Programming',
  'Design',
  'Gaming',
  'Music',
  'Movies',
  'Books',
  'Sports',
  'Art',
]

function hash(slug: string) {
  let value = 0
  for (let i = 0; i < slug.length; i++) {
    value = (value * 31 + slug.charCodeAt(i)) >>> 0
  }
  return value
}

export function toClub(community: ApiCommunity): Club {
  const seed = hash(community.slug)

  return {
    id: community.id,
    slug: community.slug,
    name: community.name,
    initials: getInitials(community.name),
    description: community.description ?? '',
    createdAt: community.created_at,
    access: community.access,

    tags: [tagNames[seed % 8], tagNames[(seed >> 8) % 8]],
    memberCount: 12 + (seed % 240),
  }
}
