import type { Community } from '@/features/communities/api'

export type ClubCardProps = Pick<
  Community,
  | 'name'
  | 'slug'
  | 'initials'
  | 'description'
  | 'tags'
  | 'memberCount'
  | 'access'
>
