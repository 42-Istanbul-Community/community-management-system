import type { ReactNode } from 'react'

import { cn } from '../../lib/cn'

export type BadgeTone =
  'success' | 'warning' | 'danger' | 'info' | 'accent' | 'neutral'

const tones: Record<BadgeTone, string> = {
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  accent: 'bg-primary-100 text-primary-700',
  neutral: 'bg-neutral-100 text-neutral-600',
}

type BadgeProps = {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2.5 py-0.75',
        'text-[12px] leading-[1.4] font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
