import type {
  AnnouncementResponse,
  AnnouncementsResponse,
  ContentQuery,
  EventResponse,
  EventsResponse,
} from './content.types'
import { apiRequest } from '@/lib'

/** Turns the query object into a search string for the content endpoints. */
function buildQuery({ communityId, page, limit }: ContentQuery) {
  const params = new URLSearchParams({ communityId })
  if (page) params.set('page', String(page))
  if (limit) params.set('limit', String(limit))
  return params.toString()
}

/**
 * GET /content/announcements
 * The announcements of a community. What comes back depends on the
 * reader's role.
 */
export function getAnnouncements(query: ContentQuery) {
  return apiRequest<AnnouncementsResponse>(
    `/content/announcements?${buildQuery(query)}`,
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
 * GET /content/events
 * The events of a community. Each one says whether the reader joined.
 */
export function getEvents(query: ContentQuery) {
  return apiRequest<EventsResponse>(`/content/events?${buildQuery(query)}`)
}

/**
 * GET /content/events/:id
 * One event.
 */
export function getEvent(id: string) {
  return apiRequest<EventResponse>(`/content/events/${id}`)
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
