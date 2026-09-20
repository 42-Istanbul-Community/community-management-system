/** Who can see a piece of content. */
export type ContentVisibility = 'all' | 'member' | 'moderator'

/** Who can take part in an event. */
export type ContentAccess = 'all' | 'member' | 'moderator'

/** Where a user stands for an event. */
export type EventParticipantStatus =
  'requested' | 'joined' | 'rejected' | 'no_show'

/** Shows if the attachment is an image or a file. */
export type AttachmentKind = 'image' | 'file'

/** An attachment as the pages use it. */
export type Attachment = {
  id: string
  name: string
  url: string
  needsAuth: boolean
  kind: AttachmentKind
  size: number
  mimeType: string
}

/** An announcement as the pages use it, mapped from ApiAnnouncement. */
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

/** An event as the pages use it, mapped from ApiEvent. */
export type CommunityEvent = {
  id: string
  communitySlug: string
  title: string
  description: string
  authorId: string
  startAt: string
  endAt: string | null
  capacity: number | null
  participantCount: number
  attachments: Attachment[]
  myStatus: EventParticipantStatus | null
}

/** An attachment as the API returns it. */
export type ApiAttachment = {
  url?: string
  key?: string
  name?: string
  size?: number
  type: string
}

/** An announcement as the API returns it. */
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

/** An event as the API returns it. */
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
  startAt: string
  endAt: string
  createdAt: string
  participantCount: number
  isJoined?: boolean
  myStatus?: EventParticipantStatus | null
}

/**
 * GET /content/announcements
 * GET /content/events
 */
export type ContentQuery = {
  communityId: string
  page?: number
  limit?: number
}

/** GET /content/announcements */
export type AnnouncementsResponse = {
  announcements: ApiAnnouncement[]
}

/** GET /content/announcements/:id */
export type AnnouncementResponse = {
  announcement: ApiAnnouncement
}

/** GET /content/events */
export type EventsResponse = {
  events: ApiEvent[]
}

/** GET /content/events/:id */
export type EventResponse = {
  event: ApiEvent
}

/** POST /content/announcements */
export type CreateAnnouncementPayload = {
  communityId: string
  title: string
  content: string
  pinned?: boolean
  visibility?: ContentVisibility
  attachment?: File
}

/** POST /content/events */
export type CreateEventPayload = {
  communityId: string
  title: string
  content: string
  endAt: string
  startAt?: string
  capacity?: number
  visibility?: ContentVisibility
  attachment?: File
}

/** PUT /content/announcements/:id */
export type UpdateAnnouncementPayload = {
  title?: string
  content?: string
  pinned?: boolean
  visibility?: ContentVisibility
  attachment?: File
  removeAttachment?: boolean
}

/** PUT /content/events/:id */
export type UpdateEventPayload = {
  title?: string
  content?: string
  capacity?: number
  startAt?: string
  endAt?: string
  visibility?: ContentVisibility
  attachment?: File
  removeAttachment?: boolean
}

/** An event participant as the API returns it. */
export type ApiEventParticipant = {
  id: string
  eventId: string
  userId: string
  status: EventParticipantStatus
  joinedAt: string
}

/** GET /content/events/:id/participants */
export type EventParticipantsResponse = {
  participants: ApiEventParticipant[]
}
