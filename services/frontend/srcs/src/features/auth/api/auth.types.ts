/** POST /auth/login */
export type LoginPayload = {
  email: string
  password: string
}

/** POST /orchestration/register */
export type RegisterPayload = {
  email: string
  password: string
  name: string
  picture?: File
}

/** POST /auth/login */
export type LoginResponse = {
  token: string
}

/** POST /orchestration/register */
export type RegisterResponse = {
  status: string
  message: string
}

/** POST /orchestration/exchange */
export type ExchangeResponse = {
  token: string
}
