import { hash, pick } from './hash'
import type { CommunityMemberRole } from '@/features/communities/api'

const firstNames = [
  'Elif',
  'Mert',
  'Zeynep',
  'Can',
  'Aslı',
  'Deniz',
  'Burak',
  'Selin',
  'Emre',
  'Nazlı',
  'Kerem',
  'İpek',
  'Onur',
  'Melis',
  'Yiğit',
  'Derya',
]

const lastNames = [
  'Kaya',
  'Aydın',
  'Demir',
  'Yılmaz',
  'Şahin',
  'Arslan',
  'Çelik',
  'Koç',
  'Doğan',
  'Öztürk',
  'Aksoy',
  'Yıldız',
  'Kılıç',
  'Tan',
  'Bulut',
  'Şen',
]

export type GeneratedMember = {
  id: string
  name: string
  role: CommunityMemberRole
  joinedAt: string
}

export function generateMembers(
  communityId: string,
  count: number,
): GeneratedMember[] {
  const base = hash(communityId)

  return Array.from({ length: count }, (_, index) => {
    const seed = hash(`${communityId}:${index}`)
    const name = `${pick(firstNames, seed)} ${pick(lastNames, seed >>> 8)}`

    const role: CommunityMemberRole =
      index === 0 ? 'admin' : index < 3 ? 'moderator' : 'member'

    const dayOffset = (seed + base) % 730
    const joinedAt = new Date(2024, 0, 1 + dayOffset).toISOString()

    return { id: `${communityId}-m${index}`, name, role, joinedAt }
  })
}
