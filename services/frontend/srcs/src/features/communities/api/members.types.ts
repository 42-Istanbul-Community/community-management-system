import type { CommunityMemberRole } from './communities.types'

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
  community_id: string
  user_id: string
  role: CommunityMemberRole
  joined_at: string
}

export type UserCommunitiesResponse = {
  communities: ApiUserCommunity[]
}
