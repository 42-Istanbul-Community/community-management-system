import { cn } from '../../../lib/cn'
import type { BadgeTone } from './Badge.types'

const base = [
  'inline-flex shrink-0 items-center rounded-full',
  'px-2.5 py-[3px] text-pill font-medium',
].join(' ')

const tones: Record<BadgeTone, string> = {
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  accent: 'bg-primary-100 text-primary-700',
  neutral: 'bg-neutral-100 text-neutral-600',
}

export function badgeStyles(tone: BadgeTone = 'neutral', className?: string) {
  return cn(base, tones[tone], className)
}
