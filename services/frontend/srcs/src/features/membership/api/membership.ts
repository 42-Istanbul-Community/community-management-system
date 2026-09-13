import type {
  CommunityMembersResponse,
  JoinCommunityPayload,
  JoinCommunityResponse,
  JoinRequestsResponse,
  ResolveJoinRequestsPayload,
  ResolveJoinRequestsResponse,
  UserCommunitiesResponse,
  UserRoleResponse,
} from './membership.types'
import { apiRequest } from '@/lib'

/**
 * GET /membership/userCommunity/:userId
 * The communities a user is a member of.
 */
export function getUserCommunities(userId: string) {
  return apiRequest<UserCommunitiesResponse>(
    `/membership/userCommunity/${userId}`,
  )
}

/**
 * GET /membership/userRequests/:userId
 * The join requests a user has sent.
 */
export function getUserJoinRequests(userId: string) {
  return apiRequest<JoinRequestsResponse>(`/membership/userRequests/${userId}`)
}

/**
 * GET /membership/members/:communityId
 * The members of a community, ordered by role.
 */
export function getCommunityMembers(communityId: string) {
  return apiRequest<CommunityMembersResponse>(
    `/membership/members/${communityId}`,
  )
}

/**
 * GET /membership/communityRequests/:communityId
 * The join requests sent to a community. Needs a moderator role.
 */
export function getCommunityJoinRequests(communityId: string) {
  return apiRequest<JoinRequestsResponse>(
    `/membership/communityRequests/${communityId}`,
  )
}

/**
 * GET /membership/userRole/:userId/:communityId
 * The role a user has in a community. Returns `normal` when not a member.
 */
export function getUserRole(userId: string, communityId: string) {
  return apiRequest<UserRoleResponse>(
    `/membership/userRole/${userId}/${communityId}`,
  )
}

/**
 * POST /membership/communityRequests
 * Open communities add the user right away. Restricted ones create a
 * request that a moderator has to accept.
 */
export function joinCommunity(payload: JoinCommunityPayload) {
  return apiRequest<JoinCommunityResponse>('/membership/communityRequests', {
    method: 'POST',
    body: payload,
  })
}

/**
 * DELETE /membership/leaveCommunity/:communityId
 * Ends the user's own membership.
 */
export function leaveCommunity(communityId: string) {
  return apiRequest<{ message: string }>(
    `/membership/leaveCommunity/${communityId}`,
    { method: 'DELETE' },
  )
}

/**
 * PUT /membership/communityRequests/resolve
 * Accepts or rejects join requests. Takes more than one at a time.
 */
export function resolveJoinRequests(payload: ResolveJoinRequestsPayload) {
  return apiRequest<ResolveJoinRequestsResponse>(
    '/membership/communityRequests/resolve',
    { method: 'PUT', body: payload },
  )
}
