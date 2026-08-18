import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

export function RouteAnnouncer() {
  const { pathname } = useLocation()
  const [message, setMessage] = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })

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
