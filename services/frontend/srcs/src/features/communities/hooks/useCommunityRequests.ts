// import { getCommunityRequests } from '@/features/communities/api'
// import { useAuthStore } from '@/stores'
// import { useQuery } from '@tanstack/react-query'
// export function useCommunityRequests() {
//   const userId = useAuthStore((state) => state.user?.id)
//   return useQuery({
//     queryKey: ['communityRequests', userId],
//     queryFn: getCommunityRequests,
//     select: (data) => data.communityRequests,
//     enabled: Boolean(userId),
//     retry: false,
//   })
// }
import { getCommunityRequests } from '@/features/communities/api'
import { useAuthStore } from '@/stores'
import { useQuery } from '@tanstack/react-query'

export function useCommunityRequests() {
  const userId = useAuthStore((state) => state.user?.id)

  return useQuery({
    queryKey: ['communityRequests', userId],
    queryFn: () => getCommunityRequests({ limit: 2, createdAt: 'desc' }),
    select: (data) => data.communityRequests,
    enabled: Boolean(userId),
    retry: false,
  })
}
