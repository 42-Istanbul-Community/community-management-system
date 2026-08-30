import { hash, pick } from '../generate'
import type { ApiCommunity } from '@/features/communities/api'
import type { Community } from '@/features/communities/api'
import { getInitials } from '@/lib'

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

export function toCommunity(community: ApiCommunity): Community {
  const seed = hash(community.slug)

  return {
    id: community.id,
    slug: community.slug,
    name: community.name,
    initials: getInitials(community.name),
    description: community.description ?? '',
    createdAt: community.created_at,
    access: community.access,

    tags: [...new Set([pick(tagNames, seed), pick(tagNames, seed >>> 8)])],
    memberCount: 12 + (seed % 240),
  }
}
