/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENVIRONMENT: string
  readonly VITE_API_URL: string
  readonly VITE_42_CLIENT_ID: string
  readonly VITE_42_REDIRECT_URI: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_GOOGLE_REDIRECT_URI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
