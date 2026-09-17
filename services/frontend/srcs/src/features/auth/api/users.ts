import type {
  UpdateUserPayload,
  UserResponse,
  UsersQuery,
  UsersResponse,
} from './users.types'
import { apiRequest, buildQuery } from '@/lib'
import type { AxiosProgressEvent } from 'axios'

/**
 * GET /id/
 * The signed-in user's own profile.
 */
export function getMe() {
  return apiRequest<UserResponse>('/id/')
}

/**
 * GET /id/:userId
 * One user by id.
 */
export function getUser(userId: string) {
  return apiRequest<UserResponse>(`/id/${userId}`)
}

/**
 * GET /id/users
 * Names and pictures for a set of users, so a list does not need one call
 * per row.
 */
export function getUsers(query: UsersQuery = {}) {
  const search = buildQuery({
    ids: query.ids?.length ? query.ids.join(',') : undefined,
    page: query.page,
    limit: query.limit,
    text: query.text,
  })

  return apiRequest<UsersResponse>(`/id/users${search}`)
}

/**
 * PUT /id/:userId
 * Updates the display name, picture and/or background picture.
 */
export function updateUser(
  userId: string,
  payload: UpdateUserPayload,
  onUploadProgress?: (event: AxiosProgressEvent) => void,
) {
  const formData = new FormData()

  if (payload.name !== undefined) formData.append('name', payload.name)
  if (payload.picture) formData.append('picture', payload.picture)
  if (payload.backgroundPicture)
    formData.append('background_picture', payload.backgroundPicture)

  return apiRequest<UserResponse>(`/id/${userId}`, {
    method: 'PUT',
    body: formData,
    onUploadProgress,
  })
}

/**
 * DELETE /id/pics/:userId
 * Removes the picture, the background picture, or both when neither flag
 * is passed.
 */
export function deleteUserPictures(
  userId: string,
  target: { picture?: boolean; backgroundPicture?: boolean } = {},
) {
  const search = buildQuery({
    pic: target.picture ? 'true' : undefined,
    back_pic: target.backgroundPicture ? 'true' : undefined,
  })

  return apiRequest<{ message: string }>(`/id/pics/${userId}${search}`, {
    method: 'DELETE',
  })
}

/**
 * DELETE /orchestration/user/:userId
 * Removes a user and everything tied to them across every service.
 * Super admin only.
 */
export function deleteUser(userId: string) {
  return apiRequest<{ status: string; message: string }>(
    `/orchestration/user/${userId}`,
    { method: 'DELETE' },
  )
}
