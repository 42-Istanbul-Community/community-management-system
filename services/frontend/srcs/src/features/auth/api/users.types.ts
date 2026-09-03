export type UserRole = 'super_admin' | 'normal'

export type ApiUser = {
  id: string
  name: string
  role: UserRole
  picture: string | null
  createdAt: string
}

export type UserResponse = {
  user: ApiUser
}

export type ApiUserSummary = {
  id: string
  name: string
  picture: string | null
}

export type UsersResponse = {
  users: ApiUserSummary[]
}

export type UpdateUserPayload = {
  name?: string
  picture?: File
}
