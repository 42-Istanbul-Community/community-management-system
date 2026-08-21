export type ApiErrorBody = {
  error?: string
  message?: string | { error?: string }
  detail?: string
}

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'DELETE'
  body?: unknown
  token?: string
}
