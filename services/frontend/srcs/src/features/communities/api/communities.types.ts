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
  picture: string | null
  background_picture: string | null
  status: ApiCommunityStatus
  visibility: ApiCommunityVisibility
  access: ApiCommunityAccess
  created_at: string
  tags: string[]
}

export type CommunitiesResponse = {
  status: string
  communities: ApiCommunity[]
  nextCursor: number | null
}
export type CommunityResponse = {
  community: ApiCommunity
}

export type CommunitiesQuery = {
  cursor?: number
  limit?: number
  sortBy?: 'created_at' | 'member_count' | 'activity'
  order?: 'asc' | 'desc'
  status?: ApiCommunityStatus
  access?: ApiCommunityAccess
  tags?: string[]
}

export type Community = {
  id: string
  slug: string
  name: string
  initials: string
  description: string
  picture: string | null
  backgroundPicture: string | null
  tags: string[]
  memberCount: number
  createdAt: string
  access: ApiCommunityAccess
  visibility: ApiCommunityVisibility
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

export type UpdateCommunityPayload = {
  name?: string
  description?: string
  picture?: File
  backgroundPicture?: File
  rulesPath?: File
  visibility?: ApiCommunityVisibility
  access?: ApiCommunityAccess
  status?: ApiCommunityStatus
  tags?: string[]
}

export type ManageCommunityRequestItem = {
  id: string
  status: 'approved' | 'rejected'
}

export type ManageCommunityRequestsPayload = {
  requestIds: ManageCommunityRequestItem[]
}

export type ManageCommunityRequestsResponse = {
  status: string
  message?: string
  success: { communityId: string; adminId: string }[]
  errors?: { id: string; error: unknown }[]
}
