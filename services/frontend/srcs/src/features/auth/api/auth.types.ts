export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
}

export type RegisterPayload = {
  email: string
  password: string
  name: string
  picture?: File
}

export type RegisterResponse = {
  status: string
  message: string
}

export type ExchangeResponse = {
  token: string
}
