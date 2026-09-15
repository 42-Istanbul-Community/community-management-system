export type ApiCommunityStatus = 'active' | 'inactive'
export type ApiCommunityVisibility = 'public' | 'private'
export type ApiCommunityAccess = 'open' | 'restricted' | 'closed'

/** A member's role inside a community. */
export type CommunityMemberRole = 'member' | 'moderator' | 'admin'

/** The state of a community creation request. */
export type CommunityRequestStatus = 'pending' | 'approved' | 'rejected'

/** The shape the pages work with, mapped from ApiCommunity. */
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

/** A community as the API returns it. */
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
  memberCount?: number
}

/** A request to open a new community, waiting for a superadmin. */
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

/** GET /orchestration/communities */
export type CommunitiesQuery = {
  cursor?: number
  limit?: number
  sortBy?: 'created_at' | 'member_count' | 'activity'
  order?: 'asc' | 'desc'
  status?: ApiCommunityStatus
  access?: ApiCommunityAccess
  tags?: string[]
  text?: string
}

/** GET /community/communityRequests */
export type CommunityRequestsQuery = {
  page?: number
  limit?: number
  status?: CommunityRequestStatus
  createdAt?: 'asc' | 'desc'
}

/** POST /community/createCommunity */
export type CreateCommunityPayload = {
  name: string
  description: string
  message: string
  access: ApiCommunityAccess
  visibility: ApiCommunityVisibility
  tags: string[]
  rules?: File
}

/** PUT /community/communities/:slug — send at least one field. */
export type UpdateCommunityPayload = {
  description?: string
  picture?: File
  backgroundPicture?: File
  rulesPath?: File
  visibility?: ApiCommunityVisibility
  access?: ApiCommunityAccess
  status?: ApiCommunityStatus
  tags?: string[]
}

/** POST /orchestration/manage_communities */
export type ManageCommunityRequestsPayload = {
  requestIds: { id: string; status: 'approved' | 'rejected' }[]
}

/** GET /orchestration/communities */
export type CommunitiesResponse = {
  status: string
  communities: ApiCommunity[]
  nextCursor: number | null
}

/**
 * GET /community/communities/:slug
 * PUT /community/communities/:slug
 */
export type CommunityResponse = {
  community: ApiCommunity
}

/** POST /community/createCommunity */
export type CommunityRequestResponse = {
  communityRequest: ApiCommunityRequest
}

/** GET /community/communityRequests */
export type CommunityRequestsResponse = {
  communityRequests: ApiCommunityRequest[]
}

/** POST /orchestration/manage_communities */
export type ManageCommunityRequestsResponse = {
  status: string
  message?: string
  success: { communityId: string; adminId: string }[]
  errors?: { id: string; error: unknown }[]
}

/** A tag, as the API returns it. */
export type ApiTag = {
  id: string
  name: string
}

/** GET /community/tags */
export type TagsResponse = {
  tags: ApiTag[]
}
