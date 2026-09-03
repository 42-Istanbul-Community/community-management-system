const BASE_URL = import.meta.env.VITE_API_URL

export function assetUrl(path: string | null | undefined) {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path

  return `${BASE_URL}/asset${path.startsWith('/') ? path : `/${path}`}`
}
