import { getCommunityMembers } from '@/features/communities/api'
import { useQuery } from '@tanstack/react-query'

export function useCommunityMembers(communityId: string | undefined) {
  return useQuery({
    queryKey: ['communityMembers', communityId],
    queryFn: () => getCommunityMembers(communityId!),
    select: (data) => data.members,
    enabled: Boolean(communityId),
  })
}
