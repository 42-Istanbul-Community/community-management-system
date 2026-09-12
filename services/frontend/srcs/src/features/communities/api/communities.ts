import type {
  CommunitiesQuery,
  CommunitiesResponse,
  CommunityRequestResponse,
  CommunityRequestsQuery,
  CommunityRequestsResponse,
  CommunityResponse,
  CreateCommunityPayload,
  ManageCommunityRequestsPayload,
  ManageCommunityRequestsResponse,
  UpdateCommunityPayload,
} from './communities.types'
import { apiRequest } from '@/lib'

export function getCommunities(query: CommunitiesQuery = {}) {
  const params = new URLSearchParams()

  if (query.cursor !== undefined) params.set('cursor', String(query.cursor))
  if (query.limit) params.set('limit', String(query.limit))
  if (query.sortBy) params.set('sort_by', query.sortBy)
  if (query.order) params.set('order', query.order)
  if (query.status) params.set('status', query.status)
  if (query.access) params.set('access', query.access)
  if (query.tags?.length) params.set('tags', query.tags.join(','))

  const search = params.toString()

  return apiRequest<CommunitiesResponse>(
    `/orchestration/communities${search ? `?${search}` : ''}`,
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

export function updateCommunity(slug: string, payload: UpdateCommunityPayload) {
  const formData = new FormData()

  if (payload.name !== undefined) formData.append('name', payload.name)
  if (payload.description !== undefined)
    formData.append('description', payload.description)
  if (payload.visibility) formData.append('visibility', payload.visibility)
  if (payload.access) formData.append('access', payload.access)
  if (payload.status) formData.append('status', payload.status)
  payload.tags?.forEach((tag) => formData.append('tags', tag))

  if (payload.picture) formData.append('pic', payload.picture)
  if (payload.backgroundPicture) formData.append('back_pic', payload.backgroundPicture)
  if (payload.rulesPath) formData.append('file', payload.rulesPath)

  console.log('FormData:', formData)
  return apiRequest<CommunityResponse>(`/community/communities/${slug}`, {
    method: 'PUT',
    body: formData,
  })
}

export function deleteCommunity(slug: string) {
  return apiRequest<{ status: string; message: string }>(
    `/orchestration/communities/${slug}`,
    { method: 'DELETE' },
  )
}

export function manageCommunityRequests(
  payload: ManageCommunityRequestsPayload,
) {
  return apiRequest<ManageCommunityRequestsResponse>(
    '/orchestration/communities',
    { method: 'POST', body: payload },
  )
}
