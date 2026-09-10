import type {
  CommunityMembersResponse,
  CommunityRequestsResponse,
  JoinCommunityPayload,
  JoinCommunityResponse,
  ResolveRequestsPayload,
  ResolveRequestsResponse,
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

export function getCommunityMembers(communityId: string) {
  return apiRequest<CommunityMembersResponse>(
    `/membership/members/${communityId}`,
  )
}

export function getMembershipRequests(communityId: string) {
  return apiRequest<CommunityRequestsResponse>(
    `/membership/communityRequests/${communityId}`,
  )
}

export function resolveMembershipRequests(payload: ResolveRequestsPayload) {
  return apiRequest<ResolveRequestsResponse>(
    '/membership/communityRequests/resolve',
    { method: 'PUT', body: payload },
  )
}
