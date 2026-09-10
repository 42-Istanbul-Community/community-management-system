import type {
  ApiCommunityAccess,
  ApiCommunityVisibility,
  CommunityMemberRole,
} from './communities.types'

export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export type Application = {
  id: string
  applicantName: string
  message: string | null
  status: ApplicationStatus
  createdAt: string
}

export type ApiUserCommunity = {
  id: string
  name: string
  description: string | null
  visibility: ApiCommunityVisibility
  accessibility: ApiCommunityAccess
  created_at: string
}

export type UserCommunitiesResponse = {
  communities: ApiUserCommunity[]
}

export type JoinCommunityPayload = {
  communityId: string
  message?: string
}

export type JoinedResponse = {
  id: string
  community_id: string
  user_id: string
  role: CommunityMemberRole
  joined_at: string
}

export type MembershipRequest = {
  id: string
  community_id: string
  user_id: string
  status: ApplicationStatus
  message: string | null
  created_at: string
  reviewed_at: string | null
  reviewed_by: string | null
}

export type JoinCommunityResponse = JoinedResponse | MembershipRequest

export type UserRequestsResponse = {
  requests: MembershipRequest[]
}

export type ApiCommunityMember = {
  id: string
  user_id: string
  community_id: string
  role: CommunityMemberRole
  joined_at: string
}

export type CommunityMembersResponse = {
  members: ApiCommunityMember[]
}
