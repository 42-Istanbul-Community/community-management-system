import type {
  CommunitiesQuery,
  CommunitiesResponse,
  CommunityRequestResponse,
  CommunityRequestsQuery,
  CommunityRequestsResponse,
  CommunityResponse,
  CreateCommunityPayload,
} from './communities.types'
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

export function getCommunity(slug: string) {
  return apiRequest<CommunityResponse>(`/community/communities/${slug}`)
}

// export function getCommunityRequests() {
//   return apiRequest<CommunityRequestsResponse>('/community/communityRequests')
// }

export function getCommunityRequests(query: CommunityRequestsQuery = {}) {
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  if (query.status) params.set('status', query.status)
  if (query.createdAt) params.set('created_at', query.createdAt)

  const search = params.toString()

  return apiRequest<CommunityRequestsResponse>(
    `/community/communityRequests${search ? `?${search}` : ''}`,
  )
}

export function createCommunity(payload: CreateCommunityPayload) {
  const formData = new FormData()

  formData.append('name', payload.name)
  formData.append('description', payload.description)
  formData.append('message', payload.message)
  formData.append('access', payload.access)
  formData.append('visibility', payload.visibility)
  payload.tags.forEach((tag) => formData.append('tags', tag))

  if (payload.rules) formData.append('file', payload.rules)

  return apiRequest<CommunityRequestResponse>('/community/createCommunity', {
    method: 'POST',
    body: formData,
  })
}
