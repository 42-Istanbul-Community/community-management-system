import type {
  JoinCommunityPayload,
  JoinCommunityResponse,
  UserCommunitiesResponse,
  UserRequestsResponse,
} from './members.types'
import { apiRequest } from '@/lib'

export function getUserCommunities(userId: string) {
  return apiRequest<UserCommunitiesResponse>(
    `/membership/userCommunity/${userId}`,
  )
}

export function getUserRequests(userId: string) {
  return apiRequest<UserRequestsResponse>(`/membership/userRequests/${userId}`)
}

export function joinCommunity(payload: JoinCommunityPayload) {
  return apiRequest<JoinCommunityResponse>('/membership/communityRequests', {
    method: 'POST',
    body: payload,
  })
}

export function leaveCommunity(communityId: string) {
  return apiRequest<{ message: string }>(
    `/membership/leaveCommunity/${communityId}`,
    { method: 'DELETE' },
  )
}
