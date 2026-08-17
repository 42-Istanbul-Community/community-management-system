export type ClubAccess = 'open' | 'restricted' | 'closed'

export type Club = {
  slug: string
  name: string
  initials: string
  description: string
  tags: string[]
  memberCount: number
  createdAt: string
  access: ClubAccess
}
