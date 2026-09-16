/** A user's role across the whole app. */
export type UserRole = 'super_admin' | 'normal'

/** A user as the API returns it. */
export type ApiUser = {
  id: string
  name: string
  role: UserRole
  picture: string | null
  background_picture: string | null
  createdAt: string
}

/** The short form used when several users are fetched at once. */
export type ApiUserSummary = {
  id: string
  name: string
  picture: string | null
  background_picture: string | null
}

/** PUT /id/:userId — send at least one field. */
export type UpdateUserPayload = {
  name?: string
  picture?: File
  backgroundPicture?: File
}

/**
 * GET /id/
 * GET /id/:userId
 * PUT /id/:userId
 */
export type UserResponse = {
  user: ApiUser
}

/** GET /id/users */
export type UsersQuery = {
  ids?: string[]
  page?: number
  limit?: number
  text?: string
}

/** GET /id/users */
export type UsersResponse = {
  users: ApiUserSummary[]
  page: number
  limit: number
  maxPage: number
  totalCount: number
}
