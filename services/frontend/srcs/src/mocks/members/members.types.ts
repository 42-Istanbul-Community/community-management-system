export type MemberRole = 'member' | 'moderator' | 'admin'

export type Member = {
  id: string
  communitySlug: string
  name: string
  role: MemberRole
  joinedAt: string
}
