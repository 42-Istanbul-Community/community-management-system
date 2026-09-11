import type {
  AnnouncementResponse,
  AnnouncementsResponse,
  ContentQuery,
  EventResponse,
  EventsResponse,
} from './content.types'
import { apiRequest } from '@/lib'

function buildQuery({ communityId, page, limit }: ContentQuery) {
  const params = new URLSearchParams({ communityId })
  if (page) params.set('page', String(page))
  if (limit) params.set('limit', String(limit))
  return params.toString()
}

export function getAnnouncements(query: ContentQuery) {
  return apiRequest<AnnouncementsResponse>(
    `/content/announcements?${buildQuery(query)}`,
  )
}

export function getAnnouncement(id: string) {
  return apiRequest<AnnouncementResponse>(`/content/announcements/${id}`)
}

export function getEvents(query: ContentQuery) {
  return apiRequest<EventsResponse>(`/content/events?${buildQuery(query)}`)
}

export function getEvent(id: string) {
  return apiRequest<EventResponse>(`/content/events/${id}`)
}

export function joinEvent(eventId: string) {
  return apiRequest<{ participant: unknown }>(
    `/content/events/${eventId}/participants`,
    { method: 'POST' },
  )
}

export function leaveEvent(eventId: string) {
  return apiRequest<{ message: string }>(
    `/content/events/${eventId}/participants`,
    { method: 'DELETE' },
  )
}
