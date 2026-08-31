import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'

const tabSegments = [
  'announcements',
  'events',
  'members',
  'applications',
  'settings',
]

function communityTabRoot(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)

  if (parts[0] !== 'communities' || parts.length < 2) return null
  if (parts.length === 2) return parts[1]
  if (parts.length === 3 && tabSegments.includes(parts[2])) return parts[1]

  return null
}

export function RouteAnnouncer() {
  const { pathname } = useLocation()
  const [message, setMessage] = useState('')
  const previousPathname = useRef(pathname)

  useEffect(() => {
    const previous = previousPathname.current
    previousPathname.current = pathname

    const slug = communityTabRoot(pathname)
    const isSameCommunityTab =
      slug !== null && communityTabRoot(previous) === slug

    if (!isSameCommunityTab) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }

    const timeout = setTimeout(() => {
      setMessage(document.title)
    }, 100)

    return () => clearTimeout(timeout)
  }, [pathname])

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  )
}
