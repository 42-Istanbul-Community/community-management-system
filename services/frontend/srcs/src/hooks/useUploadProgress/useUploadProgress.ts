import { useCallback, useState } from 'react'

import type { AxiosProgressEvent } from 'axios'

/**
 * Tracks upload percentage for an axios request. Pass `onUploadProgress` to
 * the request; `progress` is `null` until the upload starts and resets back
 * to `null` on `reset()` (call it when a mutation settles).
 */
export function useUploadProgress() {
  const [progress, setProgress] = useState<number | null>(null)

  const onUploadProgress = useCallback((event: AxiosProgressEvent) => {
    if (!event.total) return
    setProgress(Math.round((event.loaded / event.total) * 100))
  }, [])

  const reset = useCallback(() => setProgress(null), [])

  return { progress, onUploadProgress, reset }
}
