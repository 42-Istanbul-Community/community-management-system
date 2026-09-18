import type { ApiAttachment, Attachment } from '@/features/content/api'

/**
 * Seed data ships an absolute, public `url`. A real upload only has the
 * storage `key`, which the asset service only serves to an authenticated,
 * authorized viewer — `url` here is the relative API path to fetch it
 * from, not a directly usable link (see `needsAuth`).
 */
export function toAttachment(
  attachment: ApiAttachment,
  index: number,
): Attachment {
  const needsAuth = !attachment.url && Boolean(attachment.key)
  const source = attachment.url ?? `/asset/${attachment.key ?? ''}`
  const name = attachment.name ?? source.split('/').pop() ?? `ek-${index + 1}`

  return {
    id: `${index}`,
    name,
    url: source,
    needsAuth,
    kind: attachment.type === 'image' ? 'image' : 'file',
    size: attachment.size ?? 0,
    mimeType: attachment.type,
  }
}
