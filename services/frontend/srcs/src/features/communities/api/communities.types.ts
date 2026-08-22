export type ApiCommunityStatus = 'active' | 'inactive'
export type ApiCommunityVisibility = 'public' | 'private'
export type ApiCommunityAccess = 'open' | 'restricted' | 'closed'

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
}

export type CommunitiesResponse = {
  communities: ApiCommunity[]
}

export type CommunitiesQuery = {
  page?: number
  limit?: number
  status?: ApiCommunityStatus
  createdAt?: 'asc' | 'desc'
  tags?: string[]
}
