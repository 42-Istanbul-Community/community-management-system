import type { Community } from '@/features/communities/api'

export type CommunityCardProps = Pick<
  Community,
  | 'id'
  | 'name'
  | 'slug'
  | 'initials'
  | 'picture'
  | 'backgroundPicture'
  | 'description'
  | 'tags'
  | 'memberCount'
  | 'access'
>