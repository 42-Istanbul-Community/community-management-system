import type { CommunityFilters } from './filterCommunities.types'
import type { Community } from '@/features/communities/api'

export function filterCommunities(communities: Community[], filters: CommunityFilters) {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase('tr')

  const filtered = communities.filter((community) => {
    if (normalizedQuery) {
      const haystack = `${community.name} ${community.description}`.toLocaleLowerCase(
        'tr',
      )
      if (!haystack.includes(normalizedQuery)) return false
    }

    if (filters.access !== 'all' && community.access !== filters.access) return false

    if (filters.tags.length > 0) {
      const hasAllTags = filters.tags.every((tag) => community.tags.includes(tag))
      if (!hasAllTags) return false
    }

    return true
  })

  return [...filtered].sort((a, b) => {
    if (filters.sort === 'name') return a.name.localeCompare(b.name, 'tr')
    if (filters.sort === 'newest') return b.createdAt.localeCompare(a.createdAt)
    return b.memberCount - a.memberCount
  })
}
