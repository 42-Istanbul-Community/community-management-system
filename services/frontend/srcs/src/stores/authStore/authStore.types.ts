export type AuthUser = {
  id: string
  role: string
}

export type AuthState = {
  token: string | null
  user: AuthUser | null
  setToken: (token: string) => void
  clear: () => void
}
