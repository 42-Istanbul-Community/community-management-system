import type { ClubFilters } from './filterClubs.types'
import type { Community } from '@/features/communities/api'

export function filterClubs(clubs: Community[], filters: ClubFilters) {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase('tr')

  const filtered = clubs.filter((club) => {
    if (normalizedQuery) {
      const haystack = `${club.name} ${club.description}`.toLocaleLowerCase(
        'tr',
      )
      if (!haystack.includes(normalizedQuery)) return false
    }

    if (filters.access !== 'all' && club.access !== filters.access) return false

    if (filters.tags.length > 0) {
      const hasAllTags = filters.tags.every((tag) => club.tags.includes(tag))
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
