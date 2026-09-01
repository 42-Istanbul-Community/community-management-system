import type {
  AnnouncementsResponse,
  ContentQuery,
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

export function getEvents(query: ContentQuery) {
  return apiRequest<EventsResponse>(`/content/events?${buildQuery(query)}`)
}
