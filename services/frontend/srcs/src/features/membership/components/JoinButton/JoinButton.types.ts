import type { ApiCommunityAccess } from '@/features/communities/api'

export type JoinButtonProps = {
  communityId: string
  communitySlug: string
  access: ApiCommunityAccess
}
