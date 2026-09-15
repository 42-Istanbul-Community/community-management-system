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
import { apiRequest, buildQuery } from '@/lib'
import type { AxiosProgressEvent } from 'axios'

/**
 * GET /orchestration/communities
 * The community list. Private ones only show up for members.
 */
export function getCommunities(query: CommunitiesQuery = {}) {
  const search = buildQuery({
    cursor: query.cursor,
    limit: query.limit,
    sort_by: query.sortBy,
    order: query.order,
    status: query.status,
    access: query.access,
    tags: query.tags?.length ? query.tags.join(',') : undefined,
    text: query.text,
  })

  return apiRequest<CommunitiesResponse>(`/orchestration/communities${search}`)
}

/**
 * GET /community/communities/:slug
 * One community by its slug.
 */
export function getCommunity(slug: string) {
  return apiRequest<CommunityResponse>(`/community/communities/${slug}`)
}

/**
 * GET /community/communityRequests
 * Community creation requests. Superadmins see all of them, everyone else
 * only their own.
 */
export function getCommunityRequests(query: CommunityRequestsQuery = {}) {
  const search = buildQuery({
    page: query.page,
    limit: query.limit,
    status: query.status,
    created_at: query.createdAt,
  })

  return apiRequest<CommunityRequestsResponse>(
    `/community/communityRequests${search}`,
  )
}

/**
 * POST /community/createCommunity
 * Asks a superadmin to open a new community.
 */
export function createCommunity(
  payload: CreateCommunityPayload,
  onUploadProgress?: (event: AxiosProgressEvent) => void,
) {
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
    onUploadProgress,
  })
}

/**
 * PUT /community/communities/:slug
 * Updates a community. Only the fields that changed are sent.
 */
export function updateCommunity(
  slug: string,
  payload: UpdateCommunityPayload,
  onUploadProgress?: (event: AxiosProgressEvent) => void,
) {
  const formData = new FormData()

  if (payload.description !== undefined)
    formData.append('description', payload.description)
  if (payload.visibility) formData.append('visibility', payload.visibility)
  if (payload.access) formData.append('access', payload.access)
  if (payload.status) formData.append('status', payload.status)
  payload.tags?.forEach((tag) => formData.append('tags', tag))

  if (payload.picture) formData.append('pic', payload.picture)
  if (payload.backgroundPicture)
    formData.append('back_pic', payload.backgroundPicture)
  if (payload.rulesPath) formData.append('file', payload.rulesPath)

  return apiRequest<CommunityResponse>(`/community/communities/${slug}`, {
    method: 'PUT',
    body: formData,
    onUploadProgress,
  })
}

/**
 * DELETE /orchestration/communities/:slug
 * Removes a community with everything in it.
 */
export function deleteCommunity(slug: string) {
  return apiRequest<{ status: string; message: string }>(
    `/orchestration/communities/${slug}`,
    { method: 'DELETE' },
  )
}

/**
 * POST /orchestration/manage_communities
 * Approves or rejects community creation requests. Superadmin only.
 */
export function manageCommunityRequests(
  payload: ManageCommunityRequestsPayload,
) {
  return apiRequest<ManageCommunityRequestsResponse>(
    '/orchestration/manage_communities',
    { method: 'POST', body: payload },
  )
}
