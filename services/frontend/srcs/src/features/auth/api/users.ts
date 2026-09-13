import type {
  UpdateUserPayload,
  UserResponse,
  UsersResponse,
} from './users.types'
import { apiRequest } from '@/lib'

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
 * GET /id/users?ids=
 * Names and pictures for a set of users, so a list does not need one call
 * per row.
 */
export function getUsers(ids: string[]) {
  return apiRequest<UsersResponse>(`/id/users?ids=${ids.join(',')}`)
}

/**
 * PUT /id/:userId
 * Updates the display name or the picture. The file field is called
 * `file` here, while register uses `picture`.
 */
export function updateUser(userId: string, payload: UpdateUserPayload) {
  const formData = new FormData()

  if (payload.name !== undefined) formData.append('name', payload.name)
  if (payload.picture) formData.append('file', payload.picture)

  return apiRequest<UserResponse>(`/id/${userId}`, {
    method: 'PUT',
    body: formData,
  })
}
