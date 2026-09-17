import { getUsers } from '@/features/auth/api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

/**
 * GET /id/users
 * A paginated, name-searchable listing of every user. Used by the
 * superadmin users page.
 */
export function useUserList(page: number, text: string) {
  return useQuery({
    queryKey: ['userList', page, text],
    queryFn: () => getUsers({ page, limit: 20, text: text || undefined }),
    placeholderData: keepPreviousData,
  })
}
