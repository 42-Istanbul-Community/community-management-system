import type {
  UpdateUserPayload,
  UserResponse,
  UsersResponse,
} from './users.types'
import { apiRequest } from '@/lib'

export function getMe() {
  return apiRequest<UserResponse>('/id/')
}

export function getUser(userId: string) {
  return apiRequest<UserResponse>(`/id/${userId}`)
}

export function getUsers(ids: string[]) {
  return apiRequest<UsersResponse>(`/id/users?ids=${ids.join(',')}`)
}

export function updateUser(userId: string, payload: UpdateUserPayload) {
  const formData = new FormData()

  if (payload.name !== undefined) formData.append('name', payload.name)
  if (payload.picture) formData.append('picture', payload.picture)

  return apiRequest<UserResponse>(`/id/${userId}`, {
    method: 'PUT',
    body: formData,
  })
}
