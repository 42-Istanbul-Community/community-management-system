import type {
  ApiEvent,
  Attachment,
  CommunityEvent,
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

export function toEvent(
  event: ApiEvent,
  communitySlug: string,
): CommunityEvent {
  return {
    id: event.id,
    communitySlug,
    title: event.title,
    description: event.content,
    startAt: event.startAt,
    endAt: event.endAt,
    location: null,
    capacity: event.capacity > 0 ? event.capacity : null,
    participantCount: 0,
    attachments: (event.attachments ?? []).map(toAttachment),
    isJoined: event.isJoined ?? false,
  }
}
