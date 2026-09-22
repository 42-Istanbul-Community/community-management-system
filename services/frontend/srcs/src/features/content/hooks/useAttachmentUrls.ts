import { useEffect, useState } from 'react'

import type { Attachment } from '@/features/content/api'
import { apiRequest } from '@/lib'

/**
 * A plain `<img src>` or `<a href>` can't send the app's auth headers, so
 * an attachment that needs them (see `Attachment.needsAuth`) has to be
 * fetched through `apiRequest` first and swapped for a local blob URL.
 */
export function useAttachmentUrls(attachments: Attachment[]) {
  const key = attachments.map((item) => item.url).join('|')
  const [blobUrls, setBlobUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    const needsAuth = attachments.filter((item) => item.needsAuth)
    if (needsAuth.length === 0) return

    let cancelled = false
    const objectUrls: string[] = []

    Promise.all(
      needsAuth.map(async (attachment) => {
        try {
          const blob = await apiRequest<Blob>(attachment.url, {
            responseType: 'blob',
          })
          const objectUrl = URL.createObjectURL(blob)

          if (cancelled) {
            URL.revokeObjectURL(objectUrl)
            return null
          }

          objectUrls.push(objectUrl)
          return [attachment.url, objectUrl] as const
        } catch {
          return null
        }
      }),
    ).then((entries) => {
      if (!cancelled) {
        setBlobUrls(
          Object.fromEntries(entries.filter((entry) => entry !== null)),
        )
      }
    })

    return () => {
      cancelled = true
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [attachments, key])

  return attachments.map((item) =>
    item.needsAuth && blobUrls[item.url]
      ? { ...item, url: blobUrls[item.url], needsAuth: false }
      : item,
  )
}
