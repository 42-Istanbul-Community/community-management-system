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
