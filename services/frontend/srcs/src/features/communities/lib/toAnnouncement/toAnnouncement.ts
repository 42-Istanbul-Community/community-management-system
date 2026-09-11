import type {
  Announcement,
  ApiAnnouncement,
  Attachment,
} from '@/features/communities/api'

function toAttachment(
  attachment: { url: string; type: string },
  index: number,
): Attachment {
  const name = attachment.url.split('/').pop() ?? `ek-${index + 1}`

  return {
    id: `${index}`,
    name,
    url: attachment.url,
    kind: attachment.type === 'image' ? 'image' : 'file',
    size: 0,
    mimeType: attachment.type,
  }
}

export function toAnnouncement(
  announcement: ApiAnnouncement,
  communitySlug: string,
): Announcement {
  return {
    id: announcement.id,
    communitySlug,
    title: announcement.title,
    content: announcement.content,
    authorId: announcement.authorId,
    authorName: 'Kulüp yöneticisi',
    pinned: announcement.pinned,
    createdAt: announcement.createdAt,
    attachments: (announcement.attachments ?? []).map(toAttachment),
  }
}
