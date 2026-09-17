import type {
  ApiCommunity,
  CommunityMemberRole,
} from '@/features/communities/api'

/** The state of a join request. */
export type RequestStatus = 'pending' | 'approved' | 'rejected'

/** A user's role in a community. `normal` means they are not a member. */
export type CommunityRole = CommunityMemberRole | 'normal'

/** A member of a community. */
export type ApiCommunityMember = {
  id: string
  user_id: string
  community_id: string
  role: CommunityMemberRole
  joined_at: string
}

/** A membership. Open communities create one right away. */
export type ApiMembership = {
  id: string
  community_id: string
  user_id: string
  role: CommunityMemberRole
  joined_at: string
}

/** A request to join a community, waiting for an answer. */
export type ApiJoinRequest = {
  id: string
  community_id: string
  user_id: string
  status: RequestStatus
  message: string | null
  created_at: string
  reviewed_at: string | null
  reviewed_by: string | null
}

/** POST /membership/communityRequests */
export type JoinCommunityPayload = {
  communityId: string
  message?: string
}

/** POST /membership/communityRequests/resolve */
export type ResolveJoinRequestsPayload = {
  requestIds: string[]
  action: 'approve' | 'reject'
  communityId: string
}

/** GET /membership/userCommunity/:userId */
export type UserCommunitiesResponse = {
  communities: ApiCommunity[]
}

/** GET /membership/members/:communityId */
export type CommunityMembersResponse = {
  members: ApiCommunityMember[]
}

/** GET /membership/membercounts */
export type MemberCountsResponse = {
  counts: { community_id: string; count: number }[]
}

/** GET /membership/userRole/:userId/:communityId */
export type UserRoleResponse = {
  role: CommunityRole
}

/**
 * GET /membership/userRequests/:userId — what the user sent
 * GET /membership/communityRequests/:communityId — what a community got
 */
export type JoinRequestsResponse = {
  requests: ApiJoinRequest[]
}

/** POST /membership/communityRequests */
export type JoinCommunityResponse = ApiMembership | ApiJoinRequest

/** PUT /membership/communityRequests/resolve */
export type ResolveJoinRequestsResponse = {
  successfulRequests: ApiJoinRequest[]
  failedRequests?: { requestId: string; error: string }[]
}

/** What a moderator is allowed to do in a community. */
export type ModeratorPermission =
  | 'seeRequests'
  | 'resolveRequests'
  | 'kickMembers'
  | 'setPermissions'
  | 'setVisibility'
  | 'setAccessibility'
  | 'setDescription'
  | 'setRules'
  | 'setStatus'
  | 'setPicture'
  | 'setBackgroundPicture'
  | 'setTags'

/** GET /membership/moderatorPermissions/:communityId */
export type ModeratorPermissionsResponse = {
  id: string
  community_id: string
  permission: ModeratorPermission[]
}

/** PUT /membership/moderatorPermissions/:communityId */
export type UpdateModeratorPermissionsPayload = {
  permissions: ModeratorPermission[]
}

/** POST /membership/kickMember */
export type KickMemberPayload = {
  communityId: string
  userId: string
}
