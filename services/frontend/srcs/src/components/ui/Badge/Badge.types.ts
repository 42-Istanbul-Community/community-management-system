import type { ReactNode } from 'react'

export type BadgeTone =
  'success' | 'warning' | 'danger' | 'info' | 'accent' | 'neutral'

export type BadgeProps = {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}
