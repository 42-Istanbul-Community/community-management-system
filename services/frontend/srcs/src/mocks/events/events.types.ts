import type { Attachment } from '@/mocks/announcements'

export type Event = {
  id: string
  communitySlug: string
  title: string
  description: string
  startAt: string
  endAt: string | null
  location: string | null
  capacity: number | null
  participantCount: number
  attachments: Attachment[]
}
