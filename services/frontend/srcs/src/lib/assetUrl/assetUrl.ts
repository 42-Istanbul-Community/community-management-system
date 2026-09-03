const BASE_URL = import.meta.env.BASE_URL

export function assetUrl(path: string | undefined) {
  if (!path) return undefined
  if (path.startsWith('http://') || path.startsWith('https://')) return path

  return `${BASE_URL}/asset/users/${path.startsWith('/') ? path : `/${path}`}`
}
