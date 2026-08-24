import type { ReactNode } from 'react'

export type AlertTone = 'success' | 'danger' | 'info'

export type AlertProps = {
  children: ReactNode
  tone?: AlertTone
  className?: string
}
