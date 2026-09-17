import type { Announcement, ApiAnnouncement } from '@/features/content/api'
import { toAttachment } from '@/features/content/lib/toAttachment'

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
