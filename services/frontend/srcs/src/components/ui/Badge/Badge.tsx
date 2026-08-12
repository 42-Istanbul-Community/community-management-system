import { badgeStyles } from './Badge.styles'
import type { BadgeProps } from './Badge.types'

export function Badge({ children, tone, className }: BadgeProps) {
  return <span className={badgeStyles(tone, className)}>{children}</span>
}
