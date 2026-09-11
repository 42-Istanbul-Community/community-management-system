export type ContentVisibility =
  'all' | 'community_page' | 'member' | 'moderator'

export type ContentAccess = 'all' | 'member' | 'moderator'

export type EventParticipantStatus = 'requested' | 'joined' | 'no_show'

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
  pinned: boolean
  attachments: ApiAttachment[] | null
  visibility: ContentVisibility
  createdAt: string
}

export type AnnouncementsResponse = {
  announcements: ApiAnnouncement[]
}

export type ApiEvent = {
  id: string
  communityId: string
  authorId: string
  capacity: number
  title: string
  content: string
  attachments: ApiAttachment[] | null
  pinnedUntil: string | null
  access: ContentAccess
  visibility: ContentVisibility
  accessStartAt: string | null
  accessEndAt: string | null
  startAt: string
  endAt: string
  createdAt: string

  isJoined?: boolean
  myStatus?: EventParticipantStatus | null
}

export type EventsResponse = {
  events: ApiEvent[]
}

export type EventResponse = {
  event: ApiEvent
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
  authorId: string
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
  isJoined: boolean
}

export type AnnouncementResponse = {
  announcement: ApiAnnouncement
}
