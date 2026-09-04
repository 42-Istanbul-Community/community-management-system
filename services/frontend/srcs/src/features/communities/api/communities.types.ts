export type ApiCommunityStatus = 'active' | 'inactive'
export type ApiCommunityVisibility = 'public' | 'private'
export type ApiCommunityAccess = 'open' | 'restricted' | 'closed'
export type CommunityMemberRole = 'member' | 'moderator' | 'admin'

export type ApiCommunity = {
  id: string
  name: string
  slug: string
  rules_path: string | null
  description: string | null
  status: ApiCommunityStatus
  visibility: ApiCommunityVisibility
  access: ApiCommunityAccess
  created_at: string
  tags?: string[]
}

export type CommunitiesResponse = {
  communities: ApiCommunity[]
}

export type CommunityResponse = {
  community: ApiCommunity
}

export type CommunitiesQuery = {
  page?: number
  limit?: number
  status?: ApiCommunityStatus
  createdAt?: 'asc' | 'desc'
  tags?: string[]
}

export type Community = {
  id: string
  slug: string
  name: string
  initials: string
  description: string
  tags: string[]
  memberCount: number
  createdAt: string
  access: ApiCommunityAccess
  rulesPath: string | null
  status: ApiCommunityStatus
}

export type CommunityRequestStatus = 'pending' | 'approved' | 'rejected'

export type ApiCommunityRequest = {
  id: string
  name: string
  status: CommunityRequestStatus
  user_id: string
  created_at: string
  rules_path: string | null
  description: string | null
  message: string | null
  tags: string[]
  access: ApiCommunityAccess
  visibility: ApiCommunityVisibility
  reviewed_by: string | null
  reviewed_at: string | null
}

export type CommunityRequestResponse = {
  communityRequest: ApiCommunityRequest
}

export type CreateCommunityPayload = {
  name: string
  description: string
  message: string
  access: ApiCommunityAccess
  visibility: ApiCommunityVisibility
  tags: string[]
  rules?: File
}

export type CommunityRequestsResponse = {
  communityRequests: ApiCommunityRequest[]
}

export type CommunityRequestsQuery = {
  page?: number
  limit?: number
  status?: CommunityRequestStatus
  createdAt?: 'asc' | 'desc'
}
