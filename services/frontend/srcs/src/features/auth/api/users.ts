import type { UserResponse, UsersResponse } from './users.types'
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
