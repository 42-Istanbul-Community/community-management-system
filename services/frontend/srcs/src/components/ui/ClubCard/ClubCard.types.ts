import type { Club } from '@/mocks'

export type ClubCardProps = Pick<
  Club,
  | 'name'
  | 'slug'
  | 'initials'
  | 'description'
  | 'tags'
  | 'memberCount'
  | 'access'
>
