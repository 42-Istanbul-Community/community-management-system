export type JwtPayload = {
  user_id: string
  role: string
  exp?: number
}
