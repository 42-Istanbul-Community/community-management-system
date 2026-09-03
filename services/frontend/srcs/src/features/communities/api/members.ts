import type { UserCommunitiesResponse } from './members.types'
import { apiRequest } from '@/lib'

export function getUserCommunities(userId: string) {
  return apiRequest<UserCommunitiesResponse>(
    `/membership/userCommunity/${userId}`,
  )
}
