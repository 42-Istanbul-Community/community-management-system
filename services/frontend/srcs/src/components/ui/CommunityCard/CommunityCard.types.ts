import type { Community } from '@/features/communities/api'

export type CommunityCardProps = Pick<
  Community,
  | 'name'
  | 'slug'
  | 'initials'
  | 'description'
  | 'tags'
  | 'memberCount'
  | 'access'
>
