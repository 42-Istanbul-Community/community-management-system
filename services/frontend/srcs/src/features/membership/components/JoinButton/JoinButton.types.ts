import type { ApiCommunityAccess } from '@/features/communities/api'

export type JoinButtonProps = {
  communityId: string
  access: ApiCommunityAccess
}
