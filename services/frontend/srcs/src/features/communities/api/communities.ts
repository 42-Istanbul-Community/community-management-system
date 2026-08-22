import type { CommunitiesQuery, CommunitiesResponse } from './communities.types'
import { apiRequest } from '@/lib'

export function getCommunities(query: CommunitiesQuery = {}) {
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  if (query.status) params.set('status', query.status)
  if (query.createdAt) params.set('created_at', query.createdAt)
  if (query.tags?.length) params.set('tags', query.tags.join(','))

  const search = params.toString()

  return apiRequest<CommunitiesResponse>(
    `/community/communities${search ? `?${search}` : ''}`,
  )
}
