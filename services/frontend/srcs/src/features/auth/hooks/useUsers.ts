import { getUsers } from '@/features/auth/api'
import { useQuery } from '@tanstack/react-query'

export function useUsers(ids: string[]) {
  const sorted = [...new Set(ids)].sort()

  return useQuery({
    queryKey: ['users', sorted],
    queryFn: () => getUsers(sorted),
    select: (data) =>
      Object.fromEntries(data.users.map((user) => [user.id, user])),
    enabled: sorted.length > 0,
  })
}
