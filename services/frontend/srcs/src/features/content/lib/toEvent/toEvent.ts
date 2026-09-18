import type { ApiEvent, CommunityEvent } from '@/features/content/api'
import { toAttachment } from '@/features/content/lib/toAttachment'

export function toEvent(
  event: ApiEvent,
  communitySlug: string,
): CommunityEvent {
  return {
    id: event.id,
    communitySlug,
    title: event.title,
    description: event.content,
    authorId: event.authorId,
    startAt: event.startAt,
    endAt: event.endAt,
    location: null,
    capacity: event.capacity > 0 ? event.capacity : null,
    participantCount: event.participantCount,
    attachments: (event.attachments ?? []).map(toAttachment),
    isJoined: event.isJoined ?? false,
  }
}
