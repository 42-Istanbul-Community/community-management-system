export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`

  const kilobytes = bytes / 1024
  if (kilobytes < 1024) return `${Math.round(kilobytes)} KB`

  const megabytes = kilobytes / 1024
  if (megabytes < 1024) return `${megabytes.toFixed(1).replace('.', ',')} MB`
}
