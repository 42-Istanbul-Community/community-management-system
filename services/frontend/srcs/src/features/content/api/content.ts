import type {
  AnnouncementResponse,
  AnnouncementsResponse,
  ContentQuery,
  CreateAnnouncementPayload,
  CreateEventPayload,
  EventResponse,
  EventsResponse,
} from './content.types'
import { apiRequest, buildQuery } from '@/lib'
import type { AxiosProgressEvent } from 'axios'

/**
 * GET /content/announcements
 * The announcements of a community. What comes back depends on the
 * reader's role.
 */
export function getAnnouncements(query: ContentQuery) {
  return apiRequest<AnnouncementsResponse>(
    `/content/announcements${buildQuery(query)}`,
  )
}

/**
 * GET /content/announcements/:id
 * One announcement.
 */
export function getAnnouncement(id: string) {
  return apiRequest<AnnouncementResponse>(`/content/announcements/${id}`)
}

/**
 * POST /content/announcements
 * Shares a new announcement with the community. Needs a moderator role.
 */
export function createAnnouncement(
  payload: CreateAnnouncementPayload,
  onUploadProgress?: (event: AxiosProgressEvent) => void,
) {
  const formData = new FormData()

  formData.append('communityId', payload.communityId)
  formData.append('title', payload.title)
  formData.append('content', payload.content)
  if (payload.pinned !== undefined)
    formData.append('pinned', String(payload.pinned))
  if (payload.visibility) formData.append('visibility', payload.visibility)
  if (payload.attachment) formData.append('file', payload.attachment)

  return apiRequest<AnnouncementResponse>('/content/announcements', {
    method: 'POST',
    body: formData,
    onUploadProgress,
  })
}

/**
 * GET /content/events
 * The events of a community. Each one says whether the reader joined.
 */
export function getEvents(query: ContentQuery) {
  return apiRequest<EventsResponse>(`/content/events${buildQuery(query)}`)
}

/**
 * GET /content/events/:id
 * One event.
 */
export function getEvent(id: string) {
  return apiRequest<EventResponse>(`/content/events/${id}`)
}

/**
 * POST /content/events
 * Creates a new event for the community. Needs a moderator role.
 */
export function createEvent(
  payload: CreateEventPayload,
  onUploadProgress?: (event: AxiosProgressEvent) => void,
) {
  const formData = new FormData()

  formData.append('communityId', payload.communityId)
  formData.append('title', payload.title)
  formData.append('content', payload.content)
  formData.append('endAt', payload.endAt)
  if (payload.startAt) formData.append('startAt', payload.startAt)
  if (payload.capacity !== undefined)
    formData.append('capacity', String(payload.capacity))
  if (payload.visibility) formData.append('visibility', payload.visibility)
  if (payload.attachment) formData.append('file', payload.attachment)

  return apiRequest<EventResponse>('/content/events', {
    method: 'POST',
    body: formData,
    onUploadProgress,
  })
}

/**
 * POST /content/events/:eventId/participants
 * Adds the signed-in user to an event.
 */
export function joinEvent(eventId: string) {
  return apiRequest<{ participant: unknown }>(
    `/content/events/${eventId}/participants`,
    { method: 'POST' },
  )
}

/**
 * DELETE /content/events/:eventId/participants
 * Removes the signed-in user from an event.
 */
export function leaveEvent(eventId: string) {
  return apiRequest<{ message: string }>(
    `/content/events/${eventId}/participants`,
    { method: 'DELETE' },
  )
}
