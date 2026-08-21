export function startFortyTwoLogin() {
  const clientId = import.meta.env.VITE_42_CLIENT_ID
  const redirectUri = import.meta.env.VITE_42_REDIRECT_URI

  if (!clientId || !redirectUri) {
    console.error('42 OAuth yapılandırması eksik!')
    return
  }

  const state = crypto.randomUUID()

  const url = new URL('https://api.intra.42.fr/oauth/authorize')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('state', state)

  window.location.href = url.toString()
}
