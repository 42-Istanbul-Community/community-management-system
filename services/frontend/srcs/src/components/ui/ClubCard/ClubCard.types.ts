export type ClubAccess = 'open' | 'restricted' | 'closed'

export type ClubCardProps = {
  name: string
  slug: string
  initials: string
  description: string
  tags: string[]
  memberCount: string
  access: ClubAccess
}
