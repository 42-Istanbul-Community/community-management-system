import { useEffect } from 'react'

const SITE_NAME = 'CMS'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${SITE_NAME} · ${title}` : SITE_NAME
  }, [title])
}
