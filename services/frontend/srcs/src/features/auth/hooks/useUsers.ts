import { getUsers } from '@/features/auth/api'
import { useQuery } from '@tanstack/react-query'

/**
 * GET /id/users
 * Fetches several users at once and returns them keyed by id, so a list
 * can look each row up without one call per row. The ids are sorted and
 * deduped to keep the cache key stable.
 */
export function useUsers(ids: string[]) {
  const sorted = [...new Set(ids)].sort()

  return useQuery({
    queryKey: ['users', sorted],
    queryFn: () => getUsers({ ids: sorted }),
    select: (data) =>
      Object.fromEntries(data.users.map((user) => [user.id, user])),
    enabled: sorted.length > 0,
  })
}
