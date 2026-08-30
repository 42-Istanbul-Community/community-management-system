export type ContentVisibility =
  'all' | 'community_page' | 'member' | 'moderator'

export type ContentAccess = 'all' | 'member' | 'moderator'

export type ApiAttachment = {
  url: string
  type: string
}

export type ApiAnnouncement = {
  id: string
  communityId: string
  authorId: string
  title: string
  content: string
  attachments: ApiAttachment[] | null
  visibility: ContentVisibility
  pinnedUntil: string | null
  createdAt: string
}

export type AnnouncementsResponse = {
  announcements: ApiAnnouncement[]
}

export type ApiEvent = {
  id: string
  communityId: string
  authorId: string
  title: string
  content: string
  capacity: number
  attachments: ApiAttachment[] | null
  access: ContentAccess
  visibility: ContentVisibility
  startAt: string
  endAt: string
  createdAt: string
}

export type EventsResponse = {
  events: ApiEvent[]
}

export type ContentQuery = {
  communityId: string
  page?: number
  limit?: number
}

export type AttachmentKind = 'image' | 'file'

export type Attachment = {
  id: string
  name: string
  url: string
  kind: AttachmentKind
  size: number
  mimeType: string
}

export type Announcement = {
  id: string
  communitySlug: string
  title: string
  content: string
  authorName: string
  pinned: boolean
  createdAt: string
  attachments: Attachment[]
}

export type CommunityEvent = {
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
