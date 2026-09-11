import { hash } from '../generate'
import type { ApiCommunity, Community } from '@/features/communities/api'
import { getInitials } from '@/lib'

export function toCommunity(community: ApiCommunity): Community {
  const seed = hash(community.slug)

  return {
    id: community.id,
    slug: community.slug,
    name: community.name,
    initials: getInitials(community.name),
    description: community.description ?? '',
    picture: community.picture,
    backgroundPicture: community.background_picture,
    tags: community.tags ?? [],
    createdAt: community.created_at,
    access: community.access,
    visibility: community.visibility,
    rulesPath: community.rules_path,
    status: community.status,
    memberCount: 12 + (seed % 240),
  }
}
